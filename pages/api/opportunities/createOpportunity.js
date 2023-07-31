// pages/api/opportunities/createOpportunity.js
// This file is for creating a new opportunity in the application. It checks if the user is authorized to create opportunities and validates the input data. If the data is valid, it creates the opportunity and updates the opportunity in the database. Finally, it returns the result of the operation.
// 
// - The file imports the necessary functions from the API and session packages.
// - It defines an async function called `handler` which will be the main logic for creating the opportunity.
// - The function first checks if the user type is "inner", in which case it returns an error message indicating unauthorized access.
// - It then retrieves the title and contents from the request body and verifies that the user is logged in.
// - The function also sets the `creator_id` variable to the user's ID.
// - It logs the body of the new opportunity for debugging purposes.
// - The function performs additional validation checks for the title and contents length.
// - If all the checks pass, it creates a new opportunity and updates the opportunity in the database.
// - Finally, it returns the result of the operation as a JSON response.
import { createOpportunity, updateOpportunityMongo } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {

  if(req.session.user.type == "inner") {
    return res.json({success: false, message: "smh, inners :(", error: "Unauthorized"})
  }

  const { title, contents } = req.body
  const user = req.session.user;
  if(!user) {
    return res.json({success: false, error: "Not logged in"});
  }
  const creator_id = req.session.user.id;
  console.log("Body for new Opportunity:", { title, contents, creator_id })
  if(!title || !contents) {
    return res.json({success: false, error: "Missing required fields"});
  }
  if(contents.length > 3000) {
    return res.json({success: false, error: "Contents too long"});
  }
  if(title.length > 100) {
    return res.json({success: false, error: "Title too long"});
  }
  let data = await createOpportunity({title, contents, creator_id});
  if(data.success) {
    delete data.opportunity.updatedAt;

    data.opportunity.content = data.opportunity.contents;
    delete data.opportunity.contents;
    console.log(data.opportunity);
    await updateOpportunityMongo(data.opportunity.opportunity_id, data.opportunity);
  }
  res.json(data);
}