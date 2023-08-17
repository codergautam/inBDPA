// pages/api/changeLink.js
// This code is responsible for handling the API route for changing the user's profile link.
//
// It checks if the request method is POST and if the user is authenticated.
//
// It then parses the request body and checks if the new link provided is alphanumeric.
//
// If it is, it trims it to 10 characters and checks if it is already taken.
//
// If it is not taken, it updates the user's profile link in the database, updates the user's session, and returns a success message with the new link.
//
// If there is any error during this process, it returns an appropriate error message.
import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { changeProfileLink, getUser, getUserFromProfileId } from "@/utils/api";
import { escape } from "lodash";
import changeProfileFullName from "@/utils/hscc/changeProfileFullName";
import changeProfileEmail from "@/utils/hscc/changeProfileEmail";
export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    let { newEmail, user_id } = req.body

    if(req.session.user.id != user_id) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    if(req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    if(!req.session?.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
        console.log(req.body)
        let data = await changeProfileEmail(user_id, newEmail)
        if(data.success) {
            req.session.user = {
              ...req.session.user,
              newEmail
            };
            await req.session.save();
            return res.json({success: true, newEmail})
        } else {
            return res.json({success:false, error: data.error})
        }
    } catch (error) {
        return res.json({success:false, error: data.error})
    }
}