// utils/mongo/createNewProfile.js
// This file contains a function named "createNewProfile" that is used to create a new user profile in a MongoDB database. The function takes in various parameters such as user_id, username, link, pfp, email, type, and views. After creating a new Profile object with these parameters, the function attempts to save the profile to the database. If successful, it logs a success message to the console and returns false. If there is an error, it catches the error and also returns false.
import { Profile } from "./mongoInit";
export default async function createNewProfile({ user_id, username, link, pfp, email, type, views }) {
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