import { authenticateUser, createUser } from "@/utils/api";
import { encryptPassword } from "@/utils/encryptPassword";
import { NextResponse } from "next/server";

export async function POST(req) {
  let body;
  try {
  body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" });
  }

  const { email, password, username } = body;
  console.log(body);
  if(!email || !password || !username) {
    return NextResponse.json({ error: "Missing required fields" });
  }
  // Validate email
  if(!email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" });
  }
  // Validate password
  if(password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" });
  }
  // Validate username
  if(username.length < 3) {
    return NextResponse.json({ error: "Username must be at least 3 characters" });
  }
  const { key, salt } = await encryptPassword(password);
  console.log(`Key: ${key}, Length: ${key.length}`);
  let user = await createUser({
    username,
    email,
    key,
    salt,
    type: "inner"
  });
  console.log(user);
  return NextResponse.json(user);
}