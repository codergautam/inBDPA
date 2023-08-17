// refreshDb.mjs
// This file periodically updates our MongoDB database with the latest user/opportunity data from the HSCC API.

import axios from 'axios';
import {config } from 'dotenv';
import mongoose from 'mongoose';
import { createUser, deleteAllUsers, deleteUser, updateUser, userExists } from './neo4j.mjs';
config();


const BASE_URL = 'https://inbdpa.api.hscc.bdpa.org/v2';
const MONGO_URI = process.env.MONGO_URI;
const API_WAIT_TIME = 2000;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((res) => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log(err);
});

async function getAllOpportunitiesMongo() {
  const opportunities = await Opportunity.find();
  return opportunities;
}

async function getOpportunities(after = null, updatedAfter = null) {
  let url = `${BASE_URL}/opportunities`;
  if (after) {
    url += `?after=${after}`;
  }
  if (updatedAfter) {
    url += `&updatedAfter=${updatedAfter}`;
  }
  return sendRequest(url, 'GET');
}

async function getOpportunity(opportunityId) {
  const url = `${BASE_URL}/opportunities/${opportunityId}`;
  return sendRequest(url, 'GET');
}

 async function updateOpportunityMongo(opportunityId, opportunity) {
// Create if not exists
try {
  const updatedOpportunity = await Opportunity.findOneAndUpdate( { opportunity_id: opportunityId }, opportunity, { new: true, upsert: true } );
  return true;
} catch (error) {
  console.log('Error while trying to update opportunity: ', error);
  return false;
}
}

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
  connections: [String],
pfp: String,
banner: String,
});
const opportunitySchema = new mongoose.Schema({
  id: ObjectId,
  opportunity_id: String,
  creator_id: String,
  title: String,
  views: Number,
  createdAt: Number,
  content: String,
});

const Opportunity = mongoose.models.Opportunity ?? mongoose.model('Opportunity', opportunitySchema);
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
    console.log('Error while trying to send request: ', error);
    return false;
  }
} catch (error) {
  console.log("Error while trying to send request: ", error);
  return false;
}
}

async function getUsers(after, updatedAfter) {
  let url = `${BASE_URL}/users`;
  if (after) {
    url += `?after=${after}`;
  }
  if (updatedAfter && after) {
    url += `&updatedAfter=${updatedAfter}`;
  } else  if(updatedAfter) {
    url += `?updatedAfter=${updatedAfter}`
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
    await wait(API_WAIT_TIME);
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

async function getAllOpportunities(lastUpdated) {
  let opportunities = [];
  let stop = false;
  let after = undefined;
  while(!stop) {
    let d;
     d = await getOpportunities(after, lastUpdated);
     if(!d.opportunities) {
      return false;
     }
    if(d.opportunities.length == 100) {
      after = d.opportunities[99].opportunity_id;
    } else {
      stop = true;
    }

    for(let i = 0; i < d.opportunities.length; i++) {
      let opportunity = d.opportunities[i];
      let fullData = await getOpportunity(opportunity.opportunity_id);
      if(fullData && fullData.success && fullData.opportunity) {
        d.opportunities[i].content = fullData.opportunity.contents;
      }
      await wait(API_WAIT_TIME);
    }

    opportunities.push(...d.opportunities);
    await wait(API_WAIT_TIME);
  }
  return opportunities;
}

async function deleteOpportunityMongo(opportunityId) {
  try {
    // Attempt to delete the opportunity from the database
    const result = await Opportunity.deleteOne({ opportunity_id: opportunityId });
    if (result.deletedCount === 1) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function userExistsAPI(user_id) {
  try {
    let url = `${BASE_URL}/users/${user_id}`;

    let data = await(sendRequest(url, 'GET'));
    if(data && data.success && data.user?.user_id) {
      return true
    } else {
      // console.log(userExistsAPI(user_id))
      // if(!data || !data?.success) {
      //   return {error: true}
      // }
      return false;
    }
  } catch (error) {
    console.log("Error while trying to check if user exists", user_id);
    return {error: true};
  }
}

export default async function fetchDataAndSaveToDB() {
  await deleteAllUsers();
  let usersMongo = await Profile.find();
  usersMongo.forEach(async (user) => {
    await createUser(user.user_id, user.connections)
    console.log(user.username, user.user_id, user.connections)
  });
}
