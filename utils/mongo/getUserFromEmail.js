// utils/mongo/getUserFromEmail.js
// This code is a utility function written to get a user from their email address in MongoDB. 
// 
// It imports the Profile model from the mongoInit file, which is assumed to be properly initialized. 
// 
// The function is an async function that takes an email parameter. It uses the findOne method to find a user in the Profile collection with a matching email. If a user is found, it is returned. If no user is found, it returns an object with a success property set to false and an error message indicating that no user was found with that email.
// 
// If an error occurs during the process, it catches the error and logs it to the console. It then returns an object with a success property set to false and an error message indicating an unexpected error.
// 
// The function is exported as the default export from the file, meaning it can be imported into other files using the import statement and can be used to get a user from their email address in MongoDB.
import { Profile } from "./mongoInit";

export default async function getUserFromEmail(email) {
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
