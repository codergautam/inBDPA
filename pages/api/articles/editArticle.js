// pages/api/opportunities/editArticle.js
// This file contains a function for editing an article. It first checks if the user is logged in and if they have the authorization to edit the article. If the user is not logged in or is an "inner" user, it returns an error message. It then retrieves the article details from the database and checks if the article exists. If it doesn't, it returns an error message. If the user is the creator of the article, it updates the article details in the database and returns a success message. The function also logs the data and sends a response to the client.
import { getArticle, getArticleMongo, updateArticle, updateArticleMongo } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {

  const { article_id, title, contents, keywords } = req.body
  const user = req.session.user;
  if(!user) {
    return res.json({success: false, error: "Not logged in"});
  }

  const creator_id = req.session.user.id;

  //Checking if you own the article
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

  let data = await updateArticle(article_id, {title, contents, keywords});
  if(data.success) {
  await updateArticleMongo(article_id, {title, content: contents, keywords}, true);
  }
  res.json(data);
}