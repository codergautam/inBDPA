import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import { getUser } from "@/utils/api";
import mongoose from "mongoose";

const Profile = mongoose.models.Profile ?? mongoose.model('Profile', profileSchema);

export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    const { username } = req.body;
    if(!username) {
        res.json({success: false, error: "Didn't provide a username or emial"})
    }
    let newProf = await Profile.findOne({username: username})
    if(newProf) {
        console.log("Sending req")
        let data = await getUser(username);
        res.json({success: true, user: data.user})
    } else {
        res.json({success: false})
    }
    // res.json(data)
}