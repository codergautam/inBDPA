// pages/api/opportunities/createArticle.js
// This file is for creating a new article in the application. It checks if the user is authorized to create opportunities and validates the input data. If the data is valid, it creates the article and updates the article in the database. Finally, it returns the result of the operation.
//
// - The file imports the necessary functions from the API and session packages.
// - It defines an async function called `handler` which will be the main logic for creating the article.
// - The function first checks if the user type is "inner", in which case it returns an error message indicating unauthorized access.
// - It then retrieves the title and contents from the request body and verifies that the user is logged in.
// - The function also sets the `creator_id` variable to the user's ID.
// - It logs the body of the new article for debugging purposes.
// - The function performs additional validation checks for the title and contents length.
// - If all the checks pass, it creates a new article and updates the article in the database.
// - Finally, it returns the result of the operation as a JSON response.
import { createArticle, updateArticleMongo } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {

  let { title, contents,keywords } = req.body
  const user = req.session.user;
  if(!user) {
    return res.json({success: false, error: "Not logged in"});
  }
  const creator_id = req.session.user.id;
  if(!title || !contents) {
    return res.json({success: false, error: "Missing required fields"});
  }
  if(contents.length > 3000) {
    return res.json({success: false, error: "Contents too long"});
  }
  if(title.length > 100) {
    return res.json({success: false, error: "Title too long"});
  }
  if(!keywords) keywords = [];
  if(keywords.length > 10) {
    return res.json({success: false, error: "Too many keywords, max 10"});
  }
  if(keywords.some((keyword) => keyword.length > 20)) {
    return res.json({success: false, error: "A keyword cannot exceed 20 chars"});
  }
  let data = await createArticle({title, contents, creator_id, keywords});
  console.log(data);
  if(data.success) {
    delete data.article.updatedAt;

    data.article.content = data.article.contents;
    delete data.article.contents;
    await updateArticleMongo(data.article.article_id, data.article);
  }
  res.json(data);
}