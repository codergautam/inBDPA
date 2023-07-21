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
        res.json({success: false, error: "No query provided"})
        return;
    }
    if(query.length > 32) {
        res.json({success: false, error: "Query too long"})
        return;
    }
    if(query.length < 3) {
        res.json({success: false, error: "Query too short. Type "+(3-query.length)+" more characters!"})
        return;
    }
    let data = await searchUsers(query);
    res.json(data);
}