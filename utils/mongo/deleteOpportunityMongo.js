// utils/mongo/deleteOpportunityMongo.js
// This file contains the code for deleting an opportunity from the MongoDB database. It is a part of the inBDPA project and is used to perform CRUD operations on opportunities.
// 
// The code imports the Opportunity model from the "mongoInit" file, which is responsible for establishing the connection to the MongoDB database.
// 
// The deleteOpportunityMongo function takes an opportunity_id as a parameter and attempts to find and remove the corresponding opportunity from the database using the findOneAndRemove method provided by Mongoose.
// 
// If the removal is successful, a success message is logged to the console along with the opportunity_id. The function then returns true.
// 
// If any error occurs during the deletion process, an error message is logged to the console along with the error itself. The function then returns false.
// 
// The deleteOpportunityMongo function is exported as the default export of the file, which allows other modules to import and use it.
// 
// Overall, this code enables the deletion of opportunities from the MongoDB database using the opportunity_id as the identifier. It provides error handling and logging for debugging purposes.
import { Opportunity } from "./mongoInit";

export default async function deleteOpportunityMongo(opportunity_id) {
  try {
    await Opportunity.findOneAndRemove({ opportunity_id: opportunity_id });
    console.log('Opportunity successfully deleted in mongo', opportunity_id);
    return true;
  } catch (error) {
    console.log('Error while trying to delete opportunity: ', error);
    return false;
  }
}