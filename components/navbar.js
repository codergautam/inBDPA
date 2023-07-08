"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';


export default function Navbar({user}) {
  const [isOpen, setIsOpen] = useState(false);
  console.log("User:")
  console.log(user)

  return (

    <div class="flex flex-row content-center justify-between self-center w-full h-1/6 bg-white border-b-2 border-black p-4 text-center">
  
    <div class="flex flex-row self-center text-5xl font-bold text-black cursor-pointer select-none">
    <div>in</div>
    <img class="w-10 h-10 self-center" src="https://bdpa.org/wp-content/uploads/2020/12/f0e60ae421144f918f032f455a2ac57a.png" alt="BDPA logo"/>
    <div>dpa</div>

</div>

<div className="flex items-center mt-4 md:mt-0 self-center">
  { user ? (
    <>
    {user.type == "administrator" ? <Link href={`/admin/${user.link}`} className="px-2 py-1 text-lg font-medium text-black rounded-md dark:text-gray-200 dark:hover:font-bold hover:font-bold md:mt-0">
      Admin
    </Link>: null}
  <Link href="http://localhost:3000" className="px-2 py-1 text-lg font-medium text-black rounded-md dark:text-gray-200 dark:hover:font-bold hover:font-bold md:mt-0">
    Home
  </Link>
  <Link href="opportunities" className="px-2 py-1 text-lg font-medium text-black rounded-md dark:text-gray-200 dark:hover:font-bold hover:font-bold md:mt-0">
    Opportunities
  </Link>
  <Link href="/api/auth/logout" className="px-2 py-1 text-lg font-medium text-black rounded-md dark:text-gray-200 dark:hover:font-bold hover:font-bold md:mt-0">
      Logout
    </Link>
    </>
  ) : (
    <>
  <Link href="/auth/login" className="px-2 py-1 text-lg font-medium text-black rounded-md dark:text-gray-200 dark:hover:font-bold hover:font-bold md:mt-0">
    Login
  </Link>
  <Link href="/auth/signup" className="px-2 py-1 text-lg font-medium text-black rounded-md dark:text-gray-200 dark:hover:font-bold hover:font-bold md:mt-0">
    Signup
  </Link>
  </>
  )}
</div>
</div>

);
}