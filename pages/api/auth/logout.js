// pages/api/auth/logout.js
// This code sets up an API route for handling user logout in a Next.js application.
// Upon receiving a request, it destroys the current user's session and saves the session state.
// After successfully clearing the session, it redirects the user to the homepage.
// The route is wrapped with 'withIronSessionApiRoute' for session management, using 'ironOptions' for the configuration.

// Clear the session
import { forceLogoutUserStatus } from "@/utils/api";
import { ironOptions } from "@/utils/ironConfig";
import { withIronSessionApiRoute } from "iron-session/next";

const logoutHandler = async (req, res) => {
  // Clear the user session
  req.session.destroy();
  await req.session.save();

  // Redirect to the homepage
  res.redirect("/");
};

export default withIronSessionApiRoute(logoutHandler, ironOptions);
