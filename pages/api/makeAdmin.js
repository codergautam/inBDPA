import { authenticateUser, getUserByUsername, loginUser, updateUser } from "@/utils/api";
import { NextResponse } from "next/server";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  // THIS CODE BELOW:
  // let ress = await updateUser(req.session.user.id, { type: "administrator" });
  // res.send(ress);
  
  res.send("Please uncomment the code in makeAdmin.js to make yourself an admin")
}