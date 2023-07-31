// pages/api/auth/reset.js
// This code creates an API route for handling password reset in a Next.js application.
// It first validates the incoming POST request to ensure it includes 'resetId', 'password', and 'confirmPassword'. It also checks for password length and whether the provided passwords match.
// It then fetches the password reset link associated with the 'resetId' and checks if the link is still valid.
// If valid, it attempts to change the user password using the 'changeUserPassword' function. If successful, the reset link is redeemed using 'redeemResetLink'.
// Any errors or success messages are returned as the response.
// The route uses 'iron-session' for session management with the configuration provided in 'ironOptions'.

import { authenticateUser, changeUserPassword, createResetLink, getResetLink, getUserByUsername, loginUser, redeemResetLink } from "@/utils/api";
import { NextResponse } from "next/server";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  if(req.method !== "POST") return res.send({ error: "Method not allowed" });


  const { resetId, password, confirmPassword} = req.body;
  if(!resetId) {
    return res.send({error: "Unexpected Error"})
  }

  if (!password) {
    return res.send({ error: "Please enter a password" });
  }
    if (password !== confirmPassword) {
    return res.send({ error: "Passwords don't match" });
  }
  if(password.length < 11) {
    return res.send({ error: "Password must be at least 11 characters" });
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