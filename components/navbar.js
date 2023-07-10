"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMask, faBars } from "@fortawesome/free-solid-svg-icons"

export default function Navbar({ user }) {
  const router = useRouter();

  const leaveImpersonation = async () => {
    let data = await fetch("/api/admin/returnToAdmin").then(res => res.json());
    if (data.success) {
      router.push("/");
    } else {
      // TODO: Handle error
    }
  };

  return (
    <div className={`flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 px-2`}>
      <div className="flex flex-col sm:flex-row content-center justify-between self-center portrait:default:focus-visible w-full h-1/6 bg-white border-b-2 dark:bg-gray-800 border-black dark:border-gray-500 p-4 text-center">
        <div className="flex flex-row self-center text-2xl sm:text-4xl md:text-5xl font-bold text-black dark:text-gray-200 cursor-pointer select-none">
          <Link href="http://localhost:3000">
            in
          </Link>
          <Link href="http://localhost:3000">
            <img className="w-10 h-10 self-center" src="https://bdpa.org/wp-content/uploads/2020/12/f0e60ae421144f918f032f455a2ac57a.png" alt="BDPA logo"/>
          </Link>
          <Link href="http://localhost:3000">
            dpa
          </Link>
        </div>
          <div className={`flex-1 md:flex md:items-center md:justify-between py-2 px-2 ${isOpen ? '' : 'hidden'} md:flex`}>
            {/* <div className="flex flex-col -mx-4 md:flex-row md:items-center md:mx-8">
              Existing code
            </div> */}
            <div className="flex flex-row content-center justify-between self-center portrait:default:focus-visible w-full h-1/6 bg-white border-b-2 dark:bg-gray-800 border-black dark:border-gray-500 p-4 text-center">

        <div className="flex flex-col sm:flex-row items-center mt-4 md:mt-0 self-center">
          {user && (
            <div className={`sm:flex `}>
              {user.impersonating && (
                <button
                  onClick={leaveImpersonation}
                  className="w-min min-w-max group flex text-sm font-medium text-gray-700 rounded dark:text-gray-200 hover:font-bold"
                >
                  Leave Impersonation
                  <FontAwesomeIcon className="my-auto ml-2 text-gray-700 group-hover:text-white transition duration-300 ease-in-out w-5 h-5" icon={faMask} />
                </button>
              )}
              {user.type === "administrator" && (
                <Link
                  href={`/admin/${user.link}`}
                  className="px-2 py-1 text-sm font-medium text-black rounded-md dark:text-gray-200 dark:hover:font-bold hover:font-bold"
                >
                  Admin
                </Link>
              )}
              <Link
                href="http://localhost:3000"
                className="px-2 py-1 text-sm font-medium text-black rounded-md dark:text-gray-200 dark:hover:font-bold hover:font-bold"
              >
                Home
              </Link>
              <Link
                href="opportunities"
                className="px-2 py-1 text-sm font-medium text-black rounded-md dark:text-gray-200 dark:hover:font-bold hover:font-bold"
              >
                Opportunities
              </Link>
              <Link
                href="/api/auth/logout"
                className="px-2 py-1 text-sm font-medium text-black rounded-md dark:text-gray-200 dark:hover:font-bold hover:font-bold"
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}
