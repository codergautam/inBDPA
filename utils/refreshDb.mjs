// refreshDb.mjs
// This file periodically updates our MongoDB database with the latest user/opportunity data from the HSCC API.

import axios from 'axios';
import {config } from 'dotenv';
import mongoose from 'mongoose';
import { createUser, updateUser, userExists } from './neo4j.mjs';
config();


const BASE_URL = 'https://inbdpa.api.hscc.bdpa.org/v1';
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((res) => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log(err);
});

const ObjectId = mongoose.Schema.ObjectId;
const profileSchema = new mongoose.Schema({
  id: ObjectId,
  user_id: String,
  username: String,
  link: String,
  email: String,
  type: String,
  views: Number,
  createdAt: Number,
  sections: Object,
  connections: [{
    type: String
}],
});
const Profile = mongoose.models.Profile ?? mongoose.model('Profile', profileSchema);

async function sendRequest(url, method, body = null) {
  // Define the common headers for all requests
  try {
  let headers = {
    'Authorization': 'bearer '+process.env.API_KEY,
    'Content-Type': 'application/json'
  };

  axios.defaults.headers.common = headers;
  // set 10000 ms timeout
  axios.defaults.timeout = 10000;

  try {
    const response = await axios({
      url,
      method,
      data: body
    });
    return response.data;
  } catch (error) {
    return false;
  }
} catch (error) {
  return false;
}
}

async function getUsers(after, updatedAfter) {
  let url = `${BASE_URL}/users`;
  if (after) {
    url += `?after=${after}`;
  }
  if (updatedAfter) {
    url += `&updatedAfter=${updatedAfter}`;
  }
  return sendRequest(url, 'GET');
}

// Utility function to wait for a specified number of milliseconds
async function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// Utility function to generate a random 7-char ID
function generateRandomId() {
  // Random 7 digit alphanumeric string
  let chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 7; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

async function getUserConnections(userId, after) {
  let url = `${BASE_URL}/users/${userId}/connections${after ? `?after=${after}` : ''}`;
  return sendRequest(url, 'GET');
}

async function getAllUserConnections(userId) {
  let connections = [];
  let stop = false;
  let after = undefined;
  while(!stop) {
    let d;
     d = await getUserConnections(userId, after);
    if(d.connections.length == 100) {
      after = d.connections[99];
    } else {
      stop = true;
    }

    connections.push(...d.connections);
    await wait(300);
  }
  return connections;
}

async function createNewProfile(profileData) {
  const newProfile = new Profile(profileData);
  try {
    // Attempt to save the new profile to the database
    const savedProfile = await newProfile.save();
    return true;
  } catch (error) {
    console.log('Error while trying to save profile');
    return false;
  }
}

export default async function fetchDataAndSaveToDB(lastUpdated) {
  console.log("Fetching data from HSCC API...");
  let latestUsers = [];
  let stop = false;
  let after = undefined;
  while(!stop) {
  let d = await getUsers(after, lastUpdated);
  if(!d) {
    latestUsers = [];
    break;
  }
  if(d.users.length == 100) {
    after = d.users[99].user_id;
  } else {
    stop = true;
  }

  latestUsers.push(...d.users);
  await wait(300);
  }

  console.log("Updating database...", latestUsers.length, "users");
  for(let latestUser of latestUsers) {
    // CHECK IF USER EXISTS
    let user = await Profile.findOne({ user_id: latestUser.user_id });
    let existsNeo4j = await userExists(latestUser.user_id);

    if(!user) {
      // CREATE NEW USER
    console.log("Creating new user in db", latestUser.user_id, latestUser.username);

      let userConnections;
      try {
       await getAllUserConnections(latestUser.user_id);
      } catch (error) {
        userConnections = [];
        console.log("Error while trying to fetch connections for user", latestUser.user_id, latestUser.username);
      }

      await createNewProfile({
        user_id: latestUser.user_id,
        username: latestUser.username,
        link: generateRandomId(),
        email: latestUser.email,
        type: latestUser.type,
        views: latestUser.views,
        createdAt: latestUser.createdAt,
        sections: latestUser.sections,
        connections: userConnections,
      });

      try {
      if(!existsNeo4j) {
        await createUser(latestUser.user_id, userConnections);
      } else {
        await updateUser(latestUser.user_id, userConnections);
      }
    } catch (error) {
      console.log("Error while trying to create user in neo4j", latestUser.user_id, latestUser.username);
    }
    } else {
      console.log("Updating user in db", latestUser.user_id, latestUser.username);

      let connections;
      try {
       connections = await getAllUserConnections(latestUser.user_id);
      } catch (error) {
        connections = user.connections ?? [];
      }
      if(!user.link) user.link = generateRandomId();
      user.email = latestUser.email;
      user.type = latestUser.type;
      user.views = latestUser.views;
      user.createdAt = latestUser.createdAt;
      user.sections = latestUser.sections;
      user.connections = connections;
      await user.save();

      try {
      if(!existsNeo4j) {
        await createUser(latestUser.user_id, connections);
      } else {
        await updateUser(latestUser.user_id, connections);
      }
    } catch (error) {
      console.log("Error while trying to set/update user in neo4j", latestUser.user_id, latestUser.username);
    }
    }
  }

  console.log("Done!");
}
