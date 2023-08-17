// utils/hscc/userEndpoints.js
// This file contains functions for interacting with the user endpoints of the HSCC API. It includes functions for getting users, creating users, updating users, deleting users, and managing user connections.
//
// The `getUsers` function retrieves a list of users from the API. It accepts optional parameters for pagination, allowing you to specify a starting point and retrieve only updated users.
//
// The `createUser` function sends a POST request to create a new user. If the request is successful, it also generates a random profile ID for the user and calls the `createNewProfile` function to create a profile with the generated ID.
//
// The `getUser` function retrieves a specific user by their ID.
//
// The `getUserByUsername` function retrieves a specific user by their username.
//
// The `updateUser` function sends a PATCH request to update a user's information.
//
// The `deleteUser` function sends a DELETE request to delete a user.
//
// The `addConnection` function sends a POST request to add a connection between two users.
//
// The `removeConnection` function sends a DELETE request to remove a connection between two users.
//
// The `authenticateUser` function sends a POST request to authenticate a user with a given key.
//
// The `getUserConnections` function retrieves a list of a user's connections. It accepts an optional parameter for pagination.
import { createNewProfile } from "../api";
import generateRandomId from "../generateRandomProfileId";
import { sendRequest, BASE_URL } from "./hsccInit";

export async function getUsers(after = null, updatedAfter = null) {
  let url = `${BASE_URL}/users`;
  if (after) {
    url += `?after=${after}`;
  }
  if (updatedAfter) {
    url += `&updatedAfter=${updatedAfter}`;
  }
  try {
  let res = await sendRequest(url, 'GET');
  return res;
} catch (e) {
  return [];
}
}

export async function createUser(user) {
  console.log("Creating user: ", user);
  const url = `${BASE_URL}/users`;

  let res = await sendRequest(url, 'POST', user);
  if(res.success) {
    res.user.link = generateRandomId();
    await createNewProfile({ user_id: res.user.user_id, username: res.user.username, link: res.user.link,
      pfp: "gravatar", email: res.user.email, type: res.user.type, fullName: res.user.fullName });
  }
  return res;

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

export async function addConnection(userId, connectionId) {
  const url = `${BASE_URL}/users/${userId}/connections/${connectionId}`;
  return sendRequest(url, 'POST');
}

export async function removeConnection(userId, connectionId) {
  const url = `${BASE_URL}/users/${userId}/connections/${connectionId}`;
  return sendRequest(url, 'DELETE');
};

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
