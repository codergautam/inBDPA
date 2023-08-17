import { Article } from "./mongoInit";

export default async function getArticleMongo(articleId) {
  try {
    const opportunity = await Article.findOne({ article_id: articleId });
    if (opportunity) {
      return opportunity;
    }
    return false;
  } catch (error) {
    console.log('Error while trying to get Article: ', error);
    return false;
  }
}