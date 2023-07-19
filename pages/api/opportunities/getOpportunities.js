import { countSessionsForOpportunity, getAllOpportunitiesMongo, getOpportunities } from "@/utils/api";
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
  let opportunities = [...await getAllOpportunitiesMongo(3, opportunity_id ?? null)];
  opportunities = await Promise.all(opportunities.map(async (opportunity) => {
    try {
    const active = (await countSessionsForOpportunity(opportunity.opportunity_id)).active
    return {...opportunity.toObject(), active}
    } catch(e) {
      console.log(e);
      return opportunity.toObject();
    }
  }))



  console.log("Opportunities: ", opportunities)
  res.json({success: true, opportunities});
  } catch(e) {
    console.log(e);
    res.json({success: false, error: "Couldn't get opportunities!"});
  }
}