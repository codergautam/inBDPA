import { createOpportunity, updateOpportunityMongo } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
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