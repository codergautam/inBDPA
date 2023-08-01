// pages/api/setAbout.js
// This code is responsible for handling API requests to update the "About" section of a user's profile. It uses the withIronSessionApiRoute middleware to ensure that the user making the request is authenticated. If the request method is not POST, it returns a 405 error. If the request body is not a valid JSON, it returns a 400 error. It then extracts the "about" field from the request body and checks if the user is authenticated. If the "about" field is not a string, it returns a 400 error. Finally, it calls the updateUser function with the user's ID and the updated "about" section, and returns the updated user data as a response.
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