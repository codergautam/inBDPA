// pages/api/getUsers.js
// This file contains the code for the API route to get the users. It uses the withIronSessionApiRoute function from the iron-session/next module to handle session authentication. 
// The ironOptions variable is imported from the ironConfig file which contains the options for iron session. 
// The getUsers function is imported from the api file which contains the logic for fetching the users. 
// The code exports a default function called handler which takes in the request and response objects. 
// Inside the handler function, it extracts the "after" value from the request body. 
// Then, it calls the getUsers function with the "after" value or null if it is not provided. 
// Finally, it sends the response as JSON with the users from the getUsers function.
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import { getUsers } from "@/utils/api";

export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    const { after } = req.body;
    const resp = await getUsers(after || null);
    res.json(resp)

}