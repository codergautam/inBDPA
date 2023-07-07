import { withIronSessionApiRoute } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    res.json(req.session.user)
}