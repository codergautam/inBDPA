"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGhost } from "@fortawesome/free-solid-svg-icons"

export default function Navbar({user}) {
  let router = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  console.log("User:")
  console.log(user)

  const leaveImpersonation = async () => {
    let data = await fetch("/api/admin/returnToAdmin").then(res => res.json());
    if(data.success) {
      router.push("/")
    } else {
      //TODO: Error
    }
  }

  return (
          <div className={`flex-1 md:flex md:items-center md:justify-between py-2 px-2 ${isOpen ? '' : 'hidden'} md:flex`}>
            <div className="flex flex-col -mx-4 md:flex-row md:items-center md:mx-8">
              {/* Existing code */}
            </div>

            <div className="flex items-center mt-4 md:mt-0">
              { user ? (
                <>
                {user.type == "administrator" ? <Link href={`/admin/${user.link}`} className="px-2 py-1 text-sm font-medium text-gray-700 rounded-md dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 md:mt-0">
                  Admin
                </Link>: null}
                {user.impersonating ? <button onClick={leaveImpersonation} className="px-2 w-min min-w-max group py-1 flex text-sm font-medium text-gray-700 rounded dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 md:mt-0">
                  Leave Impersonation <FontAwesomeIcon className="my-auto ml-2 text-gray-700 group-hover:text-white transition duration-300 ease-in-out w-5 h-5" icon={faGhost}></FontAwesomeIcon>
                </button>: null}
                <Link href="/api/auth/logout" className="px-2 py-1 text-sm font-medium text-gray-700 rounded-md dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 md:mt-0">
                  Logout
                </Link>
                </>
              ) : (
                <>
              <Link href="/auth/login" className="px-2 py-1 mt-2 text-sm font-medium text-gray-700 rounded-md dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 md:mt-0">
                Login
              </Link>
              <Link href="/auth/signup" className="px-2 py-1 mt-2 text-sm font-medium text-gray-700 rounded-md dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 md:mt-0">
                Signup
              </Link>
              </>
              )}
            </div>
          </div>

  );
}