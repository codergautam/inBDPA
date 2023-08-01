// pages/api/feed.js
// This file is for the API route that handles the feed data for the inBDPA project. It imports necessary functions from the "utils/api" file and the "iron-session/next" package. It also imports the ironOptions object from "utils/ironConfig" and the md5 function from the "blueimp-md5" package.
// The API route is exported as a withIronSessionApiRoute higher-order function, which provides session management for the route.
// The main handler function is defined, which processes the incoming request and generates the feed data.
// There are validation checks to ensure that the request method is POST and the user is logged in.
// The feed data is fetched from the database using the getAllOpportunitiesMongo and getManyUsersFast functions, and then sorted and transformed according to certain conditions.
// There is also functionality to paginate the feed data based on the "last" parameter in the request body.
// The final feed data is limited to 10 items and returned as a JSON response.
// If an error occurs during the process, an error message is returned in the response.
import { countSessionsForOpportunity, getAllOpportunitiesMongo, getManyUsersFast, getOpportunities } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import md5 from "blueimp-md5";

export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  // const { opportunity_id } = req.body
  // console.log("Received ID: " + opportunity_id)
  // const opportunities = (await getOpportunities(opportunity_id ?? null)).opportunities;
  // res.json({opportunities});
  if(req.method !== "POST") {
    return res.json({success: false, error: "Invalid method"});
  }
  if(!req.session.user) {
    return res.json({success: false, error: "Not logged in"});
  }

  const { last } = req.body;
  try {
  let stuff = [...(await getAllOpportunitiesMongo()).map((e)=>e.toObject()), ...Object.values(await getManyUsersFast(null, true))];
  // Sort by createdAt
  stuff = stuff.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }).map((e) => {
    if(e.user_id) {
      return {
        ...e,
      hashedEmail: md5(e?.email?.trim()?.toLowerCase()),
      isConnected: (e.connections ?? []).includes(req.session.user.id),
      connections: null,
      email: null,
      type: "user"
      }
    }
    return {
      ...e,
      type: "opportunity"
    }
  }).filter((e) => {
    if(e.user_id) {
      return (e.user_id !== req.session.user.id && e.sections?.about) ;
    }
    return true;
  })
  if(last) {
    let lastIndex = stuff.findIndex((item) => item.opportunity_id === last || item.user_id === last);
    if(lastIndex > -1) {
    stuff = stuff.slice(lastIndex+1);
    }
  }
  // Limit to 10 items
  stuff = stuff.slice(0, 10);



  res.json({success: true, items: stuff});
  } catch(e) {
    console.log(e);
    res.json({success: false, error: "Couldn't get opportunities!"});
  }
}