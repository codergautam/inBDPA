// utils/mongo/getUserCount.js
// This file is a utility function that retrieves the total number of users in the database. It uses the mongoose library to interact with the MongoDB database.
// 
// The function 'getUserCount' is an asynchronous function that makes use of the 'Profile' model from the 'mongoInit' file.
// 
// Inside the function, it first tries to retrieve the count of documents in the 'Profile' collection using the 'countDocuments' method of the 'Profile' model.
// 
// If successful, it returns the count. If an error occurs, it logs an error message to the console and returns 0.
import { Profile } from "./mongoInit";

export default async function getUserCount() {
  // Use mongodb
  try {
    const count = await Profile.countDocuments();
    return count;
  } catch (error) {
    console.log('Error while trying to get user count: ', error);
    return 0;
  }
}