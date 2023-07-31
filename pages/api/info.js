// pages/api/info.js
// This file is the API route for retrieving information. It uses the getInfo function from the utils/api module to fetch the data. The ironOptions object contains the configuration options for the iron session. The withIronSessionApiRoute function is used to add iron session authentication to the API route. 
// 
// The handler function is an async function that handles the API request. It first checks if the user type is "administrator", if not it returns an error response. Then it calls the getInfo function to fetch the data and sends it back as a JSON response. 
// 
// Overall, this file sets up an API route for retrieving information with iron session authentication.
import { getInfo } from "@/utils/api";
import { ironOptions } from "@/utils/ironConfig";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    console.log("Getting info")
    if(req.session.user.type != "administrator") {
        res.json({success: false, error: "Unauthorized"})
    }

    let data = await getInfo();
    res.json(data);
}