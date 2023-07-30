import { setForceLogout, getUser, getUserFromMongo } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  if(!req.session.user) {
    return res.json({success: false, error: "You aren't logged in"})
  }
  if(req.method == "POST") {
    let {userId} = req.body
    if(req.session.user.type == "administrator") {
      //Forcing logout from admin view
      userId = req.body.userId
      let data = await setForceLogout(userId, (new Date()))
      return res.json(data)
    } else {
      //This is a regular user disabling their forced logout status
      userId = req.session.user.id
      let d = new Date()
      //Makes it impossible for them to be forced out again, this prevents them from logging back in and being logged out again
      let data = await setForceLogout(userId, (new Date(d.getTime() - (Math.pow(10, 3) * 60 * 1.2))))
      return res.json(data)
    }
  } else if(req.method == "GET") {
    if(req.session.user.type == "administrator") {
        return res.json({success:true})
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

        ///If they must be forced to logout but impersonation is occuring
        if((new Date()).getTime() - (new Date(user.forceLogout)).getTime() < (Math.pow(10, 3) * 60)) {
          if(req.session.user.impersonating) {
            console.log("Impersonation going on")

            let adminId = req.session.user.adminId;
            let adminLink = req.session.user.adminLink
            let user = await getUser(adminId);

            // store in session
            if(user.success) {
                req.session.user = {id: user.user.user_id, username: user.user.username, email: user.user.email, type: user.user.type, link: adminLink, salt: user.user.salt, key: user.user.key};
                console.log(req.session.user);
                await req.session.save();
                return res.json({success: true, leave: true, imp: true})
            } else {
                return res.send({success: false});
            }
          }
        }

        if(user) {
            return res.json({ success: true, forceLogout: user.forceLogout, shouldRefresh })
        }
    }
    // return res.json({success: false})
  }
}