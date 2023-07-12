import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { createSession, deleteSession, getUserFromProfileId, renewSession, updateUser } from "@/utils/api";
export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    if(req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
      JSON.parse(req.body);
    } catch(e) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    let about = JSON.parse(req.body).about;
    let user = req.session.user;
    if(!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if(typeof about !== "string") {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    let data = await updateUser(user.id, {sections:{about}});
    res.json(data);
}