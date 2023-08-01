// utils/mongo/getUserFromProfileId.js
// This code is written to retrieve a user from a given profile ID. 
// 
// The code imports the Profile model from the "mongoInit" module.
// 
// The code defines an asynchronous function called "getUserFromProfileId" which takes a profileId as a parameter.
// 
// Inside the function, it attempts to find a profile in the database using the profileId.
// 
// If a profile is found, it then calls the "getUser" function with the corresponding user_id from the profile.
// 
// If a user is found, it returns the user object.
// 
// If either the profile or the user is not found, it returns an error object with the "success" property set to false and an error message.
// 
// If an error occurs during the process, it logs the error to the console and returns an error object with the "success" property set to false and a generic error message.
import { Profile } from "./mongoInit";

export default async function getUserFromProfileId(profileId) {
  try {
    const profile = await Profile.findOne({ link: profileId.toLowerCase() });
    if (profile) {
      const user = await getUser(profile.user_id);
      if (user) {
        return user;
      }
    }
    return {success: false, error: "User not found"};
  } catch (error) {
    console.log('Error while trying to get user from profile id: ', error);
    return { success: false, error: "Unexpected Error" };
  }
}
