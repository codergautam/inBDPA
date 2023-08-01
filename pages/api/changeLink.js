// pages/api/changeLink.js
// This code is responsible for handling the API route for changing the user's profile link.
//
// It checks if the request method is POST and if the user is authenticated.
//
// It then parses the request body and checks if the new link provided is alphanumeric.
//
// If it is, it trims it to 10 characters and checks if it is already taken.
//
// If it is not taken, it updates the user's profile link in the database, updates the user's session, and returns a success message with the new link.
//
// If there is any error during this process, it returns an appropriate error message.
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
    if(user.success) {
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