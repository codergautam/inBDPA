import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import { getUser } from "@/utils/api";

export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    //Need to protect this route in case the current user is a non-admin manipulating the route
    let adminId = req.session.user.adminId;
    let adminLink = req.session.user.adminLink
    let user = await getUser(adminId);

    // store in session
    if(user.success) {
        req.session.user = {id: user.user.user_id, username: user.user.username, email: user.user.email, type: user.user.type, link: adminLink, salt: user.user.salt, key: user.user.key};
        console.log(req.session.user);
        await req.session.save();
        return res.json({success: true})
    } else {
        return res.send({success: false});
    }
}