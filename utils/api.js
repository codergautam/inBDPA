// Import the necessary modules
import fetch from 'node-fetch';
import { convertHexToBuffer, deriveKeyFromPassword } from './encryptPassword';
import mongoose from 'mongoose';
import generateRandomId from './generateRandomProfileId';
import { config } from 'dotenv';
config();
// Define the base URL of the API
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

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const profileSchema = new Schema({
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
});
const Profile = mongoose.models.Profile ?? mongoose.model('Profile', profileSchema);
// addUserNameToSchema()
async function createNewProfile({ user_id, username, link }) {
  console.log("username:", username)
  const newProfile = new Profile({
    username,
    user_id,
    link,
  });

  try {
    // Attempt to save the new profile to the database
    const savedProfile = await newProfile.save();
    console.log('Profile successfully saved: ', savedProfile);
    return false;
  } catch (error) {
   return false;
  }
}

export async function getUserFromProfileId(profileId) {
  try {
    const profile = await Profile.findOne({ link: profileId });
    if (profile) {
      const user = await getUser(profile.user_id);
      if (user) {
        return user;
      }
    }
    return false;
  } catch (error) {
    console.log('Error while trying to get user from profile id: ', error);
    return false;
  }
}

export async function getProfileIdFromUserId(userId) {
  try {
    const profile = await Profile.findOne({ user_id: userId });
    if (profile) {
      return profile.link;
    }
    return false;
  } catch (error) {
    console.log('Error while trying to get profile id from user id: ', error);
    return false;
  }
}

export async function changeProfileLink(user_id, newLink) {
  try {
      const updatedProfile = await Profile.findOneAndUpdate(
          { user_id: user_id }, // find a document with this filter
          { link: newLink }, // document to insert when nothing was found
          { new: true, upsert: true } // options
      );
      console.log('Profile link successfully updated: ', updatedProfile);
  } catch (error) {
      console.log('Error while trying to update profile link: ', error);
  }
}




// Define the sendRequest function to make API requests
let simulateError = false;
async function sendRequest(url, method, body = null) {
  // Define the common headers for all requests
  let headers = {
    'Authorization': 'bearer '+process.env.API_KEY,
    'Content-Type': 'application/json'
  };
  if(method.toLowerCase() === 'delete') {
    delete headers['Content-Type'];
  }

  if(simulateError) {
    return { success: false, error: "Simulated error" }
  } else {
  try {
    // console.log(url, method, body);
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while making the API request');
  }
}
}

// Define the API functions

async function addUserNameToSchema() {
  let profiles = await Profile.find();
  console.log("Profiles:", profiles.slice(0,3))
  for(let i = 0; i < profiles.length; i++) {
    let curr = profiles[i]
    let data = await getUser(curr.user_id)
    if(data.success) {
      await Profile.updateOne({link: curr.link}, { $set: {username: data.user.username}})
    }
  }
}
// Info Endpoints
export async function getInfo() {
  const url = `${BASE_URL}/info`;
  return sendRequest(url, 'GET');
}

// Opportunity Endpoints
export async function getOpportunities(after = null, updatedAfter = null) {
  let url = `${BASE_URL}/opportunities`;
  if (after) {
    url += `?after=${after}`;
  }
  if (updatedAfter) {
    url += `&updatedAfter=${updatedAfter}`;
  }
  return sendRequest(url, 'GET');
}

export async function createOpportunity(opportunity) {
  const url = `${BASE_URL}/opportunities`;
  return sendRequest(url, 'POST', opportunity);
}

export async function getOpportunity(opportunityId) {
  const url = `${BASE_URL}/opportunities/${opportunityId}`;
  return sendRequest(url, 'GET');
}

export async function updateOpportunity(opportunityId, updates) {
  const url = `${BASE_URL}/opportunities/${opportunityId}`;
  return sendRequest(url, 'PATCH', updates);
}

export async function deleteOpportunity(opportunityId) {
  const url = `${BASE_URL}/opportunities/${opportunityId}`;
  return sendRequest(url, 'DELETE');
}

// Session Endpoints
export async function createSession(session) {
  const url = `${BASE_URL}/sessions`;
  return sendRequest(url, 'POST', session);
}

export async function renewSession(sessionId) {
  const url = `${BASE_URL}/sessions/${sessionId}`;
  return sendRequest(url, 'PATCH');
}

export async function deleteSession(sessionId) {
  const url = `${BASE_URL}/sessions/${sessionId}`;
  return sendRequest(url, 'DELETE');
}

export async function countSessionsForUser(userId) {
  const url = `${BASE_URL}/sessions/count-for/user/${userId}`;
  return sendRequest(url, 'GET');
}

export async function countSessionsForOpportunity(opportunityId) {
  const url = `${BASE_URL}/sessions/count-for/opportunity/${opportunityId}`;
  return sendRequest(url, 'GET');
}

// User Endpoints
export async function getUsers(after = null, updatedAfter = null) {
  let url = `${BASE_URL}/users`;
  if (after) {
    url += `?after=${after}`;
  }
  if (updatedAfter) {
    url += `&updatedAfter=${updatedAfter}`;
  }
  try {
  let res = await sendRequest(url, 'GET');
  return res;
} catch (e) {
  return [];
}
}

export async function createUser(user) {
  const url = `${BASE_URL}/users`;

  let res = await sendRequest(url, 'POST', user);
  if(res.success) {
    console.log("Creating new profile");
    res.user.link = generateRandomId();
    await createNewProfile({ user_id: res.user.user_id, username: res.user.username, link: res.user.link });
  }
  return res;

}

export async function getUser(userId) {
  const url = `${BASE_URL}/users/${userId}`;
  return sendRequest(url, 'GET');
}

export async function getUserByUsername(username) {
  const url = `${BASE_URL}/users/${username}`;
  return sendRequest(url, 'GET');
}

export async function updateUser(userId, updates) {
  const url = `${BASE_URL}/users/${userId}`;
  return sendRequest(url, 'PATCH', updates);
}

export async function deleteUser(userId) {
  const url = `${BASE_URL}/users/${userId}`;
  return sendRequest(url, 'DELETE');
}

export async function loginUser(username, password) {
  console.log("Logging in user", username);
let user = await getUserByUsername(username);
console.log(user, user.success);
  if(!user.success) {
    return user;
  }
  const { salt } = user.user;
  const key = await deriveKeyFromPassword(password, convertHexToBuffer(salt));
  let auth = await authenticateUser(user.user.user_id, key.keyString);
  if(auth.success) {
    let link = await getProfileIdFromUserId(user.user.user_id);
    if(!link) {
      // Make a new profile
      link = generateRandomId();
      await createNewProfile({ user_id: user.user.user_id, username: user.user.username, link });
    }
    console.log("Link: ", link);
    user.user.link = link;
    user.user.key = key.keyString;
    return user;
  } else {
    return { success: false, error: "Invalid username or password"}
  }
}

export async function authenticateUser(userId, key) {
  const url = `${BASE_URL}/users/${userId}/auth`;
  return sendRequest(url, 'POST', { key });
}

export async function getUserConnections(userId, after = null) {
  let url = `${BASE_URL}/users/${userId}/connections`;
  if (after) {
    url += `?after=${after}`;
  }
  return sendRequest(url, 'GET');
}

export async function addConnection(userId, connectionId) {
  const url = `${BASE_URL}/users/${userId}/connections/${connectionId}`;
  return sendRequest(url, 'POST');
}

export async function removeConnection(userId, connectionId) {
  const url = `${BASE_URL}/users/${userId}/connections/${connectionId}`;
  return sendRequest(url, 'DELETE');
};
