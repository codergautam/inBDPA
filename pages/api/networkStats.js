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
      let users = await getManyUsersFast(connections, true);

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