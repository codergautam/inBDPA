import { Article } from "./mongoInit";

export default async function deleteArticleMongo(article_id) {
  try {
    await Article.findOneAndRemove({ article_id });
    console.log('Article successfully deleted in mongo', article_id);
    return true;
  } catch (error) {
    console.log('Error while trying to delete opportunity: ', error);
    return false;
  }
}