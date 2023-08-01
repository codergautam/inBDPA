// utils/hscc/getInfo.js
// This file contains the code for retrieving information from the HSCC server. The getInfo function is a async function that sends a GET request to the /info endpoint of the server specified by the BASE_URL constant. The server response is returned as a Promise.
// 
// This code file was created to handle the retrieval of information from the HSCC server in a lazy manner. The getInfo function provides a convenient way to get information from the server by abstracting away the details of sending a HTTP request and handling the response.
// 
// First, the code imports the BASE_URL constant and the sendRequest function from the hsccInit module. These are used to construct the URL for the GET request and send the request to the server, respectively.
// 
// The getInfo function is then defined as an async function. It constructs the URL by appending the "/info" string to the BASE_URL and assigns it to the url variable.
// 
// The sendRequest function is called with the url and 'GET' as arguments to send a GET request to the specified URL. The response from the server is returned as the result of the getInfo function.
import { BASE_URL, sendRequest } from "./hsccInit";

export default async function getInfo() {
  const url = `${BASE_URL}/info`;
  return sendRequest(url, 'GET');
}