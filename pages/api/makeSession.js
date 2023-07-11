import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { createSession, getUserFromProfileId } from "@/utils/api";
export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    if(req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }


    let {view, viewed_id} = JSON.parse(req.body);

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

    let out = await createSession({ view, viewed_id });
    if(!out.success) {
      console.log(out);
        res.status(500).json({ error: "Error creating session" });
        return;
    }
    console.log("Created session", out);

    res.json(out);
}