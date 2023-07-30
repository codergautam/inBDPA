import React, { useState } from 'react';

const LinkChanger = ({ link }) => {
  const [newLink, setNewLink] = useState(link);
  const [changeLinkError, setChangeLinkError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChangeLink = async () => {
    try {
      setIsSaving(true);

      let response = await fetch('/api/changeLink', {
        method: 'POST',
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
      setChangeLinkError('Error changing user link');
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
    <div>
      {!isEditing && (
        <button className="text-gray-700 text-xs sm:text-xl hover:text-black dark:hover:text-white font-bold py-2 px-4 border-gray-700 hover:-translate-y-1 dark:hover:translate-y-0 hover:border-black dark:hover:border-white border-b-2 pb-2 delay-75 duration-500 transition ease-in-out" onClick={handleEdit}>
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

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
            onClick={handleChangeLink}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 ml-2"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default LinkChanger;
