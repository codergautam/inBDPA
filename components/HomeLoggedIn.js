import React, { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { faGears, faNetworkWired, faSearch, faShare, faShareNodes, faSuitcase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function LoggedInHome({ user }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  // Placeholder data for the feed
  const feedData = [
    {
      type: "profile",
      username: "JohnDoe",
      pfp: "https://example.com/johndoe.jpg",
      bio: "Passionate about technology and networking.",
      viewCount: 1500,
      mutualConnectionsCount: 30,
    },
    {
      type: "opportunity",
      title: "Frontend Developer Job",
      description: "We are looking for a skilled frontend developer to join our team.",
      createdTime: "2023-07-30T12:00:00Z",
      viewCount: 500,
    },
    // Add more profile and opportunity data here
  ];

  return (
    <section className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 v-screen flex-grow">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:hidden mb-8">
          <aside className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-lg mb-8 mx-8">
            <h3 className="text-xl font-semibold mb-4">Your Profile</h3>
            <div className="flex items-center mb-4">
              <img
                src={user.pfp}
                alt={`${user.username} Profile`}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-semibold">{user.username}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.mutualConnectionsCount} mutual connections
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{user.bio}</p>
            <Link href={`/profile/${user.username}`} className="text-blue-500">
              View Profile
            </Link>
          </aside>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center md:justify-center">
          {/* Scrolling Feed */}
          <div className="lg:col-span-2">
          <h1>Your Feed</h1>

            {feedData.map((item, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700 mb-8"
              >
                {item.type === "profile" && (
                  <Link href={`/profile/${item.username}`} className="p-6 flex flex-col items-start justify-start hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 ease-in-out">
                      <div className="flex items-center mb-4">
                        <img
                          src={item.pfp}
                          alt={`${item.username} Profile`}
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <div>
                          <h2 className="text-xl font-semibold mb-1">{item.username}</h2>
                          <p className="text-gray-600 dark:text-gray-400">
                            {item.mutualConnectionsCount} mutual connections
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{item.bio}</p>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        Connect
                      </button>
                  </Link>
                )}
                {item.type === "opportunity" && (
                  <Link href="/opportunity/[id]" as={`/opportunity/${item.id}`} className="p-6 flex flex-col items-start justify-start hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 ease-in-out">
                      <h2 className="text-xl font-semibold mb-1">{item.title}</h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                      <p className="text-gray-500 dark:text-gray-400">{`Posted ${item.createdTime}`}</p>
                  </Link>
                )}
              </div>
            ))}
          </div>
          {/* Sidebar */}
          <aside className="lg:block lg:col-span-1">
            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Your Profile</h3>
              <div className="flex items-center mb-4">
                <img
                  src={user.pfp}
                  alt={`${user.username} Profile`}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-lg font-semibold">{user.username}</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.mutualConnectionsCount} mutual connections
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{user.bio}</p>
              <Link href={`/profile/${user.username}`} className="text-blue-500">
                View Profile
              </Link>
            </div>
            {/* Add more links for other pages */}
          </aside>
        </div>
      </div>
    </section>
  );
}
