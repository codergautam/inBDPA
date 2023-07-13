/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMask, faBars } from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ user }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const leaveImpersonation = async () => {
    let data = await fetch("/api/admin/returnToAdmin").then((res) =>
      res.json()
    );
    if (data.success) {
      router.push("/");
    } else {
      // TODO: Handle error
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between self-center portrait:default:focus-visible w-full h-1/6 bg-white border-b-2 dark:bg-gray-800 border-black dark:border-gray-500 p-4 text-center">
      <div className="h-min">
        <Link href="/">
          <img
            className="h-36 self-center dark:hidden inline"
            src="https://i.imgur.com/uWlkxIt.png"
            alt="BDPA logo"
          />
        </Link>
        <Link href="/">
          <img
            className="w-36 self-center hidden dark:inline"
            src="https://i.imgur.com/GOmYSIZ.png"
            alt="BDPA logo"
          />
        </Link>
      </div>

      <div className="flex flex-row items-center ">
        {user && user.impersonating && (
          <>
            <button
              onClick={leaveImpersonation}
              className="w-min min-w-max group flex text-sm font-medium text-gray-700 rounded dark:text-gray-200 hover:font-bold"
            >
              Leave Impersonation
              <FontAwesomeIcon
                className="my-auto ml-2 text-gray-700 group-hover:text-white transition duration-300 ease-in-out w-5 h-5"
                icon={faMask}
              />
            </button>
          </>
        )}
        {user && user.type === "administrator" && (
          <>
            <Link
              href={`/admin/${user.link}`}
              className="px-2 py-1 text-xs sm:text-sm md:text-lg font-medium"
            >
              Admin
            </Link>
          </>
        )}
        {user ? (
          <>
            <Link
              href="/"
              className="px-2 py-1 text-xs sm:text-sm md:text-lg font-medium"
            >
              Home
            </Link>
            <Link
              href="../opportunities"
              className="px-2 py-1 text-xs sm:text-sm md:text-lg font-medium"
            >
              Opportunities
            </Link>
            <Link
              href="../api/auth/logout"
              className="px-2 py-1 text-xs sm:text-sm md:text-lg font-medium"
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link
              href="../auth/login"
              className="px-2 py-1 text-xs sm:text-sm md:text-lg font-medium"
            >
              Login
            </Link>

            <Link
              href="../auth/signup"
              className="px-2 py-1 text-xs sm:text-sm md:text-lg font-medium"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
