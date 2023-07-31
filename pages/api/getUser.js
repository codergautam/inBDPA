// pages/api/getUser.js
// This file is a part of the inBDPA project and is used to retrieve user data from the database. It checks if the user is authorized and then fetches the user's profile and data using API calls to the backend. It returns the user's data in JSON format if the profile is found, otherwise it returns a failure response.
// 
// The code imports necessary dependencies and configurations from other files.
// It defines a handler function that takes request and response objects as parameters.
// It checks if the request body contains a username. If not, it returns an error response.
// It checks if the user is an admin. If not, it returns an error response.
// It calls the `findProfile` function with the provided username to find the user's profile in the database.
// It logs the retrieved profile in the console.
// If a profile is found, it makes another API call to fetch the user's data and links the profile to the user's data.
// It returns a success response with the user's data if a profile is found.
// If no profile is found, it returns a failure response.
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import { findProfile, getUser } from "@/utils/api";

export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    const { username } = req.body;
    if(!username) {
        return res.json({success: false, error: "Didn't provide a username or email"})
    }
    // make sure admin
    if(!req.session.user || req.session.user.type !== "administrator") {
        return res.json({success: false, error: "Not authorized"})
    }

    let newProf = await findProfile(username)
    console.log("Profile:", newProf)
    if(newProf) {
        console.log("Sending req")
        let data = await getUser(username);
        data.user.link = newProf.link;
        return res.json({success: true, user: data.user})
    } else {
       return res.json({success: false})
    }
    // res.json(data)
}