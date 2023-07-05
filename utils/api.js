// Import the necessary modules
import fetch from 'node-fetch';
// Define the base URL of the API
const BASE_URL = 'https://inbdpa.api.hscc.bdpa.org/v1';

// Define the common headers for all requests
const headers = {
  'Authorization': 'b57e7a45-6df3-4cbb-a0e7-f9302f12c353',
  'Content-Type': 'application/json'
};

// Define the sendRequest function to make API requests
async function sendRequest(url, method, body = null) {
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while making the API request');
  }
}

// Define the API functions

// Info Endpoints
export async function getInfo() {
  const url = `${BASE_URL}/info`;
  return sendRequest(url, 'GET');
}

// Opportunity Endpoints
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

// Session Endpoints
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
  const url = `${BASE_URL}/sessions/count-for/user/${userId}`;
  return sendRequest(url, 'GET');
}

export async function countSessionsForOpportunity(opportunityId) {
  const url = `${BASE_URL}/sessions/count-for/opportunity/${opportunityId}`;
  return sendRequest(url, 'GET');
}

// User Endpoints
export async function getUsers(after = null, updatedAfter = null) {
  let url = `${BASE_URL}/users`;
  if (after) {
    url += `?after=${after}`;
  }
  if (updatedAfter) {
    url += `&updatedAfter=${updatedAfter}`;
  }
  return sendRequest(url, 'GET');
}

export async function createUser(user) {
  const url = `${BASE_URL}/users`;
  return sendRequest(url, 'POST', user);
}

export async function getUser(userId) {
  const url = `${BASE_URL}/users/${userId}`;
  return sendRequest(url, 'GET');
}

export async function getUserByUsername(username) {
  const url = `${BASE_URL}/users/${username}`;
  return sendRequest(url, 'GET');
}

export async function updateUser(userId, updates) {
  const url = `${BASE_URL}/users/${userId}`;
  return sendRequest(url, 'PATCH', updates);
}

export async function deleteUser(userId) {
  const url = `${BASE_URL}/users/${userId}`;
  return sendRequest(url, 'DELETE');
}

export async function authenticateUser(userId, key) {
  const url = `${BASE_URL}/users/${userId}/auth`;
  return sendRequest(url, 'POST', { key });
}

export async function getUserConnections(userId, after = null) {
  let url = `${BASE_URL}/users/${userId}/connections`;
  if (after) {
    url += `?after=${after}`;
  }
  return sendRequest(url, 'GET');
}

export async function addConnection(userId, connectionId) {
  const url = `${BASE_URL}/users/${userId}/connections/${connectionId}`;
  return sendRequest(url, 'POST');
}

export async function removeConnection(userId, connectionId) {
  const url = `${BASE_URL}/users/${userId}/connections/${connectionId}`;
  return sendRequest(url, 'DELETE');
}