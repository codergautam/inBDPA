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
    <div className="flex flex-col sm:flex-row items-center justify-between w-full bg-slate-100 dark:bg-gray-900 p-3 md:p-4 lg:py-5 text-center">
      <div className="h-min">
        <Link href="/">
          <img
            className="w-20 sm:w-36 self-center dark:hidden inline transition duration-300 transform hover:scale-110"
            src="https://cdn.discordapp.com/attachments/1121115967120998540/1129195814447759410/Screenshot_2023-07-13_at_6.34.43_PM-PhotoRoom.png-PhotoRoom.png"
            alt="BDPA logo"
          />
        </Link>
        <Link href="/">
          <img
            className="w-28 sm:w-36 pt-0 relative self-center hidden dark:inline transition duration-300 transform hover:scale-110"
            src="https://cdn.discordapp.com/attachments/1121115967120998540/1129463854536085557/168935544518199980.png"
            alt="BDPA logo"
          />
        </Link>
      </div>

      <div className="h-min flex flex-row items-center">
        {user && user.impersonating && (
          <>
            <button
              onClick={leaveImpersonation}
              className="w-min min-w-max group flex text-sm font-medium text-gray-700 rounded dark:text-white hover:font-bold hover:text-white transition duration-300 ease-in-out"
            >
              Leave Impersonation
              <FontAwesomeIcon
                className="my-auto ml-2 text-gray-700 group-hover:text-white transition duration-300 dark:text-white ease-in-out w-5 h-5"
                icon={faMask}
              />
            </button>
          </>
        )}
        {user && user.type === "administrator" && (
          <>
            <Link
              href={`/admin/${user.link}`}
              className="border-1 border-red-400 px-2 py-1 text-xs sm:text-lg font-bold dark:text-blue-500 hover:text-white transition duration-400 ease-in-out dark:hover:text-white"
            >
              Admin
            </Link>
          </>
        )}
        {user ? (
          <>
            <Link
              href="/"
              className="px-2 py-1 text-xs sm:text-lg font-medium hover:text-blue-500 transition duration-400 ease-in-out dark:text-white"
            >
              Home
            </Link>
            <Link
              href="../opportunities"
              className="px-2 py-1 text-xs sm:text-lg font-medium hover:text-blue-500 transition duration-400 ease-in-out dark:text-white"
            >
              Opportunities
            </Link>
            <Link
              href="../api/auth/logout"
              className="px-2 py-1 text-xs sm:text-lg font-medium hover:text-blue-500 transition duration-400 ease-in-out dark:text-white"
            >
              Logout
            </Link>
            <Link
              href={`/profile/${user.link}`}
              className="font-medium text-gray-200 bg-gray-700 hover:text-black hover:bg-gray-300 dark:text-black dark:bg-gray-200 dark:hover:text-white dark:hover:bg-gray-600 transition duration-300 ease-in-out rounded-full px-4 py-2 ml-2"
            >
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/"
              className="px-2 py-1 text-xs sm:text-lg font-medium hover:text-blue-500 transition duration-400 ease-in-out dark:text-white"
            >
              Home
            </Link>
            <Link
              href="../auth/login"
              className="px-2 py-1 text-xs sm:text-lg font-medium hover:text-blue-500 transition duration-400 ease-in-out dark:text-white"
            >
              Login
            </Link>

            <Link
              href="../auth/signup"
              className="px-2 py-1 text-xs sm:text-lg font-medium hover:text-blue-500 transition duration-400 ease-in-out dark:text-white"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}