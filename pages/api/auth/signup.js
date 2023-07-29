import { authenticateUser, createUser } from "@/utils/api";
import { encryptPassword } from "@/utils/encryptPassword";
import { NextResponse } from "next/server";
import { withIronSessionApiRoute } from "iron-session/next";
import { createUser as createUserNode } from "@/utils/neo4j.mjs";
import tlds from "tlds";

import { getIronOptions } from "@/utils/ironConfig";
 async function handler(req, res) {
  if(req.method !== "POST") return res.send({ error: "Method not allowed" });


  const { email, password, username, rememberMe, type, changeUser } = req.body;
  if(!email || !password || !username) {
    return res.send({ error: "Missing required fields" });
  }
  // Validate email
  if(!email.includes("@")) {
    return res.send({ error: "Invalid email" });
  }
  let domain = email.split("@")[1];
  if(!domain.includes(".")) {
    return res.send({ error: "Invalid email" });
  }
  let tld = domain.split(".")[1];
  if(!tlds.includes(tld)) {
    return res.send({ error: "Invalid email" });
  }
  // Validate password
  if(password.length <= 10) {
    return res.send({ error: "Password must be at least 11 characters" });
  }
  // Validate username
  if(username.length < 4) {
    return res.send({ error: "Username must be at least 4 characters" });
  }
  if(username.length > 16) {
    return res.send({ error: "Username must be at most 16 characters" });
  }
  // make sure alphanumeric ()
  if(username.toLowerCase() !== username) {
    return res.send({ error: "Username cannot contain uppercase letters" });
  }
  if(!username.match(/^[a-zA-Z0-9_-]+$/)) {
    return res.send({ error: "Username cannot contain special characters" });
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
  console.log("User:", user)
  // store in session
  if(user.success && changeUser) {
    req.session.user = {id: user.user.user_id, username: user.user.username, email: user.user.email, type: user.user.type, link: user.user.link, salt, key};
  await createUserNode(user.user.user_id, []);
    await req.session.save();
  }

  if(user.error) {
    if(user.error.toLowerCase() == 'an item with that "email" already exists') {
      return res.send({error: "Email already in use"});
    }
    if(user.error.toLowerCase() == 'an item with that "username" already exists') {
      return res.send({error: "Username taken"});
    }
  }




  if(user.user) {
    delete user.user.salt;
    delete user.user.key;
    }
  return res.send(user);
}

export default function (req, res) {
  return withIronSessionApiRoute(handler, getIronOptions(req.body.rememberMe))(req, res);
}