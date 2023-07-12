import { authenticateUser, getUserByUsername, loginUser } from "@/utils/api";
import { NextResponse } from "next/server";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  if(req.method !== "POST") return res.send({ error: "Method not allowed" });


  const { username, password } = req.body;
  if (!password || !username) {
    return res.send({ error: "Missing required fields" });
  }

  let user = await loginUser(username, password);
  console.log("User:")
  console.log(user)
  // store in session
  if(user.success) {
    console.log("Logging in")
    req.session.user = {id: user.user.user_id, username: user.user.username, email: user.user.email, type: user.user.type, link: user.user.link, salt: user.user.salt, key: user.user.key};
    console.log(req.session.user);
    await req.session.save();
  } else {
    return res.send({error: "Invalid username or password"});
  }


  return res.send(user);
}