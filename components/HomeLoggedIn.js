import React, { useEffect, useState } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { faGears, faNetworkWired, faSearch, faShare, faShareNodes, faSuitcase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import md5 from "blueimp-md5";
const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};
function msToTime(duration) {
  const portions = [];
    const msInDay = 1000 * 60 * 60 * 24;
  const days = Math.trunc(duration / msInDay);
  if (days > 0) {
    portions.push(days + 'd');
    duration = duration - (days * msInDay);
  }

  const msInHour = 1000 * 60 * 60;
  const hours = Math.trunc(duration / msInHour);
  if (hours > 0) {
    portions.push(hours + 'h');
    duration = duration - (hours * msInHour);
  }

  const msInMinute = 1000 * 60;
  const minutes = Math.trunc(duration / msInMinute);
  if (minutes > 0) {
    portions.push(minutes + 'm');
    duration = duration - (minutes * msInMinute);
  }

  const seconds = Math.trunc(duration / 1000);
  if (seconds > 0) {
    portions.push(seconds + 's');
  }

  return portions[0]
}
export default function LoggedInHome({ user }) {
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastItemId, setLastItemId] = useState(null);
  const [connectionLabel, setConnectionLabel] = useState("Connect")

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    // Fetch initial data when the component mounts
    fetchFeedData();
  }, []);

  const fetchFeedData = async (lastItem) => {
    setLoading(true);
    try {
      const response = await fetch("/api/feed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ last: lastItemId }),
      });
      const data = await response.json();
      setLastItemId(data.items[data.items.length-1]?.opportunity_id ?? data.items[data.items.length-1]?.user_id);
      setFeedData((prevData) => [...prevData, ...data.items]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feed data:", error);
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      // Load more data when the user is near the bottom of the page
      if (!loading) {
        fetchFeedData(lastItemId);
      }
    }
  };

  useEffect(() => {
    // Add the scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);
    return () => {
      // Clean up the scroll event listener when the component unmounts
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastItemId, loading]);

  return (
    <section className="text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 v-screen flex-grow">

      <div className="container px-5 pb-24 mx-auto">
      <center>
      <h1 className="text-5xl py-12">{getGreeting()}, {user.username}</h1>

        </center>
        <div className="lg:hidden mb-8">
          <aside className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-lg mb-8 mx-8">
            <h3 className="text-xl font-semibold mb-4">Your Profile</h3>
            <div className="flex items-center mb-4">
              <img
                src={user.pfp === "gravatar" ? `https://www.gravatar.com/avatar/${md5(user.email.trim().toLowerCase())}?d=identicon` : `/api/public/pfps/${user.pfp}`}
                alt={`${user.username} Profile`}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-semibold">{user.username}</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user.type}
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
            <h1 className="mb-2">Your Feed</h1>

            {feedData.map((item, index) => (
              <div
                key={index}
                className="rounded-lg shadow-lg bg-gray-200 dark:bg-gray-700 mb-8"
              >
                {item.type === "user" && (
                  <Link href={`/profile/${item.link}`} passHref>
                    <div className="p-6 flex rounded-lg flex-col items-start justify-start hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 ease-in-out">
                      <img src={item.pfp === "gravatar" ? `https://www.gravatar.com/avatar/${item.hashedEmail}?d=identicon` : `/api/public/pfps/${item.pfp}`} alt={item.username} className="w-10 h-10 rounded-full mr-4" />
                      <div>
                        <h2 className="text-lg font-semibold">{item.username}</h2>
                        {!item.isConnected ? (
                        <button
                    className="bg-blue-500 my-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={async (e) => {
                      console.log(`Inner: ${e.target.value}`)
                      e.preventDefault()
                      // Indicate that a connection/disconnection operation is happening
                      if (connectionLabel == "Connect")
                        setConnectionLabel("Connecting...");
                      else if (connectionLabel == "Disconnect")
                        setConnectionLabel("Disconnecting...");
                      else return;
                      console.log("User: ", item)
                      let data = await fetch("/api/toggleConnection", {
                        method: "POST",
                        body: JSON.stringify({
                          user_id: item.user_id,
                        }),
                      });
                      data = await data.json();
                      console.log("Data: ", data)
                      if (data.success) {
                        // setConnections(() => data.connections);
                        // setDepth(() => data.newDepth);
                        // Indicate that the operation is complete
                        setConnectionLabel(
                          data.connections[0]?.includes(user?.id)
                            ? "Disconnect"
                            : "Connect"
                        );
                      } else {
                        // If the operation fails, reset the button's label
                        setConnectionLabel(
                          connections[0]?.includes(user?.id)
                            ? "Disconnect"
                            : "Connect"
                        );
                      }
                    }}
                  >
                    {connectionLabel}
                  </button>
                        ): null}
                      <p className="text-gray-600 dark:text-gray-400 mb-2 mr-8 break-all text-clip w-full">{item.sections.about.length > 200 ? item.sections.about.substring(0,200)+"..." : item.sections.about}</p>
                      </div>
                      <div className="flex flex-row gap-2">
  <span className="inline-flex bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
    {`Joined ${msToTime(Date.now() - item.createdAt)} ago`}
  </span>
  <span className="inline-flex bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
    {`${item.views} views`}
  </span>
</div>
                    </div>
                  </Link>
                )}
                {item.type === "opportunity" && (
                  <Link href={`/opportunity/${item.opportunity_id}`} passHref>
                    <div className="p-6 flex flex-col items-start rounded justify-start hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 ease-in-out w-full break-words">
                      <h2 className="text-xl font-semibold mb-1 w-full break-words">{item.title.length > 50 ? item.title.substring(0,50)+"..." : item.title}</h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-2 mr-8 break-words w-full">{item.content.length > 200 ? item.content.substring(0,200)+"..." : item.content}</p>
                      <div className="flex flex-row gap-2">
  <span className="inline-flex bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
    {`Posted ${msToTime(Date.now() - item.createdAt)} ago`}
  </span>
  <span className="inline-flex bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
    {`${item.views} views`}
  </span>
</div>

                    </div>
                  </Link>
                )}
              </div>
            ))}
            {loading && <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
          </div>}
          </div>
          {/* Sidebar */}
         <aside className="lg:block lg:col-span-1 hidden fixed top-1/2 right-0 w-1/4 mr-9">
            {/* Add the 'fixed' class and set width to 'w-1/4' or any desired width for the sidebar */}
            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Your Profile</h3>
              <div className="flex items-center mb-4">
                <img
                  src={user.pfp === "gravatar" ? `https://www.gravatar.com/avatar/${md5(user.email.trim().toLowerCase())}?d=identicon` : `/api/public/pfps/${user.pfp}`}
                  alt={`${user.username} Profile`}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-lg font-semibold">{user.username}</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user.type}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{user.bio}</p>
              <Link href={`/profile/${user.link}`} className="text-blue-500">
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
