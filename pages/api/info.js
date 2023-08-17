// pages/api/info.js
// This file is the API route for retrieving information. It uses the getInfo function from the utils/api module to fetch the data. The ironOptions object contains the configuration options for the iron session. The withIronSessionApiRoute function is used to add iron session authentication to the API route.
//
// The handler function is an async function that handles the API request. It first checks if the user type is "administrator", if not it returns an error response. Then it calls the getInfo function to fetch the data and sends it back as a JSON response.
//
// Overall, this file sets up an API route for retrieving information with iron session authentication.
import { getAllSessions, getInfo, getOpportunityMongo, getProfileIdFromUserId, getUser, getUserFromMongo, getUserFromProfileId } from "@/utils/api";
import { ironOptions } from "@/utils/ironConfig";
import { withIronSessionApiRoute } from "iron-session/next";
import { getOpportunity } from "@/utils/api";
export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    if(req.session.user.type != "administrator") {
        res.json({success: false, error: "Unauthorized"})
    }

    let data = await getInfo();
    data.info.sessionCount = data.info.sessions
    let sessionList = await getAllSessions();
    sessionList = sessionList.sessions
    let userList = []
    for(let i = 0; i<sessionList.length; i++) {
        let session = sessionList[i]
        let user_id = session.user_id
        let user = await getUser(user_id)
        switch(session.view) {
            case "home":
                session.message = "is on the homepage"
                session.link = "/"
                break;
            case "profile":
                let profileViewId = session.viewed_id
                let user = (await getUser(profileViewId)).user
                let link = await getProfileIdFromUserId(user.user_id)
                console.log(`Link: ${link}`)
                // console.log("User: ", user)
                session.message = `is viewing ${user.username}'s profile`
                session.link = `/profile/${link}`
                break;
            case "article":
                break;
            case "opportunity":
                let opportunityViewId = session.viewed_id
                console.log(`Opp ID: ${opportunityViewId}`)
                let opp = await getOpportunityMongo(opportunityViewId)
                if(!opp) opp = (await getOpportunity(opportunityViewId)).opportunity
                session.link = `/opportunity/${opportunityViewId}`
                session.message = `is looking at an opportunity: ${opp.title}`
                console.log("opp: ", opp)
                break;
            case "admin":
                session.message = "is on the admin page"
                session.link = `/admin/${req.session.user.username}`
                break;
            case "auth":
                session.message = "is on the login, signup or forgot password page"
                session.link = "/auth/signup"
                break;
            default:
                session.message = "is browsing inBDPA"
                section.link = "/"
                break;
        }
        if(user.user) {
            // console.log("has user")
            let link = await getProfileIdFromUserId(user_id)
            user.user.link = link
            user.user.salt = null
        }
        userList.push(user.user)
    }
    data.info.userList = userList
    data.info.sessions = sessionList
    // console.log(data.info)
    res.json(data);
}