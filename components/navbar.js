/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMask, faBars } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Navbar({ user }) {
  const [navhidden, setNavHidden] = useState(false);

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
    <div className="flex flex-col md:flex-row items-center justify-between w-full bg-gray-50 dark:bg-gray-900 p-3 sm:py-4 md:p-4 lg:py-5 text-center">
      <div className="md:flex-none flex flex-row justify-between md:justify-normal w-full md:w-fit h-min items-center">
        <div className="w-fit">
        <Link href="/" className="w-fit">
          <Image
            className="w-24 sm:w-24 md:w-28 dark:hidden inline transition duration-300 transform hover:scale-110"
            src="/logos/light.png"
            alt="BDPA logo"
            width={1000000}
            height={1000000}
          />
        </Link>
        <Link href="/" className="w-fit">
          <Image
            className="w-24 sm:w-24 md:w-28 pt-0 hidden dark:inline transition duration-300 transform hover:scale-110"
            src="/logos/dark.png"
            alt="BDPA logo"
            width={1000000}
            height={1000000}
          />
        </Link>
        </div>
        <svg
          className="md:hidden inline h-min w-10 fill-current dark:text-white text-black"
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 50 50"
          onClick={() => setNavHidden(!navhidden)}
        >
          <path d="M 3 8 A 2.0002 2.0002 0 1 0 3 12 L 47 12 A 2.0002 2.0002 0 1 0 47 8 L 3 8 z M 3 23 A 2.0002 2.0002 0 1 0 3 27 L 47 27 A 2.0002 2.0002 0 1 0 47 23 L 3 23 z M 3 38 A 2.0002 2.0002 0 1 0 3 42 L 47 42 A 2.0002 2.0002 0 1 0 47 38 L 3 38 z"></path>
        </svg>
      </div>
      {/* <div
        className={
          navhidden
            ? "h-min flex flex-row items-center"
            : "h-min items-center hidden"
        }
      ></div> */}

      <div
        className={navhidden ? "h-min flex flex-col md:flex-row items-center gap-y-1 pb-2 md:gap-y-0 md:pb-0" : "h-min md:flex flex-col md:flex-row hidden items-center gap-y-1 pb-2 md:gap-y-0 md:pb-0"}
      >
        {user && user.impersonating && (
          <>
            <button
              onClick={leaveImpersonation}
              className="border-1 px-2 py-1 text-md xl:text-lg font-bold fill-current text-emerald-500 dark:text-emerald-400 hover:text-black dark:hover:text-white transition duration-400 ease-in-out"
            >
              Leave Impersonation
              <FontAwesomeIcon
                className="my-auto ml-0.5 lg:ml-1 w-5 h-5"
                icon={faMask}
              />
            </button>
          </>
        )}
        {user && user.type === "administrator" && (
          <>
            <Link
              href={`/admin/${user.link}`}
              className="border-1 px-2 py-1 text-xs sm:text-lg font-bold text-emerald-500 dark:hover:text-white transition duration-400 ease-in-out hover:text-black"
            >
              Admin
            </Link>
          </>
        )}
        {user ? (
          <>
            <Link
              href="/"
              className="px-2 py-1 text-md xl:text-lg font-medium dark:hover:text-blue-500 hover:text-blue-600 transition duration-400 ease-in-out text-black dark:text-white"
              // className="block py-2 pl-3 pr-4 dark:hover:text-blue-500 hover:text-blue-600 md:p-0 text-black dark:text-white transition duration-400 ease-in-out"
            >
              Home
            </Link>
            <Link
              href="../opportunities"
              className="px-2 py-1 text-md xl:text-lg font-medium dark:hover:text-blue-500 hover:text-blue-600 transition duration-400 ease-in-out text-black dark:text-white"
            >
              Opportunities
            </Link>
            <Link
              href="../api/auth/logout"
              className="px-2 py-1 text-md sm:text-md xl:text-lg font-medium dark:hover:text-blue-500 hover:text-blue-600 transition duration-400 ease-in-out text-black dark:text-white mb-2 md:mb-0"
            >
              Logout
            </Link>
            <Link
              href={`/profile/${user.link}`}
              className="text-sm sm:text-md xl:text-lg font-medium text-gray-200 bg-gray-700 hover:text-black hover:bg-gray-300 dark:text-black dark:bg-gray-200 dark:hover:text-white dark:hover:bg-gray-600 transition duration-300 ease-in-out rounded-full px-4 py-2 md:ml-2 ml-0"
            >
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/"
              className="px-2 py-1 text-md sm:text-md xl:text-lg font-medium dark:hover:text-blue-500 hover:text-blue-600 transition duration-400 ease-in-out text-black dark:text-white mb-2 md:mb-0"
            >
              Home
            </Link>
            <Link
              href="/auth/login"
              className="px-2 py-1 text-md sm:text-md xl:text-lg font-medium dark:hover:text-blue-500 hover:text-blue-600 transition duration-400 ease-in-out text-black dark:text-white mb-2 md:mb-0"
            >
              Login
            </Link>

            <Link
              href="/auth/signup"
              className="px-2 py-1 text-md sm:text-md xl:text-lg font-medium dark:hover:text-blue-500 hover:text-blue-600 transition duration-400 ease-in-out text-black dark:text-white mb-2 md:mb-0"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}