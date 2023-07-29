import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import { findProfile, getUser } from "@/utils/api";

export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    const { username } = req.body;
    if(!username) {
        return res.json({success: false, error: "Didn't provide a username or email"})
    }
    // make sure admin
    if(!req.session.user || req.session.user.type !== "administrator") {
        return res.json({success: false, error: "Not authorized"})
    }

    let newProf = await findProfile(username)
    console.log("Profile:", newProf)
    if(newProf) {
        console.log("Sending req")
        let data = await getUser(username);
        data.user.link = newProf.link;
        return res.json({success: true, user: data.user})
    } else {
       return res.json({success: false})
    }
    // res.json(data)
}