import { getAllOpportunitiesMongo, getOpportunities } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";

export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  // const { opportunity_id } = req.body
  // console.log("Received ID: " + opportunity_id)
  // const opportunities = (await getOpportunities(opportunity_id ?? null)).opportunities;
  // res.json({opportunities});
  if(req.method !== "POST") {
    return res.json({success: false, error: "Invalid method"});
  }
  if(!req.session.user) {
    return res.json({success: false, error: "Not logged in"});
  }

  const { opportunity_id } = req.body;
  try {
  let opportunities = await getAllOpportunitiesMongo(10, opportunity_id ?? null);
  res.json({success: true, opportunities});
  } catch(e) {
    console.log(e);
    res.json({success: false, error: "Couldn't get opportunities!"});
  }
}