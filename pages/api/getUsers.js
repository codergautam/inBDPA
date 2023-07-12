import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import { getUsers } from "@/utils/api";

export default withIronSessionApiRoute(handler, ironOptions)

async function handler(req, res) {
    // const { after } = req.body;
    // const resp = await getUsers(after || null);
    // res.json(resp)
    res.status(405).json({ error: "This method is insecure and therefore disabled." });

}