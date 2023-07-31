// pages/api/opportunities/editOpportunity.js
// This file contains a function for editing an opportunity. It first checks if the user is logged in and if they have the authorization to edit the opportunity. If the user is not logged in or is an "inner" user, it returns an error message. It then retrieves the opportunity details from the database and checks if the opportunity exists. If it doesn't, it returns an error message. If the user is the creator of the opportunity, it updates the opportunity details in the database and returns a success message. The function also logs the data and sends a response to the client.
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