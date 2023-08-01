// utils/mongo/getLatestOpportunitiesMongo.js
// This file contains a function that retrieves the latest opportunities from a MongoDB database. The function takes a limit parameter to specify the maximum number of opportunities to retrieve.
// 
// The function imports the Opportunity model from the "./mongoInit" file, which initializes the MongoDB connection and defines the Opportunity schema.
// 
// The function uses the Opportunity model's "find" method to retrieve all opportunities from the database. It then sorts the opportunities by their "createdAt" field in descending order and limits the results to the specified limit.
// 
// If there are opportunities returned from the database, the function returns them. Otherwise, it returns false.
// 
// If there is an error while retrieving the opportunities, the function logs the error to the console and returns false.
import { Opportunity } from "./mongoInit";

export default async function getLatestOpportunitiesMongo(limit) {
  try {
    const opportunities = await Opportunity.find().sort({createdAt: -1}).limit(limit);
    if (opportunities) {
      return opportunities;
    }
    return false;
  } catch (error) {
    console.log('Error while trying to get latest opportunities: ', error);
    return false;
  }
}
