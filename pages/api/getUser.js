import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import { findProfile, getUser } from "@/utils/api";

export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    const { username } = req.body;
    if(!username) {
        res.json({success: false, error: "Didn't provide a username or email"})
    }
    let newProf = await findProfile(username)
    console.log("Profile:", newProf)
    if(newProf) {
        console.log("Sending req")
        let data = await getUser(username);
        res.json({success: true, user: data.user})
    } else {
        res.json({success: false})
    }
    // res.json(data)
}