// pages/api/opportunities/getOpportunities.js
// This code is used to retrieve opportunities from a database and return them as JSON in an API endpoint. It uses functions from the "@/utils/api" file to interact with the database.
// 
// First, it imports the necessary functions and configurations from other files.
// 
// Then, it exports a function called "handler" as the default export of this file. This function will be called when the API endpoint is accessed.
// 
// Inside the "handler" function, it checks if the request method is not "POST" and if the user is not logged in. If either of these conditions is true, it returns an error JSON response.
// 
// If both conditions are false, it retrieves the opportunity ID from the request body and uses it to get a list of opportunities from the database. It also counts the number of active sessions for each opportunity.
// 
// It then returns a JSON response with the success status and the list of opportunities.
// 
// If any errors occur during this process, it logs the error and returns an error JSON response.
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
  let opportunities = [...await getAllOpportunitiesMongo(4, opportunity_id ?? null)];
  opportunities = await Promise.all(opportunities.map(async (opportunity) => {
    try {
    const active = (await countSessionsForOpportunity(opportunity.opportunity_id)).active
    return {...opportunity.toObject(), active}
    } catch(e) {
      console.log(e);
      return opportunity.toObject();
    }
  }))



  res.json({success: true, opportunities});
  } catch(e) {
    console.log(e);
    res.json({success: false, error: "Couldn't get opportunities!"});
  }
}