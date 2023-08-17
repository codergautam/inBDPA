// pages/api/opportunities/deleteArticle.js
// This file contains the code for deleting an article. The code checks if the user is authorized to delete the article and if the article exists. If all the conditions are met, the article is deleted from the database. If not, appropriate error messages are returned.
import { deleteArticle, deleteArticleMongo, getArticle, getArticleMongo } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";

export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {



  const { article_id } = req.body

  const user = req.session.user;
  if(!user) {
    return res.json({success: false, error: "Not logged in"});
  }

  const creator_id = req.session.user.id;

  //Checking if u own that article in the first place
  let opp =  await getArticleMongo(article_id)
  if(!opp) {
    opp = await getArticle(article_id)
  }


  //Article doesn't exist
  if(!opp) {
    return res.json({success: false, error: "No such article"})
  }

  if(creator_id != opp.creator_id) {
    return res.json({success: false, error: "Unauthorized"})
  }


  const data = (await deleteArticle(article_id));
  if(!data.success) {
    console.log("Error")
    return res.json({success: false, error: "Couldn't delete article!"});
  }
  await deleteArticleMongo(article_id);
  res.json({success: true});
}