// utils/mongo/findProfile.js
// This file contains the code for the "findProfile" function. It is written to retrieve a profile from the MongoDB database based on the provided username. 
// The function takes a username as its argument and uses the "findOne" method of the "Profile" model to search for a profile with a matching username in the database. 
// If a matching profile is found, it is returned as the result of the function. If no matching profile is found, the function returns null.
// This code uses the "async/await" syntax to handle the asynchronous nature of database queries. 
// The "Profile" model is imported from the "./mongoInit" file, which initializes the connection to the MongoDB database. 
// Overall, this code provides a convenient way to find a user profile in the database by username.
import { Profile } from "./mongoInit"

export default async function findProfile(username) {
  return await Profile.findOne({username: username})
}
