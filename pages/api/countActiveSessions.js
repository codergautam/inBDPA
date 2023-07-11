import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { countSessionsForOpportunity, countSessionsForUser, createSession, deleteSession, getUserFromProfileId, renewSession } from "@/utils/api";
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

    let data;
    if(view == "profile") {
       data = await countSessionsForUser(viewed_id);
    } else if(view == "opportunity") {
       data = await countSessionsForOpportunity(viewed_id);

    } else {
      res.status(400).json({ error: "Invalid view" });
      return;
    }

    res.json(data);
}