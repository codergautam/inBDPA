// utils/mongo/getManyUsersFast.js
// This code provides a function that retrieves multiple user profiles from the database quickly. It accepts an array of user_ids and returns a promise that resolves to an object containing the user profiles. The function has two optional parameters: "full" and "getConnections". If "full" is set to true, the function will return the full user profile objects, otherwise it will only return certain fields. If "getConnections" is set to true, the function will include the connections field in the returned user profiles. The function first queries the database to find the profiles that match the given user_ids. It then creates an object with user_id as the key and user object as the value. For each profile, it checks if full is false and adds only certain fields to the user object, otherwise it adds the full profile object. Finally, it resolves the promise with the created user object.
import md5 from "blueimp-md5";
import { Profile } from "./mongoInit";

export default function getManyUsersFast(user_ids, full=false, getConnections=false) {
  return new Promise((resolve, reject) => {
  Profile.find(user_ids ? { user_id: { $in: user_ids } } : {})
  .then((profiles) => {
    // Create an object with user_id as key and user object as value
    const usersObject = {};
    profiles.forEach((profile) => {
      if(!full) {
      usersObject[profile.user_id] = {
        link: profile.link,
        username: profile.username,
        pfp: profile.pfp,
        user_id: profile.user_id,
        createdAt: profile.createdAt,
        connections: getConnections ? profile.connections : undefined,
        gravatarUrl: !profile.pfp || profile.pfp === 'gravatar' ? `https://www.gravatar.com/avatar/${md5(profile.email)}?d=identicon` : null,
      }
    } else {
      usersObject[profile.user_id] = profile.toObject()
    }
    });

    resolve(usersObject);
  })
  .catch((error) => {
    console.error(error);
    reject(error);
  });
});
}