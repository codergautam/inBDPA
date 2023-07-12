import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { changeProfileLink, getUserFromProfileId } from "@/utils/api";
export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    if(req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    if(!req.session?.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      JSON.parse(req.body);
    } catch(e) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    let newLink = JSON.parse(req.body).newLink;

    // Verify its alphanumeric
    if(!newLink.match(/^[a-z0-9]+$/i)) {
      res.status(400).json({ error: "Link must be alphanumeric" });
      return;
    }

    // Trim to 10 characters
    newLink = newLink.substring(0, 10).toLowerCase();

    // Make sure its not already taken
    let user = await getUserFromProfileId(newLink);
    if(user) {
      console.log("User", user.user.user_id, "already has link", req.session.user.id);
      res.status(400).json({ error: user.user.user_id === req.session.user.id ? "You already have this link!": "Link already taken" });
      return;
    }



    try {
    await changeProfileLink(req.session.user.id, newLink);
    req.session.user = {
      ...req.session.user,
      link: newLink
    };
    await req.session.save();

    res.json({success: true, newLink});
    } catch(e) {
      console.log(e);
      res.status(500).json({ error: "Error updating link" });
    }
}