// utils/mongo/getUserFromMongo.js
// This code is written to retrieve a user's profile from MongoDB based on their user ID. 
// The code imports the "Profile" model from the "mongoInit" file. 
// It defines an asynchronous function named "getUserFromMongo" that takes a user ID as a parameter. 
// Inside the function, it uses the "findOne" method of the "Profile" model to search for a profile document in the MongoDB collection. 
// The search is done based on the user ID passed as an argument. 
// The function returns the profile document found in the database.
import { Profile } from "./mongoInit"

export default async function getUserFromMongo(userId) {
  return await Profile.findOne({user_id: userId})
}
