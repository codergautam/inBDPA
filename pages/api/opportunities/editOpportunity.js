import { updateOpportunity, updateOpportunityMongo } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  const { opportunity_id, title, contents } = req.body
  const user = req.session.user;
  if(!user) {
    return res.json({success: false, error: "Not logged in"});
  }
  const creator_id = req.session.user.id;
  console.log("Body for new Opportunity:", { title, contents, creator_id })
  let data = await updateOpportunity(opportunity_id, {title, contents});
  if(data.success) {
  await updateOpportunityMongo(opportunity_id, {title, content: contents}, true);
  }
  console.log("Data: ")
  console.log(data)
  res.json(data);
}