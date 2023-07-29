import { getOpportunity, getOpportunityMongo, updateOpportunity, updateOpportunityMongo } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  
  if(req.session.user.type == "inner") {
    return res.json({success: false, message: "smh, inners :(", error: "Unauthorized"})
  }
  

  const { opportunity_id, title, contents } = req.body
  const user = req.session.user;
  if(!user) {
    return res.json({success: false, error: "Not logged in"});
  }

  const creator_id = req.session.user.id;
  console.log("Body for new Opportunity:", { title, contents, creator_id })

  //Checking if you own the opportunity
  let opp =  await getOpportunityMongo(opportunity_id)
  if(!opp) {
    opp = await getOpportunity(opportunity_id)
  }

  
  //Opportunity doesn't exist
  if(!opp) {
    return res.json({success: false, error: "No such opportunity"})
  }
  
  if(creator_id != opp.creator_id) {
    return res.json({success: false, error: "Unauthorized"})
  }

  let data = await updateOpportunity(opportunity_id, {title, contents});
  if(data.success) {
  await updateOpportunityMongo(opportunity_id, {title, content: contents}, true);
  }
  console.log("Data: ")
  console.log(data)
  res.json(data);
}