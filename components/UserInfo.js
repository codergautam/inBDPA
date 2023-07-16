import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';

const MAX_TITLE_LENGTH = 100;
const MAX_LOCATION_LENGTH = 30;
const MAX_DESCRIPTION_LENGTH = 250;

const MyComponent = ({ user, requestedUser, section }) => {
  const [editorItems, setEditorItems] = useState(requestedUser.sections[section]?.map((s) => {
    if (typeof s === 'string') return s;
    return {
      title: s.title,
      startedAt: new Date(s.startedAt),
      endedAt: new Date(s.endedAt),
      location: s.location,
      description: s.description,
    };
  }) ?? []);
  const [liveItems, setLiveItems] = useState(requestedUser.sections[section]?.map((s) => {
    if (typeof s === 'string') return s;
    return {
      title: s.title,
      startedAt: new Date(s.startedAt),
      endedAt: new Date(s.endedAt),
      location: s.location,
      description: s.description,
    };
  }) ?? []);
  const [mode, setMode] = useState('view');

  const editable = user?.id === requestedUser.user_id;

  const toggleMode = () => {
    setMode(mode === 'view' ? 'edit' : 'view');
  };

  const createItem = () => {
    const newItem = section === 'skills' ? '' : {
      title: '',
      startedAt: new Date(),
      endedAt: new Date(),
      location: '',
      description: '',
    };
    setEditorItems([...editorItems, newItem]);
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...editorItems];

    if (field) {
      updatedItems[index][field] = value;
    } else {
      updatedItems[index] = value;
    }

    setEditorItems(updatedItems);
  };

  const deleteItem = (index) => {
    const updatedItems = [...editorItems];
    updatedItems.splice(index, 1);
    setEditorItems(updatedItems);
  };

  const saveChanges = () => {
    // Save changes to a database or perform any necessary actions
    // started and endedAt needs to be a Date.now utc timestamp
    let items2 = editorItems.map((item) => {
      if (typeof item === 'string') return item;
      return {
        title: item.title,
        startedAt: item.startedAt.getTime(),
        endedAt: item.endedAt.getTime(),
        location: item.location,
        description: item.description,
      };
    });
    items2 = items2.filter((item) => {
      if (typeof item === 'string' && item.trim().length == 0) return false;
      return true;
    });

    fetch('/api/updateUserSection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        section,
        content: items2,
      }),
    });

    setLiveItems(editorItems);
    setMode('view');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-center mx-auto p-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={toggleMode}
          style={{ display: editable ? 'block' : 'none' }}
        >
          {liveItems.length > 0 ? 'Edit' : 'Add this section'}
        </button>
      </div>

      {mode === 'view' ? (
        <div className="space-y-4">
          {section !== 'skills' ? (
            liveItems.map((item, index) => (
              <div className="border border-gray-200 p-4" key={index}>
                <h2 className="text-lg font-bold mb-2">{item.title}</h2>
                <p className="text-white mb-1">
                  {item.startedAt.toDateString()} - {item.endedAt.toDateString()}
                </p>
                <p className="text-white mb-1">{item.location}</p>
                <p className="text-white">{item.description}</p>
              </div>
            ))
          ) : (
            liveItems.map((item, index) => (
              <div className="border border-gray-200 p-4 break-words" key={index}>
                <h2 className="text-lg font-bold mb-2">{item}</h2>
              </div>
            ))
          )}
        </div>
      ) : (
        <Modal
          isOpen={mode !== 'view'}
          contentLabel="Example Modal"
          overlayClassName={`fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black bg-opacity-50 `}
          className={`border border-gray-200 p-4 ${mode === 'view' ? 'hidden' : ''} bg-white dark:bg-gray-800 max-w-2xl max-h-full mx-auto mt-12`}
        >
          <div className="overflow-auto" style={{ maxHeight: '80vh' }}>
            <div className="space-y-4">
              <h1 className="text-center text-2xl"> Edit: {section}</h1>
              {editorItems.map((item, index) => (
                <div className="border dark:border-gray-800 bg-white dark:bg-gray-800 p-4 shadow-lg rounded-md" key={index}>
                  {section !== 'skills' ? (
                    <>
                      <input
                        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 rounded px-2 py-1 mb-2 w-full text-black dark:text-white"
                        placeholder="Title"
                        maxLength={30}
                        value={item.title}
                        onChange={(e) => updateItem(index, 'title', e.target.value)}
                      />
                      <div className="flex space-x-2 mb-2">
                        <DatePicker
                          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 rounded px-2 py-1 w-1/2 text-black dark:text-white"
                          selected={item.startedAt}
                          placeholderText="Start Date"
                          onChange={(date) => updateItem(index, 'startedAt', date)}
                        />
                        <DatePicker
                          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 rounded px-2 py-1 w-1/2 text-black dark:text-white"
                          selected={item.endedAt}
                          placeholderText="End Date"
                          onChange={(date) => updateItem(index, 'endedAt', date)}
                        />
                      </div>
                      <input
                        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 rounded px-2 py-1 mb-2 w-full text-black dark:text-white"
                        placeholder="Location"
                        maxLength={MAX_LOCATION_LENGTH}
                        value={item.location}
                        onChange={(e) => updateItem(index, 'location', e.target.value)}
                      />
                      <textarea
                        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 rounded px-2 py-1 mb-2 w-full text-black dark:text-white"
                        placeholder="Description"
                        maxLength={MAX_DESCRIPTION_LENGTH}
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                      />
                    </>
                  ) : (
                    <input
                      className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 rounded px-2 py-1 mb-2 w-full text-black dark:text-white"
                      placeholder="Skill"
                      maxLength={MAX_TITLE_LENGTH}
                      value={item}
                      onChange={(e) => updateItem(index, undefined, e.target.value)}
                    />
                  )}
                  <button
                    className="bg-red-500 hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-900 text-white font-bold py-2 px-4 rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                    onClick={() => deleteItem(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
              {editorItems.length <= 10 && (
                <button
                  className="bg-green-500 hover:bg-green-700 dark:bg-green-800 dark:hover:bg-green-900 text-white font-bold py-2 px-4 rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                  onClick={createItem}
                >
                  Add Item
                </button>
              )}
              <button
                className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900 text-white font-bold py-2 px-4 rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                onClick={saveChanges}
              >
                Save
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-900 text-white font-bold py-2 px-4 rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                onClick={() => {
                  setEditorItems(liveItems);
                  setMode('view');
                }}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyComponent;