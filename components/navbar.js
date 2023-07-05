"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow dark:bg-gray-800 w-full">
      <div className="container px-6 py-4 mx-auto">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-semibold text-gray-700 dark:text-white hover:text-gray-700">
              <Link href="/">
                inBDPA
              </Link>
            </div>

            <div className="flex md:hidden">
              <button type="button" className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400" aria-label="toggle menu" onClick={() => setIsOpen(!isOpen)}>
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div className={`flex-1 md:flex md:items-center md:justify-between ${isOpen ? '' : 'hidden'} md:flex`}>
            <div className="flex flex-col -mx-4 md:flex-row md:items-center md:mx-8">
              <Link href="/feature-a" className="px-2 py-1 mx-2 mt-2 text-sm font-medium text-gray-700 rounded-md dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 md:mt-0">
                Feature A
              </Link>
              <Link href="/feature-b" className="px-2 py-1 mx-2 mt-2 text-sm font-medium text-gray-700 rounded-md dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 md:mt-0">
Feature
              </Link>
              <Link href="/auth/login" className="px-2 py-1 mx-2 mt-2 text-sm font-medium text-gray-700 rounded-md dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 md:mt-0">
              Login
              </Link>
              <Link href="/auth/signup" className="px-2 py-1 mx-2 mt-2 text-sm font-medium text-gray-700 rounded-md dark:text-gray-200 dark:hover:bg-gray-700 hover:bg-gray-200 md:mt-0">
             Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
