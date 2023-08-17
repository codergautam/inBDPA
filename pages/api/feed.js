import { countSessionsForArticle, countSessionsForOpportunity, getAllArticlesMongo, getAllOpportunitiesMongo, getManyUsersFast, getOpportunities, getUserFromMongo } from "@/utils/api";
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

  let myFirstDegreeConnections = (await getUserFromMongo(req.session.user.id))?.connections ?? [];
  myFirstDegreeConnections = [...myFirstDegreeConnections, req.session.user.id];
  const { last, keywords } = req.body;
  try {
  let stuff = [...(await getAllOpportunitiesMongo()).map((e)=>e.toObject()), ...Object.values(await getManyUsersFast(null, true))];
  let articles = await getAllArticlesMongo();
  articles = articles.filter((e) => myFirstDegreeConnections.includes(e.creator_id)).map((e) => {return {
    type: "article",
    ...e.toObject(),
  }});
  await Promise.all(articles.map(async (article) => {
    try {
    const active = (await countSessionsForArticle(article.article_id)).active
    return {...article, activeSessions: active}
    } catch(e) {
      console.log(e);
      return article;
    }
  }));

  stuff = [...stuff, ...articles];
  if(keywords && keywords.length > 0) stuff = articles;
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
      type: e.type === "article" ? "article" : "opportunity"
    }
  }).filter((e) => {
    if(e.user_id) {
      return (e.user_id !== req.session.user.id && e.sections?.about) ;
    }
    return true;
  })
  if(last) {
    let lastIndex = stuff.findIndex((item) => item.opportunity_id === last || item.user_id === last || item.article_id === last);
    if(lastIndex > -1) {
    stuff = stuff.slice(lastIndex+1);
    }
  }
  // Limit to 10 items
  if(keywords && keywords.length > 0) {
  stuff = stuff.filter((e) => {
    console.log(e)
    if(keywords) {
      return e.keywords.some((keyword) => keywords.includes(keyword.toLowerCase()));
    }
    return true;
  })
}

  stuff = stuff.slice(0, 10);



  res.json({success: true, items: stuff});
  } catch(e) {
    console.log(e);
    res.json({success: false, error: "Couldn't get opportunities!"});
  }
}