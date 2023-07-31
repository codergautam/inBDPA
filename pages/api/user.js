// pages/api/user.js
// This code is responsible for handling the API route for retrieving user information. It utilizes the `withIronSessionApiRoute` function from the iron-session/next package and the `ironOptions` object from the ironConfig module. The `handler` function is an asynchronous function that accepts a request and response object, and it returns the user information stored in the session.
import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    res.json(req.session.user)
}