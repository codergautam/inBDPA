// refreshDb.mjs
// This file periodically updates our MongoDB database with the latest user/opportunity data from the HSCC API.

import axios from 'axios';
import {config } from 'dotenv';
import mongoose from 'mongoose';
import { createUser, deleteUser, updateUser, userExists } from './neo4j.mjs';
config();


const BASE_URL = 'https://inbdpa.api.hscc.bdpa.org/v1';
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
  if (updatedAfter && after) {
    url += `&updatedAfter=${updatedAfter}`;
  } else if(updatedAfter) {
    url += `?updatedAfter=${updatedAfter}`;
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

      return false;
    }
  } catch (error) {
    console.log("Error while trying to check if user exists", user_id);
    return {error: true};
  }
}

export default async function fetchDataAndSaveToDB(lastUpdated) {
  try {
  console.log("Fetching data from HSCC API...");
  // Prevent neo4j crash
  await userExists('0')
  let latestUsers = [];
  let stop = false;
  let after = undefined;
  while(!stop) {
    console.log("Fetching users after", after, lastUpdated);
  let d = await getUsers(after, lastUpdated);
  if(!d.users || !d.users.length) break;
  console.log("Fetched", d.users.length, "users");
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
  await wait(API_WAIT_TIME);
  }
  // Reverse so that new users are first
  latestUsers.reverse()

  console.log("Updating database...", latestUsers.length, "users");
  let startTime = Date.now();
  if(!lastUpdated) {
    // Remove users that were not updated
    let users = await Profile.find({});
    for(let user of users) {
      if(!latestUsers.find(u => u.user_id === user.user_id)) {
        // Before removing user make sure they not in the api
        console.log("Step 1")
        let userexistsInDb = await userExistsAPI(user.user_id);
        console.log(userexistsInDb);
        if(userexistsInDb || userexistsInDb.error) continue;
        console.log("Deleting user ", user.username)
        await Profile.deleteOne({ user_id: user.user_id });

        try {
        await deleteUser(user.user_id);
      } catch (error) {
        console.log("Error while trying to delete user in neo4j", user.user_id, user.username);
      }
      }
    }
  }
  let n = 0;
  let users = await Profile.find({});
  for(let latestUser of latestUsers) {
    // CHECK IF USER EXISTS
    // n++;
    // let user = await Profile.findOne({ user_id: latestUser.user_id });
    let user = users.find(u => u.user_id === latestUser.user_id);
    // let existsNeo4j = await userExists(latestUser.user_id);
    // // console.log("Processing "+n+"/"+latestUsers.length)
    if(!user) {
    //   // CREATE NEW USER

    //   let userConnections;
    //   try {
    //    userConnections = await getAllUserConnections(latestUser.user_id);
    //   } catch (error) {
    //     userConnections = [];
    //     console.log("Error while trying to fetch connections for user", latestUser.user_id, latestUser.username);
    //   }

    //   await createNewProfile({
    //     user_id: latestUser.user_id,
    //     username: latestUser.username,
    //     link: generateRandomId(),
    //     email: latestUser.email,
    //     type: latestUser.type,
    //     views: latestUser.views,
    //     createdAt: latestUser.createdAt,
    //     sections: latestUser.sections,
    //     connections: userConnections,
    //     pfp: 'gravatar'
    //   });

    //   try {
    //   if(!existsNeo4j) {
    //     console.log("Creating user in neo4j", latestUser.user_id, latestUser.username, userConnections.length ?? userConnections)
    //     await createUser(latestUser.user_id, userConnections);
    //   } else {
    //     console.log("Updating user in neo4j", latestUser.user_id, latestUser.username, userConnections.length ?? userConnections)
    //     await updateUser(latestUser.user_id, userConnections);
    //   }
    // } catch (error) {
    //   console.log("Error while trying to create user in neo4j", latestUser.user_id, latestUser.username);
    // }
    } else {
      // console.log("Updating user", latestUser.user_id, latestUser.username);

      // let connections;
      // try {
      //  connections = await getAllUserConnections(latestUser.user_id);
      // } catch (error) {
      //   connections = user.connections ?? [];
      // }
      // if(!user.link) user.link = generateRandomId();
      // user.email = latestUser.email;
      // console.log(user.username, user.type, latestUser.type)
      if(user.type!==latestUser.type) {

        console.log("Fixed ",user.username,"'s type!!!")
        user.type = latestUser.type;
      await user.save();

      }
      // user.type = latestUser.type;
      // user.views = latestUser.views;
      // user.createdAt = latestUser.createdAt;
      // user.sections = latestUser.sections;
      // user.connections = connections;

    }
  }

  console.log("Done! Processed "+latestUsers.length+" users in "+(Date.now()-startTime)+"ms ✨");
} catch (error) {
  console.log("Error while trying to fetch data from HSCC API", error);
}
}
