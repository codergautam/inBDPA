import { authenticateUser, getUserByUsername, loginUser, updateUser } from "@/utils/api";
import { NextResponse } from "next/server";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  const { userId, type } = req.body
  console.log(`Username: ${userId}`)
  console.log(`Type: ${type}`)
  if(type !== "inner" && type !== "staff" && type !== "administrator") res.json({success: false, error: "Invalid type"});
  let data = await updateUser(userId, {type: type});
  console.log("Data: ")
  console.log(data)
  res.json(data);
}