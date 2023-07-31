// pages/api/suggestedConnections.js
// This code is the API route for retrieving suggested connections for a user. It checks if the request is a GET request and if the user is logged in. It fetches the connection suggestions for the user and then fetches the user details for each suggested user. Finally, it returns the suggestions as a JSON response.
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import { getConnectionSuggestions } from "@/utils/neo4j.mjs";
import { getManyUsersFast } from "@/utils/api";

export default withIronSessionApiRoute(handler, ironOptions);

async function handler(req, res) {
  // Check if the request is a GET request.
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Check if the user is logged in.
  let user = req.session.user
  if (!user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // Fetch the connection suggestions.
  let suggestions1 = await getConnectionSuggestions(user.id);

  // Fetch user details for the suggested users.
  let suggestions = await getManyUsersFast(suggestions1.map((suggestion) => suggestion.id));
  for(let s of suggestions1) {
    suggestions[s.id].mutualConnections = s.mutualConnections;
  }


  // Return the suggestions.
  res.json({ success: true, suggestions });
}
