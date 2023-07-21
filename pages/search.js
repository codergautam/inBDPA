import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";

export default function SearchPage({ user }) {
    // Placeholder data for search results
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({error: "Type a query!"});

    const handleInputChange = async (e) => {
      const value = e.target.value;
      setSearchQuery(value);

      // Send request to /api/search
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: value }),
      });

      // Get the data from the response
      const data = await res.json();
      // Update the search results state with the new data
      setSearchResults(data);
    };

    // Check if a user is logged in
    if (!user) {
        return (
          <div className="text-black bg-black flex flex-col min-h-screen">
      <Head>
        <title>inBDPA - Home</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar user={user} />


            <section className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 w-screen flex-grow">
                <div className="container px-5 py-24 mx-auto">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-12 text-center">
                        You need an account to search for users
                    </h1>
                    <div className="flex justify-center">
                        <Link href="/auth/signup" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Create an Account
                        </Link>
                    </div>
                </div>
            </section>
            </div>
        );
    }


    return (
      <div className="text-black bg-black flex flex-col min-h-screen">
      <Head>
        <title>inBDPA - Home</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar user={user} />
        <section className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 w-screen flex-grow">
            <div className="container px-5 py-24 mx-auto">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-12 text-center">
                    Search for Users
                </h1>

                {/* Search Bar */}
                <div className="relative text-gray-600 dark:text-gray-400 px-64 md:px-32 sm:px-0">
    <input
      type="search"
      name="search"
      placeholder="Search"
      value={searchQuery}
      onChange={handleInputChange}
      className="bg-gray-200 dark:bg-gray-700 h-16 px-5 pr-10 rounded-full text-sm focus:outline-none w-full"
    />
  </div>

                {/* Display Search Results */}
                <div className="mt-6 flex flex-col gap-8 items-center justify-center">
  {!searchResults.error ? searchResults.map((result, index) => {
    const match = result.match;
    let beforeMatch = '';
    let matched = '';
    let afterMatch = '';

    // Check if there's a match
    if (match && ['about', 'username'].includes(match.field)) {
      const field = match.field;
      const position = match.position;
      const fieldText = match.field === 'username' ? result.username : result.sections[field];

      // Break the fieldText into three parts
      beforeMatch = fieldText.substring(0, position);
      matched = fieldText.substring(position, position + searchQuery.length);
      afterMatch = fieldText.substring(position + searchQuery.length);
    }

    return (
      <div key={index} className="rounded-lg overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700 w-2/3 max-w-3xl mx-auto">
       <Link href={`/profile/${result.link}`}>
        <div className="p-6 flex flex-col items-center justify-center h-full">
          <h2 className="text-xl font-semibold mb-2">
            {match && match.field === "username" ? (
              <span>
                {beforeMatch}
                <span className="bg-yellow-300 dark:bg-yellow-500">
                  {matched}
                </span>
                {afterMatch}
              </span>
            ) : result.username}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {match && match.field === "about" ? (
              <span>
                {beforeMatch}
                <span className="bg-yellow-300 dark:bg-yellow-500">
                  {matched}
                </span>
                {afterMatch}
              </span>
            ) : result.sections.about}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Type: {result.type}<br />
            Views: {result.views}<br />
            <img src={result.pfp === "gravatar" ? result.gravatarUrl : "/api/public/pfps/"+result.pfp} alt="Profile picture" className="rounded-full w-24 h-24" />
          </p>
        </div>
        </Link>
      </div>
    );
  }) : (
    <div className="rounded-lg overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700 w-2/3 max-w-3xl mx-auto">
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <h2 className="text-xl font-semibold mb-2">{searchResults.error}</h2>
      </div>
    </div>
  )}
</div>


            </div>
        </section>
        </div>
    );
}

export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
  return {
    props: { user: req.session.user ?? null },
  };
}, ironOptions);
