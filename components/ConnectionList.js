// components/ConnectionList.js
// This code is a React component called `ConnectionList`. It is used to display a list of connections and to handle the logic for fetching and displaying more connections.
//
// The component receives several props including `connections` (an array of connections), `clickable` (a boolean to indicate whether the connections are clickable), `user_id` (the user ID), `isYou` (a boolean to indicate if the user is the current user), and `theirName` (the name of the person whose connections are being displayed).
//
// The component initializes several state variables including `isModalOpen` (to track whether the modal is open), `userList` (an array to store the list of users), `error` (to store any error messages), `currentPage` (to track the current page of connections), `loadMoreVisible` (to indicate if the "Load More" button should be visible), `loading` (to indicate if the component is currently loading data), and `totalConnections` (to store the total number of connections).
//
// Inside the `useEffect` hook, the code fetches the list of mutual connections when the `isModalOpen` or `currentPage` changes. The fetched data is then used to update the `userList` and `totalConnections` state variables. If an error occurs, the `error` variable is set.
//
// The component includes functions like `openModal` (to open the modal), `closeModal` (to close the modal), and `loadMore` (to load more connections).
//
// The return statement contains the JSX for rendering the component. It includes elements like the connections count, a network graph modal, and a list of connections. The modal is conditionally rendered based on the `isModalOpen` variable. The list of connections is generated based on the `userList` state variable. Loading and error messages are also handled within the JSX.
//
// Overall, this component is responsible for fetching and displaying connections and providing functionality for interacting with the connections.
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import NetworkGraphModal from "./NetworkGraph";

const ConnectionList = ({
  connections,
  clickable,
  user_id,
  isYou,
  theirName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [totalConnections, setTotalConnections] = useState("...");

  useEffect(() => {
    if (!isModalOpen) {
      setUserList([]);
      setCurrentPage(1);
      setLoadMoreVisible(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/getMutualConnections", {
      method: "POST",
      body: JSON.stringify({
        user_id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          const allUserList = Object.values(data.connections);
          const startIndex = (currentPage - 1) * 5;
          const endIndex = startIndex + 5;
          const newUserList = allUserList.slice(startIndex, endIndex);

          setUserList((prev) => [...prev, ...newUserList]);
          setTotalConnections(allUserList.length);
          if (endIndex >= allUserList.length) {
            setLoadMoreVisible(false);
          }
        } else {
          setError(data.error);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message);
      });
  }, [isModalOpen, currentPage]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-4 mt-2 text-center mx-auto">
      <h1
        onClick={clickable ? openModal : null}
        className={`${clickable ? "cursor-pointer" : ""} ${
          connections[1].length == 0
            ? "text-black dark:text-gray-300 text-xs semism:text-sm md:text-lg dark:hover:text-gray-200"
            : "text-black dark:text-white hover:text-blue-500"
        } duration-300 ease-in-out transition`}
      >
        <span className="font-bold">{connections[1].length}</span> connections
      </h1>
      {isYou ? (
        <NetworkGraphModal data={connections[0]} user={user_id} />
      ) : null}

      <Modal
        isOpen={isModalOpen}
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 "
        className="border border-gray-200 p-4 bg-white dark:bg-gray-900 max-w-2xl mx-auto mt-12 h-4/5 w-full sm:w-3/4 md:w-1/2 lg:2/5 xl:w-1/4 overflow-y-scroll pb-3"
        onRequestClose={closeModal}
        ariaHideApp={false} // Added to prevent the warning about appElement not being defined
      >
        <button
          className="sticky w-full top-0 right-0 left-0 z-20"
          onClick={closeModal}
        >
          <svg
            className="fill-current text-red-500 hover:text-red-400 darkhover:text-red-400 w-7 h-7 p-1 stroke-2 ml-auto rounded-full bg-black"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                className="fill-current stroke-red-600"
                d="M7 17L16.8995 7.10051"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
              <path
                className="fill-current stroke-red-600"
                d="M7 7.00001L16.8995 16.8995"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
        </button>
        <h2 className="text-black dark:text-white text-2xl font-bold mb-8">
          {totalConnections}
          {isYou ? "" : " mutual"} connections
        </h2>
        {error ? <p className="text-red-500">{error}</p> : null}

        {userList
          ? userList.map((user, i) => (
              <>
                <div
                  className={
                    // user.yourDepth == 1
                    `w-full flex items-center py-2 px-2`
                    // : user.yourDepth == 2
                    // ? `md:w-5/6 flex items-center py-2 px-2 ml-auto`
                    // : `w-2/3 flex items-center py-2 px-2 ml-auto`
                  }
                  key={i}
                >
                  {/* <svg
                    className={
                      user.yourDepth == 1 ? `h-10 w-10 mr-2` : `h-6 w-6 mr-2`
                    }
                    viewBox="0 0 24.00 24.00"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    transform="matrix(1, 0, 0, -1, 0, 0)rotate(90)"
                  >
                    <path
                      className={
                        user.yourDepth == 1
                          ? `stroke-green-500 stroke-2`
                          : `stroke-blue-600 stroke-2`
                      }
                      d="M20 18L13.6 18C10.5072 18 8 15.4928 8 12.4L8 6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                    {user.yourDepth == 1 && (
                      <>
                        <path
                          className="stroke-green-500 stroke-2"
                          d="M8 5.3999L12 8.99988"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          className="stroke-green-500 stroke-2"
                          d="M8 5.3999L4 8.99988"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </>
                    )}
                  </svg> */}
                  <span
                    onClick={() =>
                      (window.location.href = `/profile/${user.link}`)
                    }
                    className={
                      user.yourDepth == 1
                        ? `h-fit overflow-visible relative flex items-center gap-6 text-white text-lg font-semibold cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 py-2 mx-auto dark:shadow-2xl duration-200 ease-in-out transition w-full my-2`
                        : user.yourDepth == 2
                        ? `h-fit overflow-visible relative flex items-center gap-6 text-black dark:text-white text-lg font-semibold cursor-pointer rounded-lg bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 mx-auto dark:shadow-2xl duration-200 ease-in-out transition w-full my-2`
                        : `h-fit overflow-visible relative flex items-center gap-6 text-black dark:text-white text-lg font-semibold cursor-pointer rounded-lg bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 py-2 mx-auto dark:shadow-2xl duration-200 ease-in-out transition w-full my-2`
                    }
                  >
                    {i % 2 === 0 && (
                      <img
                        src={
                          user.pfp === "gravatar"
                            ? user.gravatarUrl
                            : `/api/public/pfps/${user.pfp}`
                        }
                        className={`w-20 h-20 rounded-full mr-3 absolute -left-4`}
                      />
                    )}
                    <div
                      className={
                        user.yourDepth === 1
                          ? `mx-auto flex flex-col`
                          : `mx-auto flex flex-col`
                      }
                    >
                      <p
                        className={
                          user.yourDepth === 1
                            ? `text-md`
                            : user.yourDepth === 2
                            ? `text-md`
                            : `text-md`
                        }
                      >
                        {user.username}
                      </p>

                      {/* show connection depth, stored in user.yourDepth and user.theirDepth */}
                      {user.yourDepth ? (
                        <p
                          className={
                            user.yourDepth == 1
                              ? `text-gray-400 text-xs italic`
                              : `text-gray-800 dark:text-gray-400 text-xs italic`
                          }
                        >
                          {user.yourDepth == 1
                            ? "1st"
                            : user.yourDepth == 2
                            ? "2nd"
                            : "3rd"}{" "}
                          degree
                        </p>
                      ) : null}
                      {user.theirDepth ? (
                        <p className="text-gray-800 dark:text-gray-400 text-xs italic">
                          {theirName}&apos;s{" "}
                          {user.theirDepth == 1
                            ? "1st"
                            : user.theirDepth == 2
                            ? "2nd"
                            : "3rd"}{" "}degree
                        </p>
                      ) : null}
                    </div>
                    {!(i % 2 === 0) && (
                      <img
                        src={
                          user.pfp === "gravatar"
                            ? user.gravatarUrl
                            : `/api/public/pfps/${user.pfp}`
                        }
                        className={`w-20 h-20 rounded-full ml-3 absolute -right-4`}
                      />
                    )}
                  </span>
                </div>
              </>
            ))
          : null}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : null}
        <div className="flex gap-2">
          {loadMoreVisible && (
            <button
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg mt-4"
              onClick={loadMore}
            >
              Load More
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ConnectionList;
