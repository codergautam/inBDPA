import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import { getUser } from "@/utils/api";

export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    const { username } = req.body;
    if(!username) {
        res.json({success: false, error: "Didn't provide a username or emial"})
    }
    let data = await getUser(username);
    res.json(data)
}