// pages/api/endSession.js
// This file contains a function that is responsible for ending a session by deleting it from the database. It is imported as a api route and uses the iron-session library for session management. The function is called "handler" and it takes in a request and response object. If the request method is not a POST, it returns an error response with a status code of 405. Otherwise, it calls the deleteSession function with the sessionId extracted from the request body, logs the result, and sends the response with the data returned by deleteSession function.
import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { createSession, deleteSession, getUserFromProfileId } from "@/utils/api";
export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    if(req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }



    let data = await deleteSession(JSON.parse(req.body).sessionId);
    console.log("End session", data, JSON.parse(req.body).sessionId);
    res.json(data);
}