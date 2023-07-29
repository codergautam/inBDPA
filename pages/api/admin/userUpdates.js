import { authenticateUser, forceLogoutUserStatus, getUserByUsername, getUserFromMongo, loginUser, refreshSession, updateUser } from "@/utils/api";
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
      if(status != false) {
        return res.json({success: false, error: "You aren't able to force logout others or yourself"})
      }
    }
    console.log(`Status: ${status}`)
    let data = await forceLogoutUserStatus(userId, status)
    return res.json(data)
  } else if(req.method == "GET") {
    if(req.session.user.type == "administrator") {
        return res.json({success:true, forceLogout: false})
    } else if(req.session.user.impersonating) {
      return res.redirect("/returnToAdmin")
    } else {
        const userId = req.session.user.id
        let user = await getUserFromMongo(userId)
        let shouldRefresh = false
        if(!user) {
          return res.json({success: false, error: "User not found"})
        }
        if(user.refreshSession) {
          //This event only arises when someone else updates a user's type
          req.session.user.type = user.type
          await req.session.save()
          shouldRefresh = true

          //No longer needs to reset session
          await refreshSession(userId, false)
        }
        console.log("User for checking for logout: ", user)
        if(user) {
            return res.json({success: true, forceLogout: user.forceLogout, shouldRefresh })
        }
    }
    // return res.json({success: false})
  }
}