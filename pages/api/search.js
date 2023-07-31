// pages/api/search.js
// This code is for the API route "/api/search". It is used to handle a POST request to perform a user search. The handler function checks if the request method is POST, if the user is logged in, and if a search query is provided. It then calls the searchUsers function to perform the search and returns the results as a JSON response. If any errors occur, appropriate error messages are returned in the response. The code also utilizes Iron session for authentication and includes ironOptions for session configuration.
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import { findProfile, getUser, searchUsers } from "@/utils/api";

export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
  if(!req.method === "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
    if(!req.session.user) {
        res.json({success: false, error: "Not logged in"})
        return;
    }
    let query = req.body.query;
    if(!query) {
        res.json({success: false, error: "No query has been provided"})
        return;
    }
    if(query.length > 64) {
        res.json({success: false, error: "Search exceeded 64 characters"})
        return;
    }
    let data = await searchUsers(query);
    data.queryLength = query.length;
    res.json(data);
}
