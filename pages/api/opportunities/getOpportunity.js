import { getOpportunity, countSessionsForOpportunity } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";

export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  const { opportunity_id } = req.body
  console.log("Received ID: " + opportunity_id)
  const opportunity = (await getOpportunity(opportunity_id)).opportunity;
  if(!opportunity) {
    console.log("Received nothing")
    return res.json({success: false, error: "Opportunity doesn't exist!"});
  }
  const active = (await countSessionsForOpportunity(opportunity_id)).active
  opportunity.active = active
  res.json({opportunity});
}