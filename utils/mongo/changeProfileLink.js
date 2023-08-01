// utils/mongo/changeProfileLink.js
// This code is responsible for changing the profile link of a user in the MongoDB database. It is a function that takes in the user_id and the newLink as parameters. It uses the Profile model from the mongoInit file to access the MongoDB collection.
//
// The function uses the findOneAndUpdate method to find a document in the Profile collection with the given user_id and update its link field with the newLink. If no document is found, it inserts a new document with the updated link.
//
// The function returns the updatedProfile document after the update or insert operation is complete. If there is an error during the update operation, it catches the error and logs an error message. Otherwise, it logs a success message along with the updatedProfile document.
//
// This code is designed to be used as a utility function for updating the profile link of a user in the MongoDB database.
import { Profile } from "./mongoInit";

export default async function changeProfileLink(user_id, newLink) {
  try {
      const updatedProfile = await Profile.findOneAndUpdate(
          { user_id: user_id }, // find a document with this filter
          { link: newLink }, // document to insert when nothing was found
          { new: true, upsert: true } // options
      );
  } catch (error) {
      console.log('Error while trying to update profile link: ', error);
  }
}
