// utils/hscc/sessionEndpoints.js
// This file contains functions related to session endpoints for the HSCC project. It includes functions to create a session, renew a session, delete a session, count sessions for a user, and count sessions for an opportunity.
//
// The `createSession` function sends a POST request to the `/sessions` endpoint with the provided session object.
//
// The `renewSession` function sends a PATCH request to the `/sessions/{sessionId}` endpoint to renew a specific session.
//
// The `deleteSession` function sends a DELETE request to the `/sessions/{sessionId}` endpoint to delete a specific session.
//
// The `countSessionsForUser` function sends a GET request to the `/sessions/count-for/user/{userId}` endpoint to count the number of sessions for a specific user.
//
// The `countSessionsForOpportunity` function counts the number of sessions for a specific opportunity. It first checks if the `activeSessions` property exists in the Opportunity model in MongoDB and if the time range since the last update is within a minute. If so, it returns the cached value. Otherwise, it falls back to making a request to the `/sessions/count-for/opportunity/{opportunityId}` endpoint, updates the `activeSessions` and `lastUpdatedActive` fields in the Opportunity model, and returns the original request.
import { Opportunity } from "../mongo/mongoInit";
import { BASE_URL, sendRequest } from "./hsccInit";

export async function createSession(session) {
  const url = `${BASE_URL}/sessions`;
  return sendRequest(url, 'POST', session);
}

export async function renewSession(sessionId) {
  const url = `${BASE_URL}/sessions/${sessionId}`;
  return sendRequest(url, 'PATCH');
}

export async function deleteSession(sessionId) {
  const url = `${BASE_URL}/sessions/${sessionId}`;
  return sendRequest(url, 'DELETE');
}

export async function countSessionsForUser(userId) {
  const url = `${BASE_URL}/users/${userId}`;
  let res = await sendRequest(url, 'GET');

  if(!res || !res.success || !res.user) return {success: false, error: "Could not fetch user"}

  let sessionCount = res.user.sessions;

  return { active: sessionCount }
}

export async function countSessionsForOpportunity(opportunityId) {
  const minutes = 20/60 //Yeah, 1 min refresh
  let opp = await Opportunity.findOne({opportunity_id: opportunityId})
  //Check for if the activeSessions prop actually exists and then whether is a valid time range
  if(Number.isInteger(opp?.activeSessions) && (Date.now() - new Date(opp.lastUpdatedActive).getTime()) < (Math.pow(10, 3) * minutes * 60)) {
    console.log("Cached session count: ", opp.activeSessions)
    return { active: opp.activeSessions }
  }

  //Fallback
  const url = `${BASE_URL}/opportunities/${opportunityId}`;
  let res = await sendRequest(url, 'GET');

  console.log("Fetched opportunity: ", res)
  if(!res || !res.success || !res.opportunity) return {success: false, error: "Could not fetch opportunity"}

  let sessionCount = res.opportunity.sessions;
  console.log("Session count: ", sessionCount)
  //Update Mongo
  await Opportunity.updateOne({opportunity_id: opportunityId}, {
    $set: {
      activeSessions: sessionCount,
      lastUpdatedActive: Date.now()
    }
  })

  // Refetch and make sure its set
  opp = await Opportunity.findOne({opportunity_id: opportunityId})

  console.log("Fallback session count: ", opp.activeSessions)
  //Return original request
  return { active: sessionCount }
}
