import { authenticateUser, getUserByUsername, loginUser, updateUser } from "@/utils/api";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  const { section, content } = req.body
  const user = req.session.user;
  if(!user) {
    return res.json({success: false, error: "Not logged in"});
  }
  let data = await updateUser(user.id, {sections: {[section]: content}});
  console.log("Data: ")
  console.log(data)
  res.json(data);
}