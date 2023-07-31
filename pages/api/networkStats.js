// pages/api/networkStats.js
// This code is written to handle an API route that returns network statistics for a user. It uses Iron Session for session management and Neo4j for fetching connections and determining connection depth. It also uses an external API for fetching user data. The code first checks if the user is authorized. If the "full" query parameter is present, it fetches the user's connections and their connections' connections up to a depth of 3. It then fetches the user data for these connections and constructs links between mutual connections. Finally, it returns the fetched user data and links in the response. If the "full" query parameter is not present, it fetches the user's connections up to a depth of 1 and constructs links between the user and these connections. It then returns the fetched user data and links in the response.
import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { fetchConnections, findConnectionDepth } from "@/utils/neo4j.mjs";
import { getManyUsersFast } from "@/utils/api";
export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {

    let user = req.session.user;
    if(!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if(req.query.full) {
    // Fetch your connections
    let connections = await fetchConnections(user.id, 3);
    connections.push(user.id);
      let users = await getManyUsersFast(connections, false, true);

      let links = []
      for(let connection of connections) {
        for(let mutualConnection of users[connection].connections) {
          if(connections.includes(mutualConnection)) {
            links.push({source: connection, target: mutualConnection});
          }
        }
      }

      return res.json({success: true, users, links});


    } else {
      let connections = await fetchConnections(user.id, 1);
      connections.push(user.id);
      let users = await getManyUsersFast(connections);
      let links = []

      for(let connection of connections) {
        links.push({source: user.id, target: connection});
      }

      return res.json({success: true, users, links});
    }
}