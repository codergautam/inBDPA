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
  pfp: String,
  banner: String,
});

const resetSchema = new Schema({
  id: ObjectId,
  user_id: String,
  reset_id: String,
  createdAt: Number,
  used: Boolean
});

const Profile = mongoose.models.Profile ?? mongoose.model('Profile', profileSchema);
const Reset = mongoose.models.Reset ?? mongoose.model('Reset', resetSchema);
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

export async function findProfile(username) {
  return await Profile.findOne({username: username})
}

export async function getUserFromProfileId(profileId) {
  try {
    const profile = await Profile.findOne({ link: profileId.toLowerCase() });
    if (profile) {
      const user = await getUser(profile.user_id);
      if (user) {
        return user;
      }
    }
    return {success: false, error: "User not found"};
  } catch (error) {
    console.log('Error while trying to get user from profile id: ', error);
    return { success: false, error: "Unexpected Error" };
  }
}

export async function getProfileIdFromUserId(userId) {
  try {
    const profile = await Profile.findOne({ user_id: userId });
    if (profile) {
      return profile.link.toLowerCase();
    }
    return false;
  } catch (error) {
    console.log('Error while trying to get profile id from user id: ', error);
    return false;
  }
}

export async function getUserFromEmail(email) {
  // Get user from email
  try {
    const user = await Profile.findOne({ email: email });
    if (user) {
      return user;
    }
    return {success: false, error: "No user found with that email"};
  } catch (error) {
    console.log('Error while trying to get user from email: ', error);
    return { success: false, error: "Unexpected Error"};
  }
}

export async function createResetLink(email) {
  // Get user from email
  let user = await getUserFromEmail(email);
  if(user.error) {
    return user;
  }
  // Create reset link
  const reset_id = generateRandomId();
  const newReset = new Reset({
    user_id: user.user_id,
    reset_id,
    createdAt: Date.now(),
  });

  try {
    // Attempt to save the new profile to the database
    const savedReset = await newReset.save();
    console.log('Reset successfully saved: ', savedReset);
    return { success: true, reset_id };
  } catch (error) {
    console.log('Error while trying to save reset: ', error);
    return { success: false, error: "Unexpected Error" };
  }
}

export async function getResetLink(reset_id) {
  try {
    // Retrieve user from reset link
    const savedReset = await Reset.findOne({ reset_id: reset_id });
    if (savedReset) {
      return savedReset;
    }
    return { success: false, error: "Invalid Reset Link" };
  } catch (error) {
    console.log('Error while trying to get reset link: ', error);
    return { success: false, error: "Unexpected Error" };
  }
}

export async function useResetLink(reset_id) {
  try {
    // Retrieve user from reset link
    const savedReset = await Reset.findOneAndUpdate(
        { reset_id: reset_id }, // find a document with this filter
        { used: true }, // document to insert when nothing was found
        { new: true, upsert: true } // options
    );
    if (savedReset) {
      return {success: true};
    }
    return { success: false, error: "Invalid Reset Link" };
  } catch (error) {
    console.log('Error while trying to get reset link: ', error);
    return { success: false, error: "Unexpected Error" };
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

  if(simulateError && Math.random() < 0.5) {
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

export async function setUserPfp(userId, pfp) {
  // use mongodb
  try {
      const updatedProfile = await Profile.findOneAndUpdate(
          { user_id: userId }, // find a document with this filter
          { pfp }, // document to insert when nothing was found
          { new: true, upsert: true } // options
      );
      console.log('Profile pfp successfully updated: ', updatedProfile);
      return true;
  } catch (error) {
      console.log('Error while trying to update profile pfp: ', error);
      return false;
  }
};

export async function getUserPfp(userId) {
  try {
    const profile = await Profile.findOne({ user_id: userId });
    if (profile) {
      return profile.pfp;
    }
    return false;
  } catch (error) {
    console.log('Error while trying to get profile pfp from user id: ', error);
    return false;
  }
}

export  function getManyUsersFast(user_ids) {
  return new Promise((resolve, reject) => {
  Profile.find({ user_id: { $in: user_ids } })
  .then((profiles) => {
    // Create an object with user_id as key and user object as value
    const usersObject = {};
    profiles.forEach((profile) => {
      usersObject[profile.user_id] = {
        link: profile.link,
        username: profile.username,
        pfp: profile.pfp,
      }
    });

    resolve(usersObject);
  })
  .catch((error) => {
    console.error(error);
    reject(error);
  });
});
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

export async function changeUserPassword(user_id, password) {
  // Get user from user_id
  let user = await getUser(user_id);
  if(user.error) {
    return user;
  }
  // Encrypt password
  const { keyString, saltString } = await deriveKeyFromPassword(password);
  // Update user
  // First in API
  try {
  await updateUser(user_id, { key: keyString, salt: saltString });
  } catch (e) {
    console.log("Error updating user: ", e);
    return {success: false, error: "Unexpected Error"};
  }

  // Then in MongoDB
  try {
      const updatedUser = await Profile.findOneAndUpdate(
          { user_id: user_id }, // find a document with this filter
          { key: keyString, salt: saltString }, // document to insert when nothing was found
          { new: true, upsert: true } // options
      );
      console.log('User successfully updated: ', updatedUser);
      return {success: true};
  } catch (error) {
      console.log('Error while trying to update user: ', error);
      return {success: false, error: "Unexpected Error"};
  }
}



export async function incrementUserViews(userId) {
  return updateUser(userId, { views: "increment" });
}

export async function incrementOpportunityViews(opportunityId) {
  return updateOpportunity(opportunityId, { views: "increment" });
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
    user = await getUserFromEmail(username);
    if(user.error) {
      return { success: false, error: user.error.includes("No user found") ? "Could not find any user with that username or email" : user.error}
    }
    user = await getUser(user.user_id);
    if(!user.success) {
      return { success: false, error: user.error}
    }
    console.log("User: ", user);
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
