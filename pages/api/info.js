import { getInfo } from "@/utils/api";
import { ironOptions } from "@/utils/ironConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    console.log("Getting info")
    if(req.session.user.type != "administrator") {
        res.json({success: false, error: "Unauthorized"})
    }

    let data = await getInfo();
    res.json(data);
}