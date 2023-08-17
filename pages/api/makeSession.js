// pages/api/makeSession.js
// This code is responsible for creating a session in the inBDPA project. It imports necessary modules and exports the main handler function. The handler function checks if the request method is POST and parses the request body for the required parameters. If the parameters are not valid, it returns an error response. If the view is "profile", it retrieves the user ID from the profile ID. It then calls the createSession function to create a session. If the session creation is successful, it logs the session details and sends a response with the session data.
import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { createSession, getUserFromProfileId } from "@/utils/api";
export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    if(req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }


    let {view, viewed_id, user_id} = JSON.parse(req.body);

    if(!view) {
        res.status(400).json({ error: "Invalid request" });
        return;
    }

    if(view == "profile") {
        let user = await getUserFromProfileId(viewed_id);
        if(!user.success) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        viewed_id = user.user.user_id;
    }

    let out = await createSession({ view, viewed_id, user_id });
    console.log(out);
    if(!out.success) {
        res.status(500).json({ error: "Error creating session" });
        return;
    }
    res.json(out);
}