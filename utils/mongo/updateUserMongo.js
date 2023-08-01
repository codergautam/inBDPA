// utils/mongo/updateUserMongo.js
// This file contains a function to update a user's profile in MongoDB. 
// 
// The updateUserMongo function takes in two parameters: userId (the ID of the user to update) and updates (an object containing the updated profile information). 
// 
// Inside the function, it uses the findOneAndUpdate method from the Profile collection to find a document with the user_id matching the provided userId. It then updates the document with the information in the updates object. If no document is found, it inserts a new document with the provided updates. 
// 
// The function also includes the options new: true (to return the updated document) and upsert: true (to insert a new document if none is found). 
// 
// If the profile is successfully updated, the function logs a success message to the console and returns true. If there is an error during the update, it logs an error message to the console and returns false.
import { Profile } from "./mongoInit";
export default async function updateUserMongo(userId, updates) {
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