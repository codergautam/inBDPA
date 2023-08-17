// utils/mongo/viewCountHelpers.js
// This file contains helper functions for increasing the view count for profiles and opportunities in MongoDB. The first function, increaseViewCountMongo, takes in a userId and newViewCount as parameters. It checks if there is a newViewCount provided, and if not, it increments the view count for the profile associated with the userId by 1. If there is a newViewCount provided, it updates the profile's view count with the new value. The function returns true if the update is successful, and false otherwise.
//
// The second function, increaseOpportunityViewCountMongo, takes in an opportunityId as a parameter. It increments the view count for the opportunity associated with the opportunityId by 1. The function returns true if the update is successful, and false otherwise.
//
// Both functions use the findOneAndUpdate method from the Profile and Opportunity collections in MongoDB to update the view count. If any errors occur during the update process, the error is logged to the console and false is returned.
//
// The purpose of these helper functions is to easily increase the view count for profiles and opportunities in the MongoDB database.
import { Profile,Opportunity, Article } from "./mongoInit";

export async function increaseViewCountMongo(userId, newViewCount) {

  try {
    if(!newViewCount) {
      // Increment view count
      const updatedProfile = await Profile.findOneAndUpdate(
          { user_id: userId }, // find a document with this filter
          { $inc: { views: 1 } }, // document to insert when nothing was found
          { new: true, upsert: true } // options
      );
      return true;
    } else {
      const updatedProfile = await Profile.findOneAndUpdate(
          { user_id: userId }, // find a document with this filter
          { views: newViewCount }, // document to insert when nothing was found
          { new: true, upsert: true } // options
      );
      return true;
    }
  } catch (error) {
      console.log('Error while trying to update profile views: ', error);
      return false;
  }
};

export async function increaseOpportunityViewCountMongo(opportunityId) {
  try {
    // Increment view count
    const updatedOpportunity = await Opportunity.findOneAndUpdate(
      {opportunity_id: opportunityId},
      { $inc: { views: 1 } },
      { new: true, upsert: true }
    );
    console.log('Opportunity views successfully updated: ', updatedOpportunity);
    return true;
  } catch (error) {
    console.log('Error while trying to update opportunity views: ', error);
    return false;
  }
};

export async function increaseArticleViewCountMongo(articleId) {
  try {
    // Increment view count
    const updatedArticle = await Article.findOneAndUpdate(
      {article_id: articleId},
      { $inc: { views: 1 } },
      { new: true, upsert: true }
    );
    console.log('Article views successfully updated: ', updatedArticle);
    return true;
  } catch (error) {
    console.log('Error while trying to update opportunity views: ', error);
    return false;
  }
};