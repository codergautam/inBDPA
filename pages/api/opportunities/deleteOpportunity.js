// pages/api/opportunities/deleteOpportunity.js
// This file contains the code for deleting an opportunity. The code checks if the user is authorized to delete the opportunity and if the opportunity exists. If all the conditions are met, the opportunity is deleted from the database. If not, appropriate error messages are returned.
import { deleteOpportunity, deleteOpportunityMongo, getOpportunity, getOpportunityMongo } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";

export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {

  if(req.session.user.type == "inner") {
    return res.json({success: false, message: "smh, inners :(", error: "Unauthorized"})
  }

  const { opportunity_id } = req.body

  const user = req.session.user;
  if(!user) {
    return res.json({success: false, error: "Not logged in"});
  }

  const creator_id = req.session.user.id;

  //Checking if u own that opportunity in the first place
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
  

  const data = (await deleteOpportunity(opportunity_id));
  console.log("Data: ", data)
  if(!data.success) {
    console.log("Error")
    return res.json({success: false, error: "Couldn't delete opportunity!"});
  }
  await deleteOpportunityMongo(opportunity_id);
  res.json({success: true});
}