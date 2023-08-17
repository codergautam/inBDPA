import { Article } from "./mongoInit";

export default async function updateArticleMongo(articleId, article, specific=false) {
  // Create if not exists
  try {
    if(!specific) {
    const updatedArticle = await Article.findOneAndUpdate( { article_id: articleId }, article, { new: true, upsert: true } );
    return true;
    } else {
      const updatedArticle = await Article.findOneAndUpdate( { article_id: articleId }, article, { new: true } );
      console.log('Article successfully updated: ', updatedArticle);
      return true;
    }
  } catch (error) {
    console.log('Error while trying to update article: ', error);
    return false;
  }
}