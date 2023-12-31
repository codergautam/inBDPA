// utils/misc/miscHelpers.js
// This file contains various helper functions related to user authentication, profile management, and data updating.
//
// The `refreshSession` function updates the refresh session token for a specific user profile.
//
// The `setForceLogout` function sets a force logout date for a specific user profile.
//
// The `changeUserPassword` function allows a user to change their password by updating it in both the API and MongoDB.
//
// The `incrementUserViews` function increments the view count for a specific user profile.
//
// The `incrementOpportunityViews` function increments the view count for a specific opportunity.
//
// The `loginUser` function handles user login by authenticating the user, generating a new profile if necessary, and returning the user information.
//
// Overall, these functions are important for managing user profiles, updating data, and handling user authentication in the inBDPA project.
import { authenticateUser, createNewProfile, getProfileIdFromUserId, getUser, getUserByUsername, getUserFromEmail, updateArticle, updateOpportunity, updateUser } from "../api"
import { convertHexToBuffer, deriveKeyFromPassword } from "../encryptPassword"
import generateRandomId from "../generateRandomProfileId"
import { Profile } from "../mongo/mongoInit"

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
            return {success:true}
    } catch (error) {
      console.log("error: " + error)
      return {success:false}
    }
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
      return {success: true};
  } catch (error) {
      return {success: false, error: "Unexpected Error"};
  }
}



export async function incrementUserViews(userId) {
  return updateUser(userId, { views: "increment" });
}

export async function incrementOpportunityViews(opportunityId) {
  return updateOpportunity(opportunityId, { views: "increment" });
}

export async function incrementArticleViews(articleId) {
  return updateArticle(articleId, { views: "increment" });
}

export async function loginUser(username, password) {
let user = await getUserByUsername(username);
  if(!user.success) {
    user = await getUserFromEmail(username);
    if(user.error) {
      return { success: false, error: user.error.includes("No user found") ? "Could not find any user with that username or email" : user.error}
    }
    user = await getUser(user.user_id);
    if(!user.success) {
      return { success: false, error: user.error ?? "Something went wrong. Please try again shortly."}
    }
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
    user.user.link = link;
    user.user.key = key.keyString;
    return user;
  } else {
    return { success: false, error: "Invalid username or password"}
  }
}