// utils/mongo/searchUsers.js
// This code is written to search for users and opportunities in a MongoDB database based on a given query. It uses a case-insensitive regular expression to match the query against the username, sections' about field, and link field in the profiles collection. It also matches the query against the content and title fields in the opportunities collection. The search prioritizes exact matches and returns the results in descending order based on the number of views.
import md5 from "blueimp-md5";
import sanitizeRegex from "../sanitizeRegex";
import { Opportunity, Profile } from "./mongoInit";

export default async function searchUsers(query) {
  try {
    const origQuery = query+'';
    query = sanitizeRegex(query);
    const regexQuery = new RegExp(query, 'i');  // 'i' makes it case insensitive
    const profiles = await Profile.find({
      $or: [
        { username: regexQuery },
        { 'sections.about': regexQuery },
        { link: regexQuery}
      ]
    })
    .sort({ views: -1 }) // Sort by views descending
    .limit(500);

    let users = await Promise.all(profiles.map(async (user) => {

      if (user) {
        user = user.toObject();
        if(user.pfp === "gravatar") {
          user.gravatarUrl = "https://www.gravatar.com/avatar/"+md5(user.email)+"?d=identicon"
        }
        delete user.email;
        // Figure out where the match was found and its position
        const matchField = user.username.match(regexQuery) ? 'username' : user.link.match(regexQuery) ? 'link' : 'about';
        const matchText = matchField === 'about' ? user.sections?.about : user[matchField];
        let matchPosition;
        try {
          matchPosition = matchText.toLowerCase().indexOf(query.toLowerCase());
        } catch (error) {
          matchPosition = null;
        }

        return {
          ...user,
          match: {
            field: matchField,
            position: matchPosition
          }
        };
      }
    }));
    users = users.filter((user) => user !== undefined)
    // Prioritize exact matches
    users.sort((a, b) => {

      let aField = a.match.field === 'about' ? a.sections?.about : a[a.match.field];
      let bField = b.match.field === 'about' ? b.sections?.about : b[b.match.field];
      if (aField.toLowerCase() === query.toLowerCase() && bField.toLowerCase() !== query.toLowerCase()) {
        return -1; // a is exact match, b is not
      }
      if (aField.toLowerCase() !== query.toLowerCase() && bField.toLowerCase() === query.toLowerCase()) {
        return 1; // b is exact match, a is not
      }
      return 0; // neither or both are exact matches
    });

    // Opportunities search

    let opportunities = await Opportunity.find({
      $or: [
        { content: regexQuery },
        { title: regexQuery },
      ]
    })
    .sort({ views: -1 }) // Sort by views descending
    .limit(500);

     opportunities = await Promise.all(opportunities.map(async (opportunity) => {

      if (opportunity) {
        opportunity = opportunity.toObject();

        delete opportunity.creator_id;
        // Figure out where the match was found and its position

        const matchField = opportunity.title.match(regexQuery) ? 'title' : 'content';
        let matchPosition;
        try {
          matchPosition = opportunity[matchField].toLowerCase().indexOf(query.toLowerCase());
        } catch (error) {
          matchPosition = null;
        }

        return {
          ...opportunity,
          match: {
            field: matchField,
            position: matchPosition,
          }
        };
      }
    }));

    // Prioritize exact matches
    opportunities.sort((a, b) => {

      if (a[a.match.field].toLowerCase() === query.toLowerCase() && b[b.match.field].toLowerCase() !== query.toLowerCase()) {
        return -1; // a is exact match, b is not
      }

      if (a[a.match.field].toLowerCase() !== query.toLowerCase() && b[b.match.field].toLowerCase() === query.toLowerCase()) {
        return 1; // b is exact match, a is not
      }
      return 0; // neither or both are exact matches
    });

    return { success: true, users, opportunities };
  } catch (error) {
    console.log('Error while trying to search users: ', error);
    return { success: false, error: "Unexpected Error" };
  }
}