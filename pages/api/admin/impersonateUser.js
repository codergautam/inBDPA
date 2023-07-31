// pages/api/admin/impersonateUser.js
// This code is written to handle the API route for impersonating a user by an admin. It checks if the current user is an admin, and if not, it returns an unauthorized error. It then gets the user ID and admin information from the request body and session. It retrieves the user's profile link and logs it, along with the user ID, admin ID, admin link, and user object. If the user retrieval is successful, it stores the user information in the session and returns a success response. If not, it returns a failure response.
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import { getUser } from "@/utils/api";
import { getProfileIdFromUserId } from "@/utils/api";

export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    //Need to protect this route in case the current user is a non-admin manipulating the route
    if(req.session.user.type != "administrator") {
        res.json({success: false, error: "Unauthorized"})
    }

    let { userId } = req.body;
    let adminId = req.session.user.id;
    let adminLink = req.session.user.link;

    let user = await getUser(userId);
    let userLink = await getProfileIdFromUserId(user.user.user_id);
    console.log("Link: " + userLink)
    console.log("User Id: " + userId)
    console.log(`Admin Id: ${adminId}, Admin Link: ${adminLink}`)
    console.log(user)

    // store in session
    if(user.success) {
        req.session.user = {id: user.user.user_id, username: user.user.username, email: user.user.email, type: user.user.type, link: userLink, salt: user.user.salt, key: user.user.key, impersonating: true, adminId: adminId, adminLink: adminLink};
        console.log(req.session.user);
        await req.session.save();
        return res.json({success: true})
    } else {
        return res.send({success: false});
    }
}