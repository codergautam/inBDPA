import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

const ConnectionList = ({ connections, clickable, user_id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(!isModalOpen) {
      setUserList([]);
      return;
    }
    fetch('/api/getMutualConnections', {
      method: 'POST',
      body: JSON.stringify({
        user_id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if(data.success) {
          setUserList(Object.values(data.connections));
        } else {
          setError(data.error);
        }
      });
  }, [isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <h1 onClick={clickable?openModal:null} className={`${clickable ? 'cursor-pointer' : ''}`}>{connections[1].length} connections</h1>

      <Modal isOpen={isModalOpen} overlayClassName={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50`} className={`border border-gray-200 p-4 bg-white dark:bg-gray-800 max-w-2xl mx-auto mt-12 h-4/5 overflow-y-auto`} onRequestClose={closeModal}>
        <h2>Mutual Connections</h2>
        {error ? <p className='text-red-500'>{error}</p> : null}
             {userList ? userList.map((user, i) => (
                <div className="flex flex-row justify-between" key={i}>
                 <span onClick={()=>window.location.href=`/profile/${user.link}`} className="flex flex-row items-center">
                    <p className="text-blue-500 hover:text-blue-700">{user.username}</p>
                  </span>
                  </div>
             )) : null}



        <button onClick={closeModal}>Close Modal</button>
      </Modal>
    </div>
  );
};

export default ConnectionList;
