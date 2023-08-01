// utils/mongo/updateOpportunityMongo.js
// This code is responsible for updating an opportunity in the MongoDB database. It is implemented as an async function that takes in an opportunityId, opportunity object, and an optional specific flag. If specific is false (or not provided), the function will perform an "upsert" operation, meaning that it will create a new opportunity if it does not exist. If specific is true, the function will only update the existing opportunity. The function returns true if the update is successful and false if there is an error.
import { Opportunity } from "./mongoInit";

export default async function updateOpportunityMongo(opportunityId, opportunity, specific=false) {
  // Create if not exists
  try {
    if(!specific) {
    const updatedOpportunity = await Opportunity.findOneAndUpdate( { opportunity_id: opportunityId }, opportunity, { new: true, upsert: true } );
    console.log('Opportunity successfully updated: ', updatedOpportunity);
    return true;
    } else {
      const updatedOpportunity = await Opportunity.findOneAndUpdate( { opportunity_id: opportunityId }, opportunity, { new: true } );
      console.log('Opportunity successfully updated: ', updatedOpportunity);
      return true;
    }
  } catch (error) {
    console.log('Error while trying to update opportunity: ', error);
    return false;
  }
}