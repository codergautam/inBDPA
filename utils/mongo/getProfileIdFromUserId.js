// utils/mongo/getProfileIdFromUserId.js
// This file contains a function that retrieves the profile ID from a given user ID in the MongoDB database. The function uses the "Profile" model from the "mongoInit" file. 
// 
// The function takes a user ID as a parameter and tries to find a profile document in the database that matches the user ID. If a match is found, the function returns the lowercase link of the profile. If no match is found, the function returns false.
// 
// If any error occurs during the execution of the function, an error message is logged to the console and the function also returns false.
import { Profile } from "./mongoInit";

export default async function getProfileIdFromUserId(userId) {
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