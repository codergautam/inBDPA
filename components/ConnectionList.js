import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

const ConnectionList = ({ connections, clickable, user_id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadMoreVisible, setLoadMoreVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
      setUserList([]);
      setCurrentPage(1);
      setLoadMoreVisible(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch('/api/getMutualConnections', {
      method: 'POST',
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
          setUserList(prev=>[...prev, ...newUserList]);
          if (endIndex >= allUserList.length) {
            setLoadMoreVisible(false);
          }
        } else {
          setError(data.error);
        }
      }).catch(err=>{
        setLoading(false)
        setError(err.message)
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
      <h1 onClick={clickable ? openModal : null} className={`${clickable ? 'cursor-pointer' : ''} ${connections[1].length == 0 ? "text-gray-700 hover:text-gray-500" : "text-black dark:text-white hover:text-blue-500"} duration-300 ease-in-out transition`}>
        {connections[1].length} connections
      </h1>

      <Modal
        isOpen={isModalOpen}
        overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        className="border border-gray-200 p-4 bg-white dark:bg-gray-800 max-w-2xl mx-auto mt-12 h-4/5 overflow-y-auto"
        onRequestClose={closeModal}
        ariaHideApp={false} // Added to prevent the warning about appElement not being defined
      >
        <h2 className="text-2xl font-bold mb-4">Mutual Connections</h2>
        <p>Counted by both users 3rd connections</p>
        {error ? <p className="text-red-500">{error}</p> : null}

        {userList ? (
          userList.map((user, i) => (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg p-4 mb-4" key={i}>
              <span onClick={() => (window.location.href = `/profile/${user.link}`)} className="flex flex-row items-center cursor-pointer">
                <p className="text-blue-500 hover:text-blue-700">{user.username}</p>
              </span>
            </div>
          ))
        ) : null}
        {loading? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : null}

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
          Close Modal
        </button>
      </Modal>
    </div>
  );
};

export default ConnectionList;
