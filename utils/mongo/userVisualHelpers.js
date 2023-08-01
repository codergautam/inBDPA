// utils/mongo/userVisualHelpers.js
// This file contains helper functions for managing user profile pictures and banners in MongoDB. It includes functions to set and retrieve a user's profile picture and banner. The code uses the mongoose library to interact with the MongoDB database.
//
// The `setUserPfp` function takes a `userId` and a `pfp` (profile picture) as parameters and updates the profile document for the specified user with the new profile picture. If no profile document is found for the user, a new one is created. It returns true if the update is successful and false if an error occurs.
//
// The `setUserBanner` function is similar to `setUserPfp`, but it updates the user's profile banner instead.
//
// The `getUserPfp` function takes a `userId` as a parameter and retrieves the profile picture for the specified user. If a profile document is found, it returns the profile picture. Otherwise, it returns false.
//
// The `getUserBanner` function is similar to `getUserPfp`, but it retrieves the user's profile banner instead.
//
// The `getUserPfpAndBanner` function takes a `userId` as a parameter and retrieves both the profile picture and banner for the specified user. If a profile document is found, it returns an object containing the profile picture and banner. Otherwise, it returns an object with both values set to false.
import { Profile } from "./mongoInit";

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