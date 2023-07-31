// pages/api/updateUserSection.js
// This code is responsible for handling the API request to update a user's section. It checks if the user is authenticated and then updates the sections of the user both in the session and in the MongoDB database.
// 
// The `import` statements are used to import necessary functions and modules from other files.
// 
// The `withIronSessionApiRoute` function is used to wrap the `handler` function with Iron session functionality.
// 
// The `handler` function is the main function that is called when the API request is made. It retrieves the section and content from the request body and checks if the user is logged in. If the user is not logged in, it returns an error message.
// 
// The `updateUser` function is used to update the sections of the user in the session. It passes the user's ID and the updated sections as parameters.
// 
// The console logs are used for debugging purposes to show the updated sections and the data returned from the `updateUser` function.
// 
// Lastly, it sends the updated data as a response to the API request.
// 
// Overall, this code allows an authenticated user to update their sections with the provided content.
import { authenticateUser, getUserByUsername, loginUser, updateUser, updateUserMongo } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  const { section, content } = req.body
  const user = req.session.user;
  if(!user) {
    return res.json({success: false, error: "Not logged in"});
  }
  let data = await updateUser(user.id, {sections: {[section]: content}});
  // Update mongodb
  console.log("Updating mongodb", user.id, {sections: {[section]: content}})
  await updateUserMongo(user.id, {sections: {[section]: content}}, true);

  console.log("Data: ")
  console.log(data)
  res.json(data);
}