// pages/api/admin/returnToAdmin.js
// This code is a handler function for the "/api/admin/returnToAdmin" route. It protects the route from non-admin users and allows an admin user to return to their dashboard.
//
// The handler function checks if the current user is impersonating a different user. If not, it returns an "Unauthorized" error.
//
// If the user is impersonating, it retrieves the adminId and adminLink from the session. It then calls the getUser function to fetch the user details using the adminId.
//
// If the getUser function is successful, the user details are stored in the session and the session is saved. Finally, the function returns a success response.
//
// If the getUser function fails, the function returns a failure response.
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import { getUser } from "@/utils/api";

export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    //Need to protect this route in case the current user is a non-admin manipulating the route
    if(!req.session.user.impersonating) {
        res.json({success: false, error: "Unauthorized"})
    }

    let adminId = req.session.user.adminId;
    let adminLink = req.session.user.adminLink
    let user = await getUser(adminId);

    // store in session
    if(user.success) {
        req.session.user = {id: user.user.user_id, username: user.user.username, email: user.user.email, type: user.user.type, link: adminLink, salt: user.user.salt, key: user.user.key};
        await req.session.save();
        return res.json({success: true})
    } else {
        return res.send({success: false});
    }
}