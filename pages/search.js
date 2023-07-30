import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";

export default function SearchPage({ user, query="" }) {
  // Placeholder data for search results
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchResults, setSearchResults] = useState({ error: "Search for users and opportunities!" });
  const [ms, setMs] = useState(0);
  const [timeoutId, setTimeoutId] = useState();
  const [displayedUsers, setDisplayedUsers] = useState(3);
  const [displayedOpportunities, setDisplayedOpportunities] = useState(3);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e, fromPage=true) => {
    // Cancel the previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setLoading(true);

    let value;
    if(fromPage) {
     value = e.target.value;
    setSearchQuery(value);
    } else {
      value = searchQuery;
    }
    // Set a new timeout
    const newTimeoutId = setTimeout(async () => {
      const start = Date.now();

      // Send request to /api/search
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: value }),
      });
      setMs(Date.now() - start);

      // Get the data from the response
      const data = await res.json();
      // Update the search results state with the new data
      setSearchResults(data);
      setLoading(false);
    }, 300); // Adjust debounce delay as needed

    setTimeoutId(newTimeoutId);
  };

  useEffect(() => {
    handleInputChange(null, false)
  }, [])


  return (
    <div className="text-black bg-black flex flex-col min-h-screen">
      <Head>
        <title>inBDPA - Home</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar user={user} />
      <section className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-900 w-screen flex-grow">
        <div className="container px-5 py-24 mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-12 text-center">
            Search:
          </h1>

          {/* Search Bar */}
          <div className="relative text-gray-600 dark:text-gray-400 lg:px-64 md:px-32 sm:px-0">
            <input
              name="search"
              placeholder="Search for users, opporunities, etc."
              value={searchQuery}
              onChange={handleInputChange}
              className="bg-gray-200 dark:bg-gray-700 h-16 px-5 pr-10 rounded-full text-lg focus:outline-none w-full"
            />
          </div>

          {/* Display Search Results */}
          <div className="mt-6 flex flex-col gap-8 items-center justify-center">
          { loading ? (
              <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
            ) : null}

            {!searchResults.error && ms > 0 && (searchResults.users.length > 0 || searchResults.opportunities.length > 0) && (
              <p className="text-gray-600 dark:text-gray-400">
                Found {searchResults.users.length + searchResults.opportunities.length} result{searchResults.users.length + searchResults.opportunities.length > 1 ? 's' : ''} in {ms}ms
              </p>
            )}

  <div className="text-center m-2">
            {!searchResults.error && (
              <h1>Users</h1>
            )}

            {!searchResults.error && searchResults.users.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400">
                No users found
              </p>
            )}
            </div>

            {!searchResults.error ? searchResults.users.slice(0, displayedUsers).map((result, index) => {
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
                matched = fieldText.substring(position, position + searchResults.queryLength);
                afterMatch = fieldText.substring(position + searchResults.queryLength);

                // If the beforematch is too long, cut it off and add ...
                if (beforeMatch.length > 40) {
                  // cut it off right before the match
                  beforeMatch = beforeMatch.substring(beforeMatch.length - 40, beforeMatch.length);
                  // add ...
                  beforeMatch = '...' + beforeMatch;
                }
                // If the aftermatch is too long, cut it off and add ...
                if (afterMatch.length > 40) {
                  // cut it off right after the match
                  afterMatch = afterMatch.substring(0, 40);
                  // add ...
                  afterMatch = afterMatch + '...';
                }
              }

              return (
                <div key={index} className="flex flex-col md:flex-row text-center content-center rounded-lg overflow-hidden hover:bg-gray-300 dark:hover:bg-gray-600  bg-gray-200 dark:bg-gray-700  border-b-2 border-gray-300 dark:border-gray-800 w-2/3  md:text-base text-sm">
                    <img src={result.pfp === "gravatar" ? result.gravatarUrl : "/api/public/pfps/" + result.pfp} alt="Profile picture" className="flex-row self-center rounded-full my-2 ml-2 w-24 h-24" />
                  <Link href={`/profile/${result.link}`}>
                    <div className="p-6 flex md:flex-row items-center content-center h-full flex-col ml-1">
                      <h2 className="text-xl font-semibold mb-2">
                        {match && match.field === "username" ? (
                          <span>
                            {beforeMatch}
                            <span className="bg-yellow-300 dark:bg-yellow-500 dark:text-gray-900">
                              {matched}
                            </span>
                            {afterMatch}
                          </span>
                        ) : result.username.length > 80 ? result.username.substring(0, 80) + "..." : result.username}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 flex-col md:flex-row ml-2 mr-2">
                        {match && match.field === "about" ? (
                          <span>
                            {beforeMatch}
                            <span className="bg-yellow-300 dark:bg-yellow-500 dark:text-gray-900">
                              {matched}
                            </span>
                            {afterMatch}
                          </span>
                        ) : result?.sections?.about && result.sections.about.length > 80 ? result.sections.about.substring(0, 80) + "..." : result?.sections?.about}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Type: {result.type}<br />
                        Views: {result.views}<br />
                      </p>
                    </div>
                  </Link>
                </div>
              );
            }) : null}
            {!searchResults.error && searchResults.users.length > displayedUsers && (
              <div className="text-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-lg py-2 px-4 rounded w-full"
                onClick={() => setDisplayedUsers(displayedUsers + 3)}
              >
                Load More Users
              </button>
              </div>
             )}
          </div>


          {/* Display Search Results (opps) */}
          <div className="mt-6 flex flex-col gap-8 items-center justify-center">
          <div className="text-center m-2">
            {!searchResults.error && (
              <h1>Opportunities</h1>
            )}
            {!searchResults.error && searchResults.opportunities.length === 0 && (
              <p className="text-gray-600 dark:text-gray-400 rounded-xl">
                No opportunities found
              </p>
            )}
            </div>

            {!searchResults.error ? searchResults.opportunities.slice(0, displayedOpportunities).map((result, index) => {
              const match = result.match;
              let beforeMatch = '';
              let matched = '';
              let afterMatch = '';

              // Check if there's a match
              if (match && ['title', 'content'].includes(match.field)) {
                const position = match.position;
                const fieldText = match.field === 'title' ? result.title : result.content;

                // Break the fieldText into three parts
                beforeMatch = fieldText.substring(0, position);
                matched = fieldText.substring(position, position + searchResults.queryLength);
                afterMatch = fieldText.substring(position + searchResults.queryLength);

                // If the beforematch is too long, cut it off and add ...
                if (beforeMatch.length > 40) {
                  // cut it off right before the match
                  beforeMatch = beforeMatch.substring(beforeMatch.length - 40, beforeMatch.length);
                  // add ...
                  beforeMatch = '...' + beforeMatch;
                }
                // If the aftermatch is too long, cut it off and add ...
                if (afterMatch.length > 40) {
                  // cut it off right after the match
                  afterMatch = afterMatch.substring(0, 20);
                  // add ...
                  afterMatch = afterMatch + '...';
                }
              }
              return (
                <div key={index} className="flex flex-col md:flex-row text-center content-center rounded-lg overflow-hidden hover:bg-gray-300 dark:hover:bg-gray-600  bg-gray-200 dark:bg-gray-700  border-b-2 border-gray-300 dark:border-gray-800 w-2/3  md:text-base text-sm">
                  <Link href={`/opportunity/${result.opportunity_id}`}>
                  <div className="p-6 flex md:flex-row items-center content-center h-full flex-col ml-1">
                      <h2 className="text-xl font-semibold mb-2">
                        {match && match.field === "title" ? (
                          <span>
                            {beforeMatch}
                            <span className="bg-yellow-300 dark:bg-yellow-500 dark:text-gray-900 ">
                              {matched}
                            </span>
                            {afterMatch}
                          </span>
                        ) : result.title.length > 80 ? result.title.substring(0, 80) + "..." : result.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 flex-col md:flex-row mx-4">
                        {match && match.field === "content" ? (
                          <span>
                            {beforeMatch}
                            <span className="bg-yellow-300 dark:bg-yellow-500 dark:text-gray-900">
                              {matched}
                            </span>
                            {afterMatch}
                          </span>
                        ) : result.content.length > 80 ? result.content.substring(0, 60) + "..." : result.content}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Views: {result.views}<br />
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
            {!searchResults.error && searchResults.opportunities.length > displayedOpportunities && (
               <div className="text-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-lg py-2 px-4 rounded w-full"
                onClick={() => setDisplayedOpportunities(displayedOpportunities + 3)}
              >
                Load More Opportunities
              </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({ req, res, query }) {
    // Check if a user is logged in
    if (!req.session.user) {
      return {
        redirect: {
          destination: '/auth/login?error=You must have an account or be logged in to view this page.',
          permanent: false
        },
        props: {}
      };
    }
  return {
    props: { user: req.session.user ?? null, query: query.query ?? "" },
  };
}, ironOptions);
