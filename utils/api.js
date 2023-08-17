// utils/api.js
// This handles our app's connection to the HSCC API and MongoDB.
// It imports/exports helper functions used by throughout the app to interact with the API and MongoDB.

// MONGO Imports
import createNewProfile from './mongo/createNewProfile';
import searchUsers from './mongo/searchUsers';
import getAllOpportunitiesMongo from './mongo/getAllOpportunitiesMongo';
import updateOpportunityMongo from './mongo/updateOpportunityMongo';
import updateUserMongo from './mongo/updateUserMongo';
import getOpportunityMongo from './mongo/getOpportunityMongo';
import deleteOpportunityMongo from './mongo/deleteOpportunityMongo';
import getLatestOpportunitiesMongo from './mongo/getLatestOpportunitiesMongo';
import findProfile from './mongo/findProfile';
import getUserFromProfileId from './mongo/getUserFromProfileId';
import getUserFromEmail from './mongo/getUserFromEmail';
import { createResetLink, getResetLink, redeemResetLink } from './mongo/resetHelpers';
import getUserCount from './mongo/getUserCount';
import changeProfileLink from './mongo/changeProfileLink';
import updateUserTypeInMongo from './mongo/updateUserTypeInMongo';
import { setUserBanner, setUserPfp, getUserBanner, getUserPfp, getUserPfpAndBanner } from './mongo/userVisualHelpers';
import { increaseArticleViewCountMongo, increaseOpportunityViewCountMongo, increaseViewCountMongo } from './mongo/viewCountHelpers';
import getUserFromMongo from './mongo/getUserFromMongo';
import getManyUsersFast from './mongo/getManyUsersFast';
import getProfileIdFromUserId from './mongo/getProfileIdFromUserId';
import updateArticleMongo from './mongo/updateArticleMongo';
import getAllArticlesMongo from './mongo/getAllArticlesMongo';
import deleteArticleMongo from './mongo/deleteArticleMongo';

// Misc Imports
import { refreshSession, setForceLogout, changeUserPassword, incrementOpportunityViews, incrementUserViews, incrementArticleViews, loginUser } from './misc/miscHelpers';

// HSCC Imports
import { getOpportunity, getOpportunities, createOpportunity, deleteOpportunity, updateOpportunity } from './hscc/opportunityEndpoints';
import { createSession, renewSession, deleteSession, countSessionsForOpportunity, countSessionsForUser, getAllSessions, countSessionsForArticle } from './hscc/sessionEndpoints';
import getInfo from './hscc/getInfo';
import { getUsers, createUser, getUser, getUserByUsername, updateUser, deleteUser, addConnection, removeConnection, authenticateUser, getUserConnections } from './hscc/userEndpoints';
import { getArticle, getArticles, deleteArticle, updateArticle, createArticle } from './hscc/articleEndpoints';
// MONGO EXPORTS
export {
  createNewProfile,
  searchUsers,
  getAllOpportunitiesMongo,
  updateOpportunityMongo,
  updateUserMongo,
  getOpportunityMongo,
  deleteOpportunityMongo,
  getLatestOpportunitiesMongo,
  findProfile,
  getUserFromProfileId,
  getUserFromEmail,
  createResetLink,
  getResetLink,
  redeemResetLink,
  getUserCount,
  changeProfileLink,
  updateUserTypeInMongo,
  setUserBanner,
  setUserPfp,
  getUserBanner,
  getUserPfp,
  getUserPfpAndBanner,
  increaseArticleViewCountMongo,
  increaseOpportunityViewCountMongo,
  increaseViewCountMongo,
  getUserFromMongo,
  getManyUsersFast,
  getProfileIdFromUserId,
  updateArticleMongo,
  getAllArticlesMongo,
  deleteArticleMongo
}

// HSCC EXPORTS
export {
  getOpportunity,
  getOpportunities,
  createOpportunity,
  deleteOpportunity,
  updateOpportunity,
  createSession,
  renewSession,
  deleteSession,
  getAllSessions,
  countSessionsForOpportunity,
  countSessionsForUser,
  getInfo,
  getUsers,
  createUser,
  getUser,
  getUserByUsername,
  updateUser,
  deleteUser,
  addConnection,
  removeConnection,
  authenticateUser,
  getUserConnections,
  getArticle,
  getArticles,
  deleteArticle,
  updateArticle,
  createArticle,
  countSessionsForArticle
}

// MISC EXPORTS
export {
  refreshSession,
  setForceLogout,
  changeUserPassword,
  incrementOpportunityViews,
  incrementUserViews,
  incrementArticleViews,
  loginUser
}