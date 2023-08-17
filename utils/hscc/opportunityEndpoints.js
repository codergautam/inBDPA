// utils/hscc/opportunityEndpoints.js
// This file contains utility functions for handling different endpoints related to opportunities.
//
// The `getOpportunities` function retrieves a list of opportunities from the server. It accepts two optional parameters: `after` and `updatedAfter`. If provided, these parameters are appended to the URL to filter the results. The function sends a GET request to the server and returns the response.
//
// The `createOpportunity` function creates a new opportunity on the server. It accepts an `opportunity` object as a parameter, which contains the data for the new opportunity. The function sends a POST request to the server with the opportunity data and returns the response.
//
// The `getOpportunity` function retrieves a specific opportunity from the server. It accepts an `opportunityId` parameter, which specifies the ID of the opportunity to retrieve. The function sends a GET request to the server with the specified ID and returns the response.
//
// The `updateOpportunity` function updates an existing opportunity on the server. It accepts two parameters: `opportunityId` and `updates`. The `opportunityId` parameter specifies the ID of the opportunity to update, and the `updates` parameter contains the data to update the opportunity with. The function sends a PATCH request to the server with the specified ID and the update data, and returns the response.
//
// The `deleteOpportunity` function deletes an existing opportunity from the server. It accepts an `opportunityId` parameter, which specifies the ID of the opportunity to delete. The function sends a DELETE request to the server with the specified ID and returns the response.
import { sendRequest, BASE_URL } from "./hsccInit";

export async function getOpportunities(after = null, updatedAfter = null) {
  let url = `${BASE_URL}/opportunities`;
  if (after) {
    url += `?after=${after}`;
  }
  if (updatedAfter) {
    url += `&updatedAfter=${updatedAfter}`;
  }
  return sendRequest(url, 'GET');
}

export async function createOpportunity(opportunity) {
  const url = `${BASE_URL}/opportunities`;
  return sendRequest(url, 'POST', opportunity);
}

export async function getOpportunity(opportunityId) {
  const url = `${BASE_URL}/opportunities/${opportunityId}`;
  return sendRequest(url, 'GET');
}

export async function updateOpportunity(opportunityId, updates) {
  const url = `${BASE_URL}/opportunities/${opportunityId}`;
  return sendRequest(url, 'PATCH', updates);
}

export async function deleteOpportunity(opportunityId) {
  const url = `${BASE_URL}/opportunities/${opportunityId}`;
  return sendRequest(url, 'DELETE');
}
