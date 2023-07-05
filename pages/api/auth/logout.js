// Clear the session
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
