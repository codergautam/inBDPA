// lib/getRequestCookie.ts
import { unsealData } from "iron-session";
import { cookieName, cookiePassword } from "./ironConfig";

/**
 * Can be called in page/layout server component.
 * @param cookies ReadonlyRequestCookies
 * @returns SessionUser or null
 */
export async function getRequestCookie(
  cookies
){
  const found = cookies.get(cookieName);

  if (!found) return null;

  const { user } = await unsealData(found.value, {
    password: cookiePassword,
  });

  return user;
}
