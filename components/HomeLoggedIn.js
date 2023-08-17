// components/HomeLoggedIn.js
// This code is for the HomeLoggedIn component of the inBDPA project.
// The component displays the logged-in home page for users.
//
// The code initializes the AOS library for animating content on scroll.
//
// It imports necessary icon libraries for FontAwesomeIcon and defines a helper function to get the appropriate greeting based on the current time. Another helper function converts milliseconds to a formatted time string.
//
// Inside the component function, it sets up state variables and a useEffect hook to fetch initial feed data when the component mounts.
//
// The fetchFeedData function is defined to send a POST request to the /api/feed endpoint with the last item ID fetched. It updates the feedData state variable with the new data and sets loading to false.
//
// The handleScroll function is declared to check if the user has scrolled to the bottom of the page and calls fetchFeedData if loading is false.
//
// A useEffect hook is used to add a scroll event listener when the component mounts and removes it when the component unmounts.
//
// The component returns JSX elements to display the logged-in home page content. It uses the feedData state variable to render the user's feed.
//
// It uses a conditional rendering approach to display different elements based on the type of feed item (user or opportunity).
//
// The component also renders a sidebar for the user's profile.
//
// Lastly, the component includes a loading spinner when new feed data is being fetched.
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import md5 from "blueimp-md5";
import msToTime from "@/utils/msToTime";
import { useRouter } from "next/router";
import UserFeedCard from "./UserFeedCard";
import OpportunityFeedCard from "./OpportunityFeedCard";
import ReactModal from "react-modal";
import ArticlesForm from "./ArticleForm";
import dynamic from "next/dynamic";
import ArticleFeedCard from "./ArticleFeedCard";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
    </div>
  ),
});

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
export default function HomeLoggedIn({ user }) {
  const router = useRouter();
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastItemId, setLastItemId] = useState(null);
  const [connectionLabel, setConnectionLabel] = useState("Connect");

  // Article Creation
  const [creatingArticle, setCreatingArticle] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [keywords, setKeywords] = useState([]);

  const makeNewArticle = async () => {
    if (formSubmitting) return;

    if (!title || !value) {
      alert("Please fill out all fields!");
      return;
    }
    setFormSubmitting(true);

    let data = await fetch("/api/articles/createArticle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        contents: value,
        keywords: keywords,
      }),
    }).then((res) => res.json());
    setFormSubmitting(false);
    if (data.success) {
      setCreatingArticle(false);
      setValue("");
      setTitle("");
      setKeywords([]);
      router.push("/article/" + data.article.article_id);
    } else {
      alert(data.error ?? "Failed to create new article...");
    }
  };

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
      setLastItemId(
        data.items[data.items.length - 1]?.opportunity_id ??
          data.items[data.items.length - 1]?.user_id
      );
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
      <div className="pl-5 pb-24 mx-auto w-full">
        <center>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl pt-16 font-bold mb-12 text-gray-600 dark:text-gray-300 text-center pr-5">
            {getGreeting()}, {user.username}
          </h1>
        </center>
        <div className="lg:hidden mb-8">
          <aside className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg dark:shadow-lg mb-8 mx-8">
            <h3 className="text-xl font-semibold mb-4">Your Profile</h3>
            <div className="flex items-center mb-4">
              <img
                src={
                  user.pfp === "gravatar"
                    ? `https://www.gravatar.com/avatar/${md5(
                        user.email.trim().toLowerCase()
                      )}?d=identicon`
                    : `/api/public/pfps/${user.pfp}`
                }
                alt={`${user.username} Profile`}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <h2 className="text-lg font-semibold">{user.username}</h2>
                <p className="text-gray-600 dark:text-gray-400">{user.type}</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">{user.bio}</p>
            <Link href={`/profile/${user.username}`} className="text-blue-500">
              View Profile
            </Link>
          </aside>
        </div>

        <div className="lg:flex md:justify-center">
          {/* Scrolling Feed */}
          <div className="lg:w-3/4 mr-auto flex-grow">
            <h1 className="text-center">Your Feed</h1>
            <p className="mb-2 text-center">
              Shows new users, opportunities, and articles from your
              connections.
            </p>
            <div className="flex justify-center">
              <button
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md duration-200 ease-in-out transition mb-8"
                onClick={() => setCreatingArticle(true)}
              >
                Create Article
              </button>
            </div>
            <ReactModal
              isOpen={creatingArticle}
              contentLabel="Create Article"
              ariaHideApp={false}
            >
              <div className="bg-gray-800">
              <ArticlesForm
                user={user}
                editingArticles={false}
                handleFormSubmit={makeNewArticle}
                handleClose={() => setCreatingArticle(false)}
                setTitle={setTitle}
                setValue={setValue}
                value={value}
                title={title}
                keywords={keywords}
                setKeywords={setKeywords}
                submitting={formSubmitting}
              /></div>
            </ReactModal>

            <div className="flex flex-col space-y-8 pr-6 lg:pr-0">
              {feedData.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg dark:shadow-lg bg-gray-200 hover:-translate-y-1 dark:bg-gray-700 transition duration-300 ease-in-out"
                >
                  {item.type === "user" && <UserFeedCard item={item} />}
                  {item.type === "opportunity" && (
                    <OpportunityFeedCard item={item} />
                  )}
                  {item.type === "article" && <ArticleFeedCard item={item} />}
                </div>
              ))}
            </div>
            {loading && (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            )}
          </div>
          {/* Sidebar */}
          <div className="lg:w-1/4 lg:flex hidden justify-center h-screen">
            {/* Add the 'fixed' class and set width to 'w-1/4' or any desired width for the sidebar */}
            <div className="bg-gray-200 fixed pt-4 pb-8 dark:bg-gray-700 w-1/5 min-w-fit p-4 rounded-lg h-fit shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Your Profile</h3>
              <div className="flex items-center">
                <img
                  src={
                    user.pfp === "gravatar"
                      ? `https://www.gravatar.com/avatar/${md5(
                          user.email.trim().toLowerCase()
                        )}?d=identicon`
                      : `/api/public/pfps/${user.pfp}`
                  }
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
              {/* <div className="break-words">
                {JSON.stringify(user)}
              </div> */}
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {user.bio}
              </p>
              <div className="space-y-4">
                <Link
                  href={`/profile/${user.link}`}
                  className="block px-4 py-2 bg-blue-500 hover:bg-blue-700 dark:bg-gray-800 text-white rounded-lg dark:hover:bg-gray-900 transition-colors duration-200"
                >
                  View Profile
                </Link>
                <Link
                  href={`/opportunities`}
                  className="block px-4 py-2 bg-blue-500 hover:bg-blue-700 dark:bg-gray-800 text-white rounded-lg dark:hover:bg-gray-900 transition-colors duration-200"
                >
                  View Opportunities
                </Link>
                <Link
                  href={`/search`}
                  className="block px-4 py-2 bg-blue-500 hover:bg-blue-700 dark:bg-gray-800 text-white rounded-lg dark:hover:bg-gray-900 transition-colors duration-200"
                >
                  Search our Site
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
