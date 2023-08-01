// components/LinkChanger.js
// This file contains a React component called "LinkChanger" that is responsible for allowing users to change their custom URL.
//
// The component receives a "link" prop which represents the current custom URL of the user.
//
// The component uses the useState hook to manage the state of several variables including "newLink" (which holds the new custom URL value), "changeLinkError" (which holds any error message that may occur during the URL change process), "isEditing" (a boolean flag to determine if the user is currently editing their custom URL), and "isSaving" (a boolean flag to indicate if the URL change is in progress).
//
// The component renders a button that allows the user to initiate the URL change process by setting the "isEditing" state to true.
//
// When the user is in editing mode, the component renders an input field where the user can enter the new custom URL, along with two buttons to save or cancel the changes.
//
// If an error occurs during the URL change process, the error message is displayed.
//
// When the user cancels the URL change, the component resets the state values to their original values.
import React, { useState } from "react";

const LinkChanger = ({ link }) => {
  const [newLink, setNewLink] = useState(link);
  const [changeLinkError, setChangeLinkError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChangeLink = async () => {
    try {
      setIsSaving(true);

      let response = await fetch("/api/changeLink", {
        method: "POST",
        body: JSON.stringify({ newLink }),
      });
      response = await response.json();

      if (response.success) {
        // Redirect to the new link
        window.location.href = `/profile/${response.newLink}`;
      } else {
        setChangeLinkError(response.error);
      }
    } catch (error) {
      console.log(error);
      setChangeLinkError("Error changing user link");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewLink(link);
    setChangeLinkError(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="space-y-2 flex flex-col">
      {!isEditing && (
        <button
          className="text-gray-300 text-xs sm:text-xl hover:text-black dark:hover:text-white font-bold py-2 px-4 border-gray-500 hover:-translate-y-1 dark:hover:translate-y-0 hover:border-black dark:hover:border-white border-b-2 pb-2 delay-75 duration-500 transition ease-in-out"
          onClick={handleEdit}
        >
          Change Custom URL
        </button>
      )}

      {isEditing && (
        <>
          {changeLinkError && <p className="text-red-500">{changeLinkError}</p>}

          <input
            type="text"
            placeholder="Enter new link"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 mt-2 dark:bg-black dark:text-white"
            maxLength={10}
          />
<div className="space-x-2">
          <button
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md duration-200 ease-in-out transition"
            onClick={handleChangeLink}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 rounded-md duration-200 ease-in-out transition"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </button></div>
        </>
      )}
    </div>
  );
};

export default LinkChanger;
