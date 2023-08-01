// utils/hscc/hsccInit.js
// This file contains the implementation of the `sendRequest` function, which is used to make API requests to the inBDPA API. It also defines the `BASE_URL` constant, which holds the base URL for the API.
// 
// The `sendRequest` function takes in the URL, method, and an optional request body. It returns a Promise that resolves with the response data or rejects with an error. This function uses a rate limiting mechanism to ensure that the API requests are made at a controlled rate. The maximum number of requests that can be made within a time window is defined by the `MAX_REQUESTS_RATE` constant, and the time window is defined by the `TIME_WINDOW` constant.
// 
// The `processQueue` function is responsible for processing the requests in the queue. It checks if there are any requests in the queue and if the current request rate is below the maximum rate. If both conditions are met, it sends the request using the `_sendRequest` function. If the request limit has been reached, it waits for the remaining time in the time window and then tries to process the next request in the queue.
// 
// The `_sendRequest` function is a helper function that actually makes the API request. It takes in the URL, method, and an optional request body. It sets the necessary headers for the request and sends the request using the `fetch` function. It returns the response data, or an error message if the request fails.
// 
// Overall, this code provides a mechanism for making API requests to the inBDPA API while ensuring that the request rate is controlled.
import fetch from 'node-fetch';
import { config } from 'dotenv';
config()

export const BASE_URL = 'https://inbdpa.api.hscc.bdpa.org/v1';

// Define the sendRequest function to make API requests
const MAX_REQUESTS_RATE = 3;
const TIME_WINDOW = 1000;

let queue = [];
let lastRequestTime = Date.now();
let currentRequestRate = 0;

export async function sendRequest(url, method, body = null) {
  return new Promise((resolve, reject) => {
    // Push the request details into the queue
    queue.push({
      url,
      method,
      body,
      resolve,
      reject
    });
    processQueue();
  });
}

async function processQueue() {
  if(queue.length === 0) return;

  const timeSinceLastRequest = Date.now() - lastRequestTime;

  if(timeSinceLastRequest > TIME_WINDOW) {
    currentRequestRate = 0;
    lastRequestTime = Date.now();
  }

  if(currentRequestRate < MAX_REQUESTS_RATE) {
    // Send a request
    const req = queue.shift();
    currentRequestRate++;
    try {
      const data = await _sendRequest(req.url, req.method, req.body);
      req.resolve(data); // Resolve the Promise
    } catch (error) {
      req.resolve(error); // Reject the Promise
    }
    processQueue(); // Try to process the next request in the queue
  } else {
    // If we have reached the request limit, wait and try again
    setTimeout(processQueue, TIME_WINDOW - timeSinceLastRequest);
  }
}

async function _sendRequest(url, method, body = null) {
  // Define the common headers for all requests
  let headers = {
    'Authorization': 'bearer '+process.env.API_KEY,
    'Content-Type': 'application/json'
  };
  if(method.toLowerCase() === 'delete') {
    delete headers['Content-Type'];
  }


    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
      });
      const data = await response.json();
      if(!response.ok) {
        switch (response.status) {
          case 400:
            return { success: false, error: "Bad request" }
          case 429:
            return {success: false, error: data.retryAfter ? "Too many requests. Please try again in "+msToTime(data.retryAfter) : "Too many requests. Please try again shortly."}
          case 555:
            return { success: false, error: "Something went wrong. Please try again shortly." }
        }
      }
      return data;
    } catch (error) {
      return {success: false, error: "Something went wrong. Please try again shortly."}
      // throw new Error('An error occurred while making the API request');
    }
}