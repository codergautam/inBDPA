// utils/mongo/getAllOpportunitiesMongo.js
// This code is written to fetch opportunities from a MongoDB database. It utilizes the Opportunity model from the mongoInit file. It accepts two parameters: limit (to specify the number of results to retrieve) and opportunity_id_after (to fetch opportunities created after a specific opportunity). 
// 
// The code begins by initializing an empty query object. If opportunity_id_after is provided, it fetches the opportunity with the specified opportunity_id_after value from the database. If the opportunity is found, it adds a condition to the query to fetch opportunities created before the createdAt date of the afterOpportunity.
// 
// The code then queries the database and retrieves all opportunities that match the query. The opportunities are sorted in descending order based on their createdAt date and limited to the specified limit. If opportunities are found, the code returns them as an array of JSON objects. Otherwise, it returns false.
// 
// If an error occurs while querying the database, the code logs an error message and returns false.
// 
// Overall, this code fetches opportunities from a MongoDB database based on the provided parameters.
import { Opportunity } from "./mongoInit";

export default async function getAllOpportunitiesMongo(limit, opportunity_id_after) {
  try {
      let query = {};
      if (opportunity_id_after) {
          // Fetch the opportunity for opportunity_id_after
          const afterOpportunity = await Opportunity.findOne({ opportunity_id: opportunity_id_after });
          if (afterOpportunity) {
              query.createdAt = { $lt: afterOpportunity.createdAt };
          }
      }

      // Get all opportunities from mongodb, new ones first.
      // Return only limit results, and only return opportunities made after the opportunity_id_after opportunity
      const opportunities = await Opportunity.find(query).sort({createdAt: -1}).limit(limit)
      if (opportunities) {
      // Make sure they are an array of json objects
          return opportunities;
      }
      return false;
  } catch (error) {
      console.log('Error while trying to get opportunities: ', error);
      return false;
  }
}
