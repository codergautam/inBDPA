// utils/mongo/resetHelpers.js
// This code file contains helper functions for managing reset links in MongoDB. The functions allow for creating, retrieving, and redeeming reset links.
//
// The `createResetLink` function takes an email as input, retrieves the user associated with that email, generates a random reset ID, and saves the reset link in the database. It returns a success message along with the reset ID if successful, or an error message if there was an issue.
//
// The `getResetLink` function takes a reset ID as input and retrieves the corresponding reset link from the database. If the reset link is found, it is returned. Otherwise, an error message is returned.
//
// The `redeemResetLink` function takes a reset ID as input and marks the corresponding reset link as used in the database. If the redemption is successful, a success message is returned. Otherwise, an error message is returned.
//
// Each function includes error handling and logs any errors that occur during the database operations.
import generateRandomId from "../generateRandomProfileId";
import getUserFromEmail from "./getUserFromEmail";
import { Reset } from "./mongoInit";

export async function createResetLink(email) {
  // Get user from email
  let user = await getUserFromEmail(email);
  if(user.error) {
    return user;
  }
  // Create reset link
  const reset_id = generateRandomId();
  const newReset = new Reset({
    user_id: user.user_id,
    reset_id,
    createdAt: Date.now(),
  });

  try {
    // Attempt to save the new profile to the database
    const savedReset = await newReset.save();
    return { success: true, reset_id };
  } catch (error) {
    console.log('Error while trying to save reset: ', error);
    return { success: false, error: "Unexpected Error" };
  }
}

export async function getResetLink(reset_id) {
  try {
    // Retrieve user from reset link
    const savedReset = await Reset.findOne({ reset_id: reset_id });
    if (savedReset) {
      return savedReset;
    }
    return { success: false, error: "Invalid Reset Link" };
  } catch (error) {
    console.log('Error while trying to get reset link: ', error);
    return { success: false, error: "Unexpected Error" };
  }
}

export async function redeemResetLink(reset_id) {
  try {
    // Retrieve user from reset link
    const savedReset = await Reset.findOneAndUpdate(
        { reset_id: reset_id }, // find a document with this filter
        { used: true }, // document to insert when nothing was found
        { new: true, upsert: true } // options
    );
    if (savedReset) {
      return {success: true};
    }
    return { success: false, error: "Invalid Reset Link" };
  } catch (error) {
    console.log('Error while trying to get reset link: ', error);
    return { success: false, error: "Unexpected Error" };
  }
}