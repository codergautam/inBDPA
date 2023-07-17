import { authenticateUser, forceLogoutUserStatus, getUserByUsername, getUserFromMongo, loginUser, updateUser } from "@/utils/api";
import { NextResponse } from "next/server";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  if(!req.session.user) {
    return res.json({success: false, error: "You aren't logged in"})
  }
  if(req.method == "POST") {
    let userId, status
    if(req.session.user.type == "administrator") {
      //Forcing logout from admin view
      userId = req.body.userId
      status = req.body.status
    } else {
      //This is a regular user disabling their forced logout status
      userId = req.session.user.id
      status = req.body.status
    }
    console.log(`Status: ${status}`)
    let data = await forceLogoutUserStatus(userId, status)
    return res.json(data)
    // console.log(data)
    // if(data.success) {
    //   return res.json({success: true})
    // } else {
    //   return res.json({success: false, error: "Failed to logout user at this moment"})
    // }
  } else if(req.method == "GET") {
    if(req.session.user.type == "administrator") {
        return res.json({success:true, forceLogout: false})
    } else {
        const userId = req.session.user.id
        let user = await getUserFromMongo(userId)
        console.log("User for checking for logout: ", user)
        if(user) {
            return res.json({success: true, forceLogout: user.forceLogout})
        }
    }
    // return res.json({success: false})
  }
}