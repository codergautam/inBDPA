// pages/api/toggleConnection.js
// This code is the API route handler for toggling a connection between two users. When a POST request is made to this route, it will add a connection if one does not exist, and remove the connection if it does exist. The code first checks if the request method is POST and validates the request body. It then retrieves the user ids of the users involved in the connection. Next, it checks if the user making the connection is authenticated. After that, it fetches the current connections of both users and checks if they are already connected. If they are not connected, it adds the connection and updates the connections in both the Neo4j and MongoDB databases. If they are connected, it removes the connection and updates the databases. Finally, the code returns the updated connections and the new depth of the connection.
import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { addConnection, removeConnection, updateUserMongo } from "@/utils/api";
import { fetchConnections, findConnectionDepth, updateUser } from "@/utils/neo4j.mjs";
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
    // The user id of the user to connect to
    let user_id = JSON.parse(req.body).user_id;
    // The user id (user.id) of the user making the connection
    let user = req.session.user;
    if(!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if(typeof user_id !== "string") {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    let data;
    let connections = await fetchConnections(user_id, 1);
    let myConnections = await fetchConnections(user.id, 1);
    console.log("Connections: ", connections);
    let newDepth = 0;
    let connected = !!connections.find(c => c == user.id);
    console.log("Connected: ", connected);
    if(!connected) {
    data = await addConnection(user.id, user_id);
    console.log("Data: ", data);
    if(data.success) {
      connections.push(user.id);
      myConnections.push(user_id);

      newDepth = 1;
      console.log("new connections", connections)
      await updateUser(user_id, connections);
      await updateUser(user.id, myConnections);
      await updateUserMongo(user_id, {connections});
      await updateUserMongo(user.id, {connections: myConnections});
    }
    } else {
      data = await removeConnection(user.id, user_id);
      if(data.success) {
        connections = connections.filter(c => c != user.id);
        myConnections = myConnections.filter(c => c != user_id);
        await updateUser(user_id, connections);
        await updateUser(user.id, myConnections);
        await updateUserMongo(user_id, {connections});
        await updateUserMongo(user.id, {connections: myConnections});
        newDepth = await findConnectionDepth(user.id, user_id);
      }
    }
    if(!data.success) {
      res.status(500).json({ error: "Error updating connection" });
      return;
    }
    let secondDepth = await fetchConnections(user_id, 2);
    data.connections = [connections, secondDepth];
    data.newDepth = newDepth;
    return res.json(data);
  }