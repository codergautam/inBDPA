import { authenticateUser, changeUserPassword, createResetLink, getResetLink, getUserByUsername, loginUser, redeemResetLink } from "@/utils/api";
import { NextResponse } from "next/server";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  if(req.method !== "POST") return res.send({ error: "Method not allowed" });


  const { resetId, password} = req.body;
  if(!resetId) {
    return res.send({error: "Unexpected Error"})
  }

  if (!password) {
    return res.send({ error: "Please enter a password" });
  }
  if(password.length < 8) {
    return res.send({ error: "Password must be at least 8 characters" });
  }

  let resetLink = await getResetLink(resetId);
  if(!resetLink || resetLink.error) {
    return res.send({error: resetLink.error ?? "Unexpected Error"})
  }
  let { user_id, createdAt } = resetLink;
  let now = Date.now();
  let timeDiff = now - createdAt;
  let hour = 1000 * 60 * 60;
  if(timeDiff > hour) {
    return res.send({error: "Reset link expired"})
  }

  let out = await changeUserPassword(user_id, password);
  if(out.success) {
    await redeemResetLink(resetId);
  }
  return res.send(out);
}