import { useState } from 'react';

const AboutSection = ({ about, onSave, setRequestedUser, editable }) => {
  const [editing, setEditing] = useState(false);
  const [newAbout, setNewAbout] = useState(about);

  const handleEditClick = () => {
    setNewAbout(about);
    setEditing(true);
  };

  const handleSaveClick = () => {
    onSave(newAbout, setRequestedUser)
      .then((updatedAbout) => {
        setEditing(false);
        setNewAbout(updatedAbout);
      })
      .catch((error) => {
        // Handle the error if needed
      });
  };

  const handleCancelClick = () => {
    setEditing(false);
  };

  const handleChange = (event) => {
    setNewAbout(event.target.value);
  };

  return (
    <div className="w-full p-4 group mt-4 rounded-md border-2 border-gray-700 shadow-xl">
      <h2 className="text-xl font-semibold group-hover:text-white text-gray-700 mb-2 duration-300 ease-in-out transition">About</h2>
      {editing ? (
        <div>
          <textarea
            className="w-full h-20 p-2 mb-2 rounded-md resize-none dark:bg-black dark:text-white"
            value={newAbout}
            maxLength={1000}
            onChange={handleChange}
          />
          <div className="flex justify-end">
            <button
              className="px-4 py-2 mr-2 text-white bg-blue-500/50 hover:bg-blue-500/75 rounded-md duration-300 ease-in-out transition"
              onClick={handleSaveClick}
            >
              Save
            </button>
            <button
              className="px-4 py-2 text-white bg-gray-500/50 hover:bg-gray-500/75 rounded-md duration-300 ease-in-out transition"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {about ? (
            <p className="text-gray-900 dark:text-white mb-4">{about}</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 mb-4">Add an about section</p>
          )}
          {editable ? (
          <div className="flex justify-end">
            <button
              className="px-4 py-2 mx-auto text-gray-700 hover:text-white pb-2 border-b border-gray-700 hover:border-white duration-300 ease-in-out transition"
              onClick={handleEditClick}
            >
              Edit
            </button>
          </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AboutSection;
