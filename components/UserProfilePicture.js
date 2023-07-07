"use client";
import React, { useState } from 'react';

const UserProfilePicture = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <div className="flex justify-center items-center mb-4 cursor-pointer" onClick={() => setIsOpen(true)}>
        <img className="h-32 w-32 rounded-full" src="https://via.placeholder.com/150" alt="User Profile" />
      </div>

      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white dark:bg-gray-800 p-4 rounded-md" style={{ height: '80%' }}>
            <button
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-2 rounded-full"
              onClick={handleClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M13.414 10l4.293-4.293a1 1 0 0 0-1.414-1.414L12 8.586 7.707 4.293a1 1 0 0 0-1.414 1.414L10.586 10l-4.293 4.293a1 1 0 1 0 1.414 1.414L12 11.414l4.293 4.293a1 1 0 1 0 1.414-1.414L13.414 10z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <img className="w-full h-full object-contain mx-auto rounded-md" src="https://via.placeholder.com/150" alt="User Profile" />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePicture;
