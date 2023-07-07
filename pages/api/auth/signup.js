import { authenticateUser, createUser } from "@/utils/api";
import { encryptPassword } from "@/utils/encryptPassword";
import { NextResponse } from "next/server";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  if(req.method !== "POST") return res.send({ error: "Method not allowed" });


  const { email, password, username, rememberMe, type } = req.body;
  if(!email || !password || !username || !type) {
    return res.send({ error: "Missing required fields" });
  }
  // Validate email
  if(!email.includes("@")) {
    return res.send({ error: "Invalid email" });
  }
  // Validate password
  if(password.length < 8) {
    return res.send({ error: "Password must be at least 8 characters" });
  }
  // Validate username
  if(username.length < 4) {
    return res.send({ error: "Username must be at least 4 characters" });
  }
  if(username.length > 16) {
    return res.send({ error: "Username must be at most 16 characters" });
  }
  if(username.toLowerCase() !== username) {
    return res.send({ error: "Username must be lowercase" });
  }
  // make sure alphanumeric
  if(!username.match(/^[a-z0-9]+$/)) {
    return res.send({ error: "Username must contain only numbers and letters" });
  }
  const { key, salt } = await encryptPassword(password);
  console.log(`Key: ${key}, Length: ${key.length}`);
  let user = await createUser({
    username,
    email,
    key,
    salt,
    type: type || "inner"
  });
  // store in session
  if(user.success) {
    req.session.user = {id: user.user.user_id, username: user.user.username, email: user.user.email, type: user.user.type, link: user.user.link, salt, key};
    await req.session.save();
  }

  return res.send(user);
}