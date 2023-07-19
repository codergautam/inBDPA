import { deleteOpportunity, deleteOpportunityMongo } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";

export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  const { opportunity_id } = req.body
  const data = (await deleteOpportunity(opportunity_id));
  console.log("Data: ", data)
  if(!data.success) {
    console.log("Error")
    return res.json({success: false, error: "Couldn't delete opportunity!"});
  }
  await deleteOpportunityMongo(opportunity_id);
  res.json({success: true});
}