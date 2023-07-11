import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { createSession, deleteSession, getUserFromProfileId } from "@/utils/api";
export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    if(req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }



    let data = await deleteSession(JSON.parse(req.body).sessionId);
    console.log("End session", data, JSON.parse(req.body).sessionId);
    res.json(data);
}