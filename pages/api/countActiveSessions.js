// pages/api/countActiveSessions.js
// This code is for the API route that counts the active sessions for a user or an opportunity. It is used to determine how many active sessions are currently happening for a specific user or opportunity.
// 
// The code imports necessary functions and configurations from other files.
// 
// The handler function is the main function that handles the API request. It checks the request method and returns an error if it's not a POST request.
// 
// The 'view' and 'viewed_id' variables are extracted from the request body, which are used to determine if the request is for a profile or an opportunity.
// 
// If the 'view' variable is neither 'profile' nor 'opportunity', an error is returned.
// 
// Based on the 'view' value, the code calls the appropriate function to count the sessions for the user or the opportunity.
// 
// The response is then sent back with the count of active sessions for the requested view.
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