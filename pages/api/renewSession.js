// pages/api/renewSession.js
// This code was written to handle a POST request to renew a session. It imports necessary functions from the "/utils" directory and the "iron-session/next" library. It then exports a wrapper function "withIronSessionApiRoute" that takes in a handler function and ironOptions as parameters. The handler function checks if the request method is POST and if not, it sends a "Method not allowed" error response. It then logs the renewal of the session and makes a request to renew the session using the provided sessionId. Finally, it sends the response data as a JSON object.
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