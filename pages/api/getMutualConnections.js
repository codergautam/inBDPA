// pages/api/getMutualConnections.js
// This code is responsible for handling a POST request to retrieve the mutual connections between two users. It first checks the request method and the validity of the request body. Then it fetches the connections of the requested user and the connections of the current user. It finds the mutual connections between the two sets of connections and removes duplicates and the requested user or the current user from the mutual connections. It then fetches the details of the mutual connections and calculates the depth of the connections. Finally, it returns the successful response with the mutual connections.
import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { fetchConnections, findConnectionDepth } from "@/utils/neo4j.mjs";
import { getManyUsersFast } from "@/utils/api";
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
    let user_id = JSON.parse(req.body).user_id;
    let user = req.session.user;
    if(!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if(typeof user_id !== "string") {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    // Fetch your connections
    let mutualConnections;
    let theirConnections = await fetchConnections(user_id, 3);
    if(user_id === user.id) {
      mutualConnections = theirConnections;
      if(mutualConnections.length === 0) {
        return res.json({error: "No connections found"});
      }
    } else {
    // Make sure the requested user is in your connections

    // Fetch the connections of my user
    let data = await fetchConnections(req.session.user.id, 3);

    // Find the mutual connections
     mutualConnections = data.filter((connection) => theirConnections.includes(connection));
    // Remove any duplicates, requested user or yourself from the mutual connections
    mutualConnections = [...new Set(mutualConnections)].filter((connection) => connection !== user_id && connection !== user.id);
  }
  if(mutualConnections.length === 0) {
    return res.json({error: "No mutual connections found"});
  }
  mutualConnections = await getManyUsersFast(mutualConnections);

  mutualConnections = await Promise.all(Object.values(mutualConnections).map(async (connection) => {
    let yourDepth = await findConnectionDepth(user.id, connection.user_id);
    let theirDepth;
    if(user_id !== user.id) {
      theirDepth = await findConnectionDepth(user_id, connection.user_id);
    }
    return {...connection, yourDepth, theirDepth};
  }));
    res.json({success: true, connections: mutualConnections});
}