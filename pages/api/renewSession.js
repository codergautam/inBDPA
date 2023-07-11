import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { createSession, deleteSession, getUserFromProfileId, renewSession } from "@/utils/api";
export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    if(req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    console.log("Renew session", JSON.parse(req.body).sessionId);
    let data = await renewSession(JSON.parse(req.body).sessionId);

    res.json(data);
}