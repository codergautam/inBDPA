// utils/mongo/updateUserTypeInMongo.js
// This file is used to update the "type" field of a user in the MongoDB database.
// It imports the "Profile" model from the "mongoInit" file.
// The function "updateUserTypeInMongo" takes in two parameters: "id" and "type".
// It refreshes the session for the given id by calling the "refreshSession" function.
// Then, it uses the "findOneAndUpdate" method to find the user with the given id in the "Profile" collection and update their "type" field to the new value passed as a parameter.
import { refreshSession } from "../api"
import { Profile } from "./mongoInit"

export default async function updateUserTypeInMongo(id, type) {
  await refreshSession(id, true)
  await Profile.findOneAndUpdate({user_id: id}, {
    $set: {
      type
    }
  })
}