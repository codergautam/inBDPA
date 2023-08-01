// utils/mongo/getOpportunityMongo.js
// This function is written to get an opportunity from MongoDB based on the opportunityId. 
// 
// The function uses the Opportunity model exported from the mongoInit file.
// 
// The function first tries to find an opportunity in the database with the given opportunityId.
// 
// If an opportunity is found, it is returned.
// 
// If no opportunity is found, false is returned.
// 
// If there is an error while executing the code, an error message is logged and false is returned.
import { Opportunity } from "./mongoInit";

export default async function getOpportunityMongo(opportunityId) {
  try {
    const opportunity = await Opportunity.findOne({ opportunity_id: opportunityId });
    if (opportunity) {
      return opportunity;
    }
    return false;
  } catch (error) {
    console.log('Error while trying to get opportunity: ', error);
    return false;
  }
}