import { getOpportunities } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";

export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  const { opportunity_id } = req.body
  console.log("Received ID: " + opportunity_id)
  const opportunities = (await getOpportunities(opportunity_id ?? null)).opportunities;
  res.json({opportunities});
}