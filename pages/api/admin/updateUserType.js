// pages/api/admin/updateUserType.js
// This code is for updating the user type in the database for the inBDPA project. It is an API route that requires authentication and only allows administrators to access it. 
// 
// The code first imports necessary functions and modules from other files. 
// 
// Then, it defines the API route handler function. Inside the handler function, it checks if the user's type is "administrator". If not, it returns an error response. 
// 
// Next, it extracts the userId and type from the request body. 
// 
// After that, it checks if the type is valid. If not, it returns an error response. 
// 
// Then, it calls the updateUser function to update the user's type in the in-memory database. 
// 
// Next, it logs the updated data. 
// 
// After that, it calls the updateUserTypeInMongo function to update the user's type in the MongoDB database. 
// 
// Finally, it sends the updated data as a JSON response.
import { authenticateUser, getUserByUsername, loginUser, updateUser, updateUserTypeInMongo } from "@/utils/api";
import { NextResponse } from "next/server";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  if(req.session.user.type != "administrator") {
      res.json({success: false, error: "Unauthorized"})
  }

  const { userId, type } = req.body
  console.log(`Username: ${userId}`)
  console.log(`Type: ${type}`)
  if(type !== "inner" && type !== "staff" && type !== "administrator") res.json({success: false, error: "Invalid type"});
  let data = await updateUser(userId, {type: type});
  console.log("Data: ")
  console.log(data)
  await updateUserTypeInMongo(userId, type)
  res.json(data);
}