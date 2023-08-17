// utils/mongo/mongoInit.js
// This code initializes the connection to a MongoDB database using Mongoose. It also defines several mongoose schemas for different collections in the database. The schemas include profiles, opportunities, and password reset tokens. Finally, it exports the mongoose connection and the defined models.
import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((res) => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log(err);
});

// Define MongoDb schemas
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const profileSchema = new Schema({
  id: ObjectId,
  user_id: String,
  username: String,
  link: String,
  email: String,
  type: String,
  views: Number,
  createdAt: Number,
  sections: Object,
  connections: [String],
  pfp: String,
  banner: String,
  forceLogout: Date,
  refreshSession: Boolean,
  fullName: String,
});

const opportunitySchema = new mongoose.Schema({
  id: ObjectId,
  opportunity_id: String,
  creator_id: String,
  title: String,
  views: Number,
  createdAt: Number,
  content: String,
  activeSessions: Number,
  lastUpdatedActive: Date
});



const Opportunity = mongoose.models.Opportunity ?? mongoose.model('Opportunity', opportunitySchema);
const resetSchema = new Schema({
  id: ObjectId,
  user_id: String,
  reset_id: String,
  createdAt: Number,
  used: Boolean
});

const articleSchema = new mongoose.Schema({
  id: ObjectId,
  article_id: String,
  creator_id: String,
  title: String,
  views: Number,
  createdAt: Number,
  content: String,
});
const Article = mongoose.models.Article ?? mongoose.model('Article', articleSchema);
const Profile = mongoose.models.Profile ?? mongoose.model('Profile', profileSchema);
const Reset = mongoose.models.Reset ?? mongoose.model('Reset', resetSchema);

export { Profile, Reset, Opportunity, Article, mongoose };