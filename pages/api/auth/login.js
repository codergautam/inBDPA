import { authenticateUser, getUserByUsername, loginUser } from "@/utils/api";
import { NextResponse } from "next/server";
import { withIronSessionApiRoute } from "iron-session/next";

import { getIronOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";

async function handler(req, res) {
  if (req.method !== "POST") return res.send({ error: "Method not allowed" });

  const { username, password, rememberMe } = req.body;
  if (!password || !username) {
    return res.send({ error: "Missing required fields" });
  }

  let user = await loginUser(username, password);

  // store in session
  if (user.success) {
    console.log("Successfully logged in")
    req.session.user = {id: user.user.user_id, username: user.user.username, email: user.user.email, type: user.user.type, link: user.user.link, salt: user.user.salt, key: user.user.key};
    await req.session.save();
  } else {
    return res.send({error: user.error});
  }

  delete user.user.salt;
  delete user.user.key;
  return res.send(user);
}

export default function (req, res) {
  return withIronSessionApiRoute(handler, getIronOptions(req.body.rememberMe ?? false))(req, res);
}
