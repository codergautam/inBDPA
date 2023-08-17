// pages/api/endSession.js
// This file contains a function that is responsible for ending a session by deleting it from the database. It is imported as a api route and uses the iron-session library for session management. The function is called "handler" and it takes in a request and response object. If the request method is not a POST, it returns an error response with a status code of 405. Otherwise, it calls the deleteSession function with the sessionId extracted from the request body, logs the result, and sends the response with the data returned by deleteSession function.
import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { deleteArticle, deleteProfileMongo, deleteUser, getUserFromMongo } from "@/utils/api";
import { deleteUser as deleteNode } from "@/utils/neo4j.mjs";
import { Article } from "@/utils/mongo/mongoInit";
export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    if(!req.session.user) {
        return res.json({success: false, error: "Not logged in"});
    }
    if(req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }
    let idToDelete = req.session.user.id;
    if(req.session.user.type === "administrator" && req.body.idToDelete) {
      idToDelete = req.body.idToDelete;

    }

    let userToDelete = await getUserFromMongo(idToDelete);
    if(!userToDelete) {
      return res.json({success: false, error: "User not found"});
    }
    if(userToDelete.type === "administrator" && req.session.user.id !== idToDelete) {
      return res.json({success: false, error: "Cannot delete administrator"});
    }

    await deleteUser(idToDelete);
    await deleteProfileMongo(idToDelete);
    await deleteNode(idToDelete);

    // Mongo delete articles with author_id = idToDelete
    await Article.deleteMany({author_id: idToDelete});


    res.json({success: true});
}