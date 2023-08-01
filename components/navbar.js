// components/navbar.js
// This code is for a navbar component in the inBDPA project. The navbar is used to navigate between different pages and perform actions such as searching and logging out. It is implemented using React and Next.js.
//
// The code uses the useState and useEffect hooks from React to manage the state of the navbar. It also imports the Link component from Next.js for navigation and the useRouter hook from Next.js for accessing the current route.
//
// The Navbar component takes two props, user and queryText. The user prop is used to check if the user is logged in and display different navigation options accordingly. The queryText prop is used to pre-populate the search input field with a query string.
//
// The code handles leaving impersonation, searching, and key presses. When the user clicks the "Leave Impersonation" button, the leaveImpersonation function is called, which makes an API request to the server to stop impersonating the user and redirects to the homepage. The handleSearch function is called when the user clicks the search button or presses enter in the search input field, which redirects to the search page with the query string as a parameter. The handleKeyPress function is called when a key is pressed in the search input field, and if the key is the enter key, the handleSearch function is called.
//
// The code renders the navbar with different navigation options based on the user's login status. If the user is logged in, it displays links to the homepage, opportunities page, logout page, and the user's profile page. If the user is not logged in, it displays links to the homepage, login page, and signup page.
//
// The code also renders a mobile version of the navbar when the screen size is small. The mobile navbar is hidden by default and can be toggled by clicking on a hamburger menu icon. It displays the same navigation options as the desktop navbar in a vertical layout.
//
// Overall, this code is responsible for rendering a responsive navbar with different navigation options based on the user's login status and handling actions such as leaving impersonation and searching.
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMask, faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Navbar({ user, queryText = "" }) {
  const [navhidden, setNavHidden] = useState(false);

  const router = useRouter();
  const [query, setQuery] = useState(queryText);
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
  const handleSearch = () => {
    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div className="flex md:flex-row items-center justify-between w-full bg-gray-50 dark:bg-gray-900 p-3 sm:py-4 md:p-4 lg:py-5 text-center">
        <div className="flex gap-2">
        <div className="md:flex-none flex flex-row justify-between md:justify-normal md:w-fit h-min items-center">

          <div className="w-fit">
            <Link href="/" className="w-fit">
              <Image
                className="w-24 sm:w-24 md:w-28 dark:hidden inline transition duration-300 transform hover:scale-110"
                src="/logos/light.png"
                alt="BDPA logo"
                width={80}
                height={27}
              />
            </Link>
            <Link href="/" className="w-fit">
              <Image
                className="w-24 sm:w-24 md:w-28 pt-0 hidden dark:inline transition duration-300 transform hover:scale-110"
                src="/logos/dark.png"
                alt="BDPA logo"
                width={80}
                height={27}
              />
            </Link>
          </div>

        </div>
        {/* Input bar */}
        <div className=" relative w-full md:w-72 lg:w-96 h-10 hidden md:flex">
            {user && (
              <>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Search for users, opportunities, etc."
                  className="w-full outline-none h-10 border-none px-3 py-2 pl-5 text-sm sm:text-md xl:text-lg font-medium text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-400 transition duration-300 ease-in-out rounded-full "
                />
                <div className="hidden top-0 left-0 ml-3 mt-3">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="text-gray-400 dark:text-white"
                  />
                </div>
                {/* ... Search Button ... */}
                <button
                  onClick={handleSearch}
                  className="absolute top-0 right-0 h-full px-4 py-2 text-gray-50 bg-blue-600 hover:bg-blue-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-400"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
                
              </>
              
            )}
        </div>
        </div>
        <div className="hidden md:flex items-end h-min flex-row rounded-b-lg bg-gray-50 dark:bg-gray-900 md:place place-items-center">
          {user && user.impersonating && (
            <>
              <button
                onClick={leaveImpersonation}
                className="border-1 px-2 py-1 text-md xl:text-lg font-bold fill-current text-emerald-500 dark:text-emerald-400 hover:text-black dark:hover:text-white transition duration-400 ease-in-out"
              >
                Leave Impersonation
                <FontAwesomeIcon
                  className="my-auto md:ml-0.5 lg:ml-1 w-5 h-5"
                  icon={faMask}
                />
              </button>
            </>
          )}
          {user && user.type === "administrator" && (
            <>
              <Link
                href={`/admin/${user.link}`}
                className="border-1 px-2 py-1 text-md xl:text-lg font-black text-green-400 dark:hover:text-white transition duration-400 ease-in-out hover:text-black"
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
        <div className="flex md:hidden">
          <FontAwesomeIcon onClick={()=>setNavHidden(!navhidden)} className="w-auto text-black dark:text-white h-44 md:hidden flex cursor-pointer" icon={faBars}></FontAwesomeIcon>
        </div>
        {/* <svg
            className="md:hidden h-min w-10 fill-current dark:text-white text-black"
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 50 50"
            onClick={() => setNavHidden(!navhidden)}
          >
            <path d="M 3 8 A 2.0002 2.0002 0 1 0 3 12 L 47 12 A 2.0002 2.0002 0 1 0 47 8 L 3 8 z M 3 23 A 2.0002 2.0002 0 1 0 3 27 L 47 27 A 2.0002 2.0002 0 1 0 47 23 L 3 23 z M 3 38 A 2.0002 2.0002 0 1 0 3 42 L 47 42 A 2.0002 2.0002 0 1 0 47 38 L 3 38 z"></path>
          </svg>{" "} */}
      </div>
      {/* <div
        className={
          navhidden
            ? "h-min flex flex-row items-center"
            : "h-min items-center hidden"
        }
      ></div> */}

      <div
        className={
          navhidden
            ? "items-center w-full flex flex-col gap-y-1 pr-3 pl-3 place-self-end pb-6 pt-6 rounded-b-lg bg-gray-50 dark:bg-gray-900 md:hidden mt-16 absolute z-20 border-t-0 right-0 top-0"
            : "hidden"
        }
      >
        {user && user.impersonating && (
          <>
            <button
              onClick={leaveImpersonation}
              className="border-1 px-2 py-1 text-md xl:text-lg font-bold fill-current text-emerald-500 dark:text-emerald-400 hover:text-black dark:hover:text-white transition duration-400 ease-in-out"
            >
              Leave Impersonation
              <FontAwesomeIcon
                className="my-auto md:ml-0.5 lg:ml-1 w-5 h-5"
                icon={faMask}
              />
            </button>
          </>
        )}
        {user && user.type === "administrator" && (
          <>
            <Link
              href={`/admin/${user.link}`}
              className="border-1 px-2 py-1 text-md xl:text-lg font-black text-green-400 dark:hover:text-white transition duration-400 ease-in-out hover:text-black"
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
              className="text-sm sm:text-md xl:text-lg font-medium text-blue-600 bg-gray-700 hover:text-black hover:bg-gray-300 dark:text-blue-600 dark:bg-gray-200 dark:hover:text-white dark:hover:bg-gray-600 transition duration-300 ease-in-out rounded-full px-4 py-2 md:ml-2 ml-0"
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
        <div className=" relative h-10 mt-2 w-1/2 md:flex">
            {user && (
              <>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Search for users, opportunities, etc."
                  className="w-full outline-none h-10 border-none px-3 py-2 pl-5 text-sm sm:text-md xl:text-lg font-medium text-gray-700 dark:text-white bg-gray-100 dark:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-400 transition duration-300 ease-in-out rounded-full "
                />
                <div className="hidden top-0 left-0 ml-3 mt-3">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="text-gray-400 dark:text-white"
                  />
                </div>
                {/* ... Search Button ... */}
                <button
                  onClick={handleSearch}
                  className="absolute top-0 right-0 h-full px-4 py-2 text-gray-50 bg-blue-600 hover:bg-blue-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-400"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
                
              </>
              
            )}
        </div>
      </div>
    </>
  );
}
