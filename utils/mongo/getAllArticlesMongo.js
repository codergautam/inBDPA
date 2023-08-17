import { Article } from "./mongoInit";

export default async function getAllArticlesMongo(limit, article_id_after) {
  try {
      let query = {};
      if (article_id_after) {
          const afterArticle = await Article.findOne({ article_id: article_id_after });
          if (afterArticle) {
              query.createdAt = { $lt: afterArticle.createdAt };
          }
      }

      // Get all articles from mongodb, new ones first.
      // Return only limit results, and only return articles made after the article_id_after opportunity
      const articles = await Article.find(query).sort({createdAt: -1}).limit(limit)
      if (articles) {
      // Make sure they are an array of json objects
          return articles;
      }
      return false;
  } catch (error) {
      console.log('Error while trying to get articles: ', error);
      return false;
  }
}
