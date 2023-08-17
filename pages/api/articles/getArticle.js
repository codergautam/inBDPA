// pages/api/opportunities/getArticle.js
// This code is for the "/api/opportunities/getArticle" route in the inBDPA project. It retrieves an article by its ID and returns it as a JSON response. It also counts the number of active sessions for the opportunity and includes that count in the response.
//
// The code imports the necessary functions from the "@/utils/api" module and the "withIronSessionApiRoute" function from the "iron-session/next" module.
//
// It then exports the "handler" function wrapped with the "withIronSessionApiRoute" middleware using the "ironOptions" configuration.
//
// The "handler" function is an asynchronous function that takes in a request and response object. It extracts the "article_id" from the request body and logs it to the console.
//
// It then calls the "getArticle" function to retrieve the article with the given ID. If no article is found, it logs a message and returns a JSON response indicating the failure.
//
// Next, it calls the "countSessionsForArticle" function to count the number of active sessions for the article. It assigns this count to the "active" property of the article object.
//
// Finally, it sends the article as a JSON response.
import { getArticle, countSessionsForArticle } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";

export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  const { article_id } = req.body
  const article = (await getArticle(article_id)).article;
  if(!article) {
    return res.json({success: false, error: "Article doesn't exist!"});
  }
  const active = (await countSessionsForArticle(article_id)).active
  article.active = active
  res.json({article});
}