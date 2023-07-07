"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';


export default function Navbar({user}) {
  const [isOpen, setIsOpen] = useState(false);
  console.log("User:")
  console.log(user)

  return (

<div className={`flex-1 md:flex md:items-center md:justify-between ${isOpen ? '' : 'hidden'} md:flex`}>
<div className="flex flex-col -mx-4 md:flex-row md:items-center md:mx-8">
  {/* Existing code */}
</div>

<div className="flex items-center mt-4 md:mt-0">
  { user ? (
    <>
    {user.type == "administrator" ? <Link href={`/admin/${user.link}`} className="px-2 py-1 text-sm font-medium text-gray-700 rounded-md dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 md:mt-0">
      Admin
    </Link>: null}
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