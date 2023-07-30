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
            ? "text-gray-700 text-xs semism:text-sm md:text-lg hover:text-gray-500"
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
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        className="border border-gray-200 p-4 bg-white dark:bg-gray-900 max-w-2xl mx-auto mt-12 h-4/5 overflow-y-auto w-1/4"
        onRequestClose={closeModal}
        ariaHideApp={false} // Added to prevent the warning about appElement not being defined
      >
        <h2 className="text-2xl font-bold mb-8">
          {totalConnections}
          {isYou ? "" : " mutual"} connections (1st to 3rd)
        </h2>
        {error ? <p className="text-red-500">{error}</p> : null}

        {userList
          ? userList.map((user, i) => (
              <>
                <div
                  className={
                    user.yourDepth == 1
                      ? `w-full flex items-center py-2 px-2`
                      : user.yourDepth == 2
                      ? `md:w-5/6 flex items-center py-2 px-2 ml-auto`
                      : `w-2/3 flex items-center py-2 px-2 ml-auto`
                  }
                  key={i}
                >
                  <svg
                    className={user.yourDepth == 1 ? `h-10 w-10 mr-2` : `h-6 w-6 mr-2`}
                    viewBox="0 0 24.00 24.00"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    transform="matrix(1, 0, 0, -1, 0, 0)rotate(90)"
                  >
                    <path
                      className={user.yourDepth == 1 ? `stroke-green-500 stroke-2` : `stroke-blue-600 stroke-2`}
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
                  </svg>
                  <span
                    onClick={() =>
                      (window.location.href = `/profile/${user.link}`)
                    }
                    className={user.yourDepth == 1 ? `text-white text-lg font-semibold flex flex-col items-center cursor-pointer rounded-lg bg-gray-100 dark:bg-blue-600 hover:bg-blue-700 p-4 mx-auto dark:shadow-2xl duration-300 ease-in-out transition w-full` :  `text-white hover:text-blue-600 font-semibold flex flex-col items-center cursor-pointer rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-700 p-3 mx-auto duration-300 ease-in-out transition w-full`}
                  >
                    <p>
                      {user.username}
                    </p>

                    {/* show connection depth, stored in user.yourDepth and user.theirDepth */}
                    {user.yourDepth ? (
                      <p className={user.yourDepth == 1 ? `text-gray-500 dark:text-blue-300 text-xs italic` : `text-gray-100 dark:text-gray-400 text-xs italic`}>
                        {user.yourDepth == 1
                          ? "1st"
                          : user.yourDepth == 2
                          ? "2nd"
                          : "3rd"}{" "}
                        degree
                      </p>
                    ) : null}
                    {user.theirDepth ? (
                      <p className="text-gray-500 dark:text-gray-300 text-xs">
                        {theirName}&apos;s{" "}
                        {user.theirDepth == 1
                          ? "1st"
                          : user.theirDepth == 2
                          ? "2nd"
                          : "3rd"}{" "}
                        degree
                      </p>
                    ) : null}
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

          <button
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg mt-4"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ConnectionList;
