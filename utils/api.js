// utils/api.js
// This handles our app's connection to the HSCC API and MongoDB.
// It exports helper functions used by throughout the app to interact with the API and MongoDB.
// It also exports the sendRequest function, which is used to make API requests.

// Import the necessary modules
import fetch from 'node-fetch';
import { convertHexToBuffer, deriveKeyFromPassword } from './encryptPassword';
import mongoose from 'mongoose';
import generateRandomId from './generateRandomProfileId';
import { config } from 'dotenv';
import md5 from 'blueimp-md5';
import msToTime from './msToTime';
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

// Define MongoDb schemas
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
  forceLogout: Date,
  refreshSession: Boolean,
});

const opportunitySchema = new mongoose.Schema({
  id: ObjectId,
  opportunity_id: String,
  creator_id: String,
  title: String,
  views: Number,
  createdAt: Number,
  content: String,
  activeSessions: Number,
  lastUpdatedActive: Date
});

const Opportunity = mongoose.models.Opportunity ?? mongoose.model('Opportunity', opportunitySchema);

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
async function createNewProfile({ user_id, username, link, pfp, email, type, views }) {
  console.log("username:", username)
  const newProfile = new Profile({
    username,
    user_id,
    link,
    pfp,
    email,
    type,
    views
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
function sanitizeRegex(input) {
  return input.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}


export async function searchUsers(query) {
  try {
    const origQuery = query+'';
    query = sanitizeRegex(query);
    const regexQuery = new RegExp(query, 'i');  // 'i' makes it case insensitive
    const profiles = await Profile.find({
      $or: [
        { username: regexQuery },
        { 'sections.about': regexQuery },
        { link: regexQuery}
      ]
    })
    .sort({ views: -1 }) // Sort by views descending
    .limit(500);

    let users = await Promise.all(profiles.map(async (user) => {

      if (user) {
        user = user.toObject();
        if(user.pfp === "gravatar") {
          user.gravatarUrl = "https://www.gravatar.com/avatar/"+md5(user.email)+"?d=identicon"
        }
        delete user.email;
        // Figure out where the match was found and its position
        const matchField = user.username.match(regexQuery) ? 'username' : user.link.match(regexQuery) ? 'link' : 'about';
        const matchText = matchField === 'about' ? user.sections?.about : user[matchField];
        let matchPosition;
        try {
          matchPosition = matchText.toLowerCase().indexOf(query.toLowerCase());
        } catch (error) {
          matchPosition = null;
        }

        return {
          ...user,
          match: {
            field: matchField,
            position: matchPosition
          }
        };
      }
    }));
    users = users.filter((user) => user !== undefined)
    // Prioritize exact matches
    users.sort((a, b) => {

      let aField = a.match.field === 'about' ? a.sections?.about : a[a.match.field];
      let bField = b.match.field === 'about' ? b.sections?.about : b[b.match.field];
      if (aField.toLowerCase() === query.toLowerCase() && bField.toLowerCase() !== query.toLowerCase()) {
        return -1; // a is exact match, b is not
      }
      if (aField.toLowerCase() !== query.toLowerCase() && bField.toLowerCase() === query.toLowerCase()) {
        return 1; // b is exact match, a is not
      }
      return 0; // neither or both are exact matches
    });

    // Opportunities search

    let opportunities = await Opportunity.find({
      $or: [
        { content: regexQuery },
        { title: regexQuery },
      ]
    })
    .sort({ views: -1 }) // Sort by views descending
    .limit(500);

     opportunities = await Promise.all(opportunities.map(async (opportunity) => {

      if (opportunity) {
        opportunity = opportunity.toObject();

        delete opportunity.creator_id;
        // Figure out where the match was found and its position

        const matchField = opportunity.title.match(regexQuery) ? 'title' : 'content';
        let matchPosition;
        try {
          matchPosition = opportunity[matchField].toLowerCase().indexOf(query.toLowerCase());
        } catch (error) {
          matchPosition = null;
        }

        return {
          ...opportunity,
          match: {
            field: matchField,
            position: matchPosition,
          }
        };
      }
    }));

    // Prioritize exact matches
    opportunities.sort((a, b) => {

      if (a[a.match.field].toLowerCase() === query.toLowerCase() && b[b.match.field].toLowerCase() !== query.toLowerCase()) {
        return -1; // a is exact match, b is not
      }

      if (a[a.match.field].toLowerCase() !== query.toLowerCase() && b[b.match.field].toLowerCase() === query.toLowerCase()) {
        return 1; // b is exact match, a is not
      }
      return 0; // neither or both are exact matches
    });

    return { success: true, users, opportunities };
  } catch (error) {
    console.log('Error while trying to search users: ', error);
    return { success: false, error: "Unexpected Error" };
  }
}


export async function getAllOpportunitiesMongo(limit, opportunity_id_after) {
  try {
      let query = {};
      if (opportunity_id_after) {
          // Fetch the opportunity for opportunity_id_after
          const afterOpportunity = await Opportunity.findOne({ opportunity_id: opportunity_id_after });
          if (afterOpportunity) {
              query.createdAt = { $lt: afterOpportunity.createdAt };
          }
      }

      // Get all opportunities from mongodb, new ones first.
      // Return only limit results, and only return opportunities made after the opportunity_id_after opportunity
      const opportunities = await Opportunity.find(query).sort({createdAt: -1}).limit(limit)
      if (opportunities) {
      // Make sure they are an array of json objects
          return opportunities;
      }
      return false;
  } catch (error) {
      console.log('Error while trying to get opportunities: ', error);
      return false;
  }
}

export async function updateOpportunityMongo(opportunityId, opportunity, specific=false) {
  // Create if not exists
  try {
    if(!specific) {
    const updatedOpportunity = await Opportunity.findOneAndUpdate( { opportunity_id: opportunityId }, opportunity, { new: true, upsert: true } );
    console.log('Opportunity successfully updated: ', updatedOpportunity);
    return true;
    } else {
      const updatedOpportunity = await Opportunity.findOneAndUpdate( { opportunity_id: opportunityId }, opportunity, { new: true } );
      console.log('Opportunity successfully updated: ', updatedOpportunity);
      return true;
    }
  } catch (error) {
    console.log('Error while trying to update opportunity: ', error);
    return false;
  }
}
export async function updateUserMongo(userId, updates) {
  try {
    const updatedProfile = await Profile.findOneAndUpdate(
        { user_id: userId }, // find a document with this filter
        updates, // document to insert when nothing was found
        { new: true, upsert: true } // options
    );
    console.log('Profile successfully updated: ', updatedProfile);
    return true;
  } catch (error) {
    console.log('Error while trying to update profile: ', error);
    return false;
  }
}
export async function getOpportunityMongo(opportunityId) {
  try {
    const opportunity = await Opportunity.findOne({ opportunity_id: opportunityId });
    if (opportunity) {
      return opportunity;
    }
    return false;
  } catch (error) {
    console.log('Error while trying to get opportunity: ', error);
    return false;
  }
}
export async function deleteOpportunityMongo(opportunity_id) {
  try {
    await Opportunity.findOneAndRemove({ opportunity_id: opportunity_id });
    console.log('Opportunity successfully deleted in mongo', opportunity_id);
    return true;
  } catch (error) {
    console.log('Error while trying to delete opportunity: ', error);
    return false;
  }
}
export async function getLatestOpportunitiesMongo(limit) {
  try {
    const opportunities = await Opportunity.find().sort({createdAt: -1}).limit(limit);
    if (opportunities) {
      return opportunities;
    }
    return false;
  } catch (error) {
    console.log('Error while trying to get latest opportunities: ', error);
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

export async function getUserCount() {
  // Use mongodb
  try {
    const count = await Profile.countDocuments();
    return count;
  } catch (error) {
    console.log('Error while trying to get user count: ', error);
    return 0;
  }
}

export async function redeemResetLink(reset_id) {
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
const MAX_REQUESTS_RATE = 3;
const TIME_WINDOW = 1000;

let queue = [];
let lastRequestTime = Date.now();
let currentRequestRate = 0;

async function sendRequest(url, method, body = null) {
  return new Promise((resolve, reject) => {
    // Push the request details into the queue
    queue.push({
      url,
      method,
      body,
      resolve,
      reject
    });
    processQueue();
  });
}

async function processQueue() {
  if(queue.length === 0) return;

  const timeSinceLastRequest = Date.now() - lastRequestTime;

  if(timeSinceLastRequest > TIME_WINDOW) {
    currentRequestRate = 0;
    lastRequestTime = Date.now();
  }

  if(currentRequestRate < MAX_REQUESTS_RATE) {
    // Send a request
    const req = queue.shift();
    currentRequestRate++;
    try {
      const data = await _sendRequest(req.url, req.method, req.body);
      req.resolve(data); // Resolve the Promise
    } catch (error) {
      req.resolve(error); // Reject the Promise
    }
    processQueue(); // Try to process the next request in the queue
  } else {
    // If we have reached the request limit, wait and try again
    setTimeout(processQueue, TIME_WINDOW - timeSinceLastRequest);
  }
}

async function _sendRequest(url, method, body = null) {
  // Define the common headers for all requests
  let headers = {
    'Authorization': 'bearer '+process.env.API_KEY,
    'Content-Type': 'application/json'
  };
  if(method.toLowerCase() === 'delete') {
    delete headers['Content-Type'];
  }


    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
      });
      const data = await response.json();
      if(!response.ok) {
        switch (response.status) {
          case 400:
            return { success: false, error: "Bad request" }
          case 429:
            return {success: false, error: data.retryAfter ? "Too many requests. Please try again in "+msToTime(data.retryAfter) : "Too many requests. Please try again shortly."}
          case 555:
            return { success: false, error: "Something went wrong. Please try again shortly." }
        }
      }
      return data;
    } catch (error) {
      return {success: false, error: "Something went wrong. Please try again shortly."}
      // throw new Error('An error occurred while making the API request');
    }
}

export async function updateUserTypeInMongo(id, type) {
  await refreshSession(id, true)
  await Profile.findOneAndUpdate({user_id: id}, {
    $set: {
      type
    }
  })
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
  const minutes = 20/60 //Yeah, 1 min refresh
  let opp = await Opportunity.find({opportunity_id: opportunityId})

  //Check for if the activeSessions prop actually exists and then whether is a valid time range
  if(opp?.activeSessions && ((new Date()).getTime() - (new Date(opp.lastUpdatedActive)).getTime()) < (Math.pow(10, 3) * minutes)) {
    return { active: opp.activeSessions }
  }

  //Fallback
  const url = `${BASE_URL}/sessions/count-for/opportunity/${opportunityId}`;
  const req = await sendRequest(url, 'GET');


  //Update Mongo
  await Opportunity.updateOne({opportunity_id: opportunityId}, {
    $set: {
      activeSessions: req.active,
      lastUpdatedActive: (new Date())
    }
  })

  //Return original request
  return req
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
    await createNewProfile({ user_id: res.user.user_id, username: res.user.username, link: res.user.link,
      pfp: "gravatar", email: res.user.email, type: res.user.type });
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
      return true;
  } catch (error) {
      console.log('Error while trying to update profile pfp: ', error);
      return false;
  }
};

export async function setUserBanner(userId, banner) {
  // use mongodb
  try {
      const updatedProfile = await Profile.findOneAndUpdate(
          { user_id: userId }, // find a document with this filter
          { banner }, // document to insert when nothing was found
          { new: true, upsert: true } // options
      );
      console.log('Profile banner successfully updated: ', updatedProfile);
      return true;
  } catch (error) {
      console.log('Error while trying to update profile banner: ', error);
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



export async function getUserBanner(userId) {
  try {
    const profile = await Profile.findOne({ user_id: userId });
    if (profile) {
      return profile.banner;
    }
    return false;
  } catch (error) {
    console.log('Error while trying to get profile banner from user id: ', error);
    return false;
  }
}

export async function getUserPfpAndBanner(userId) {
  try {
    const profile = await Profile.findOne({ user_id: userId });
    if (profile) {
      return { pfp: profile.pfp, banner: profile.banner };
    }
    return { pfp: false, banner: false };
  } catch (error) {
    console.log('Error while trying to get profile pfp and banner from user id: ', error);
    return { pfp: false, banner: false };
  }
}

export function getManyUsersFast(user_ids, full=false, getConnections=false) {
  return new Promise((resolve, reject) => {
  Profile.find(user_ids ? { user_id: { $in: user_ids } } : {})
  .then((profiles) => {
    // Create an object with user_id as key and user object as value
    const usersObject = {};
    profiles.forEach((profile) => {
      if(!full) {
      usersObject[profile.user_id] = {
        link: profile.link,
        username: profile.username,
        pfp: profile.pfp,
        user_id: profile.user_id,
        createdAt: profile.createdAt,
        connections: getConnections ? profile.connections : undefined,
        gravatarUrl: !profile.pfp || profile.pfp === 'gravatar' ? `https://www.gravatar.com/avatar/${md5(profile.email)}?d=identicon` : null,
      }
    } else {
      usersObject[profile.user_id] = profile.toObject()
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

export async function increaseViewCountMongo(userId, newViewCount) {

  try {
    if(!newViewCount) {
      // Increment view count
      const updatedProfile = await Profile.findOneAndUpdate(
          { user_id: userId }, // find a document with this filter
          { $inc: { views: 1 } }, // document to insert when nothing was found
          { new: true, upsert: true } // options
      );
      return true;
    } else {
      const updatedProfile = await Profile.findOneAndUpdate(
          { user_id: userId }, // find a document with this filter
          { views: newViewCount }, // document to insert when nothing was found
          { new: true, upsert: true } // options
      );
      return true;
    }
  } catch (error) {
      console.log('Error while trying to update profile views: ', error);
      return false;
  }
};

export async function increaseOpportunityViewCountMongo(opportunityId) {
  try {
    // Increment view count
    const updatedOpportunity = await Opportunity.findOneAndUpdate(
      {opportunity_id: opportunityId},
      { $inc: { views: 1 } },
      { new: true, upsert: true }
    );
    console.log('Opportunity views successfully updated: ', updatedOpportunity);
    return true;
  } catch (error) {
    console.log('Error while trying to update opportunity views: ', error);
    return false;
  }
};

export async function refreshSession(userId, refreshSession) {
  await Profile.findOneAndUpdate({user_id: userId}, {
    $set: {
      refreshSession
    }
  })
}

export async function setForceLogout(userId, date) {
    try {
      await Profile.updateOne({user_id: userId},{ $set: { forceLogout: date } }, {
              new: true,
              upsert: true
            })
            console.log("Updated profile by imposing")
            return {success:true}
    } catch (error) {
      console.log("error: " + error)
      return {success:false}
    }
}

export async function getUserFromMongo(userId) {
  return await Profile.findOne({user_id: userId})
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
    console.log(user)
    if(!user.success) {
      return { success: false, error: user.error ?? "Something went wrong. Please try again shortly."}
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
