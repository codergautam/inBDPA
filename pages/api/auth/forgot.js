// pages/api/auth/forgot.js
// This code sets up an API route for generating a password reset link in a Next.js application.
// It checks if the request is a POST and if an email is provided in the request body.
// Using the provided email, it attempts to create a password reset link with the 'createResetLink' function.
// The created link (or any encountered error) is then returned as the response.
// This route uses 'iron-session' for session management with the configuration specified in 'ironOptions'.

import { authenticateUser, createResetLink, getUserByUsername, loginUser } from "@/utils/api";
import { NextResponse } from "next/server";
import { withIronSessionApiRoute } from "iron-session/next";

import { ironOptions } from "@/utils/ironConfig";
import { convertHexToBuffer } from "@/utils/encryptPassword";
export default withIronSessionApiRoute(handler, ironOptions);

 async function handler(req, res) {
  if(req.method !== "POST") return res.send({ error: "Method not allowed" });


  const { email } = req.body;
  if (!email) {
    return res.send({ error: "Missing email" });
  }

  let user = await createResetLink(email);
  return res.send(user);
}