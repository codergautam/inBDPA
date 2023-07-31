// pages/api/opportunities/getOpportunity.js
// This code is for the "/api/opportunities/getOpportunity" route in the inBDPA project. It retrieves an opportunity by its ID and returns it as a JSON response. It also counts the number of active sessions for the opportunity and includes that count in the response.
// 
// The code imports the necessary functions from the "@/utils/api" module and the "withIronSessionApiRoute" function from the "iron-session/next" module.
// 
// It then exports the "handler" function wrapped with the "withIronSessionApiRoute" middleware using the "ironOptions" configuration.
// 
// The "handler" function is an asynchronous function that takes in a request and response object. It extracts the "opportunity_id" from the request body and logs it to the console.
// 
// It then calls the "getOpportunity" function to retrieve the opportunity with the given ID. If no opportunity is found, it logs a message and returns a JSON response indicating the failure.
// 
// Next, it calls the "countSessionsForOpportunity" function to count the number of active sessions for the opportunity. It assigns this count to the "active" property of the opportunity object.
// 
// Finally, it sends the opportunity as a JSON response.
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