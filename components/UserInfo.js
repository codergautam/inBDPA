import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import _ from 'lodash';

const MAX_TITLE_LENGTH = 100;
const MAX_LOCATION_LENGTH = 30;
const MAX_DESCRIPTION_LENGTH = 250;

const MyComponent = ({ user, requestedUser, section, setRequestedUser }) => {
  const [editorItems, setEditorItems] = useState(requestedUser.sections[section]?.map((s) => {
    if (typeof s === 'string') return s;
    return {
      title: s.title,
      startedAt: new Date(s.startedAt),
      endedAt: s.endedAt ? new Date(s.endedAt) : null,
      location: s.location,
      description: s.description,
    };
  }) ?? []);
  const [liveItems, setLiveItems] = useState(requestedUser.sections[section]?.map((s) => {
    if (typeof s === 'string') return s;
    return {
      title: s.title,
      startedAt: new Date(s.startedAt),
      endedAt: s.endedAt ? new Date(s.endedAt) : null,
      location: s.location,
      description: s.description,
    };
  }) ?? []);
  const [mode, setMode] = useState('view');

  const editable = user?.id === requestedUser.user_id;

  useEffect(() => {
    // Update requestedUser.sections if the live items change
      const newSections = _.cloneDeep(liveItems);
      setRequestedUser((prev) => ({
        ...prev,
        sections: {
          ...prev.sections,
          [section]: newSections,
        },
      }));
  }, [liveItems]);


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
    setIsPresent(false)
    // Save changes to a database or perform any necessary actions
    let items2 = editorItems.map((item) => {
      if (typeof item === 'string') return item;

      return {
        title: item.title,
        startedAt: item.startedAt.getTime(),
        endedAt: item.endedAt?.getTime() ?? null, // If this is null, then it is ongoing
        location: item.location,
        description: item.description,
      };
    });
    items2 = items2.filter((item) => {
      if (typeof item === 'string' && item.trim().length == 0) return false;
      return true;
    });

    // Client side validation
    if (section !== 'skills') {
      for (const item of items2) {
        if (item.title.trim().length === 0) {
          alert('Please enter a title for each item.');
          return;
        }
        if (item.location.trim().length === 0) {
          alert('Please enter a location for each item.');
          return;
        }
        if (item.description.trim().length === 0) {
          alert('Please enter a description for each item.');
          return;
        }
        if (!item.startedAt || (item.startedAt > (item.endedAt ?? Date.now()))) {
          alert('Please enter a valid date range for each item.');
          return;
        }
      }
    }



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

    setLiveItems(_.cloneDeep(editorItems));
    setMode('view');
  };

  const [isPresent, setIsPresent] = useState(false)
  return (
    <div className="container mx-auto">
      <div className={`flex items-center justify-center mx-auto pb-5`}>
        <button
          className="text-gray-600 dark:text-gray-700 font-bold hover:text-black dark:hover:text-white border-b border-gray-700 hover:border-black hover:-translate-y-1 dark:hover:translate-y-0 dark:hover:border-white duration-300 ease-in-out"
          onClick={toggleMode}
          style={{ display: editable ? 'block' : 'none' }}
        >
          {liveItems.length > 0 ? 'Edit' : 'Add to this section'}
        </button>
      </div>

      {mode === 'view' ? (
        <div className="space-y-4">
          {section !== 'skills' ? (
            liveItems.map((item, index) => (
              <div className="w-3/4 rounded bg-gray-100 dark:bg-gray-700 p-4 mx-auto dark:shadow-xl hover:-translate-y-2 duration-300 ease-in-out transition" key={index}>
                <h2 className="text-sm md:text-lg font-bold mb-2 break-words">{item.title}</h2>
                <p className="text-gray-800 text-xs md:text-base dark:text-white mb-1 break-words">
                  {item.startedAt.toDateString()} - {(item.endedAt ? item.endedAt.toDateString() : "Present Day")}
                </p>
                <p className="text-gray-800 text-sm md:text-lg dark:text-white mb-1 break-words">{item.location}</p>
                <p className="text-gray-800 text-xs md:text-base dark:text-white break-words">{item.description}</p>
              </div>
            ))
          ) : (
            liveItems.map((item, index) => (
              <div className="w-3/4 mx-auto" key={index}>
                <h2 className="text-sm md:text-lg  font-bold break-words rounded bg-gray-100 dark:bg-gray-700 px-4 py-2 mx-auto dark:shadow-xl hover:-translate-y-2 duration-300 ease-in-out transition">{item}</h2>
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
          ariaHideApp={false} // Added to prevent the warning about appElement not being defined
        >
          <div className="overflow-auto" style={{ maxHeight: '80vh' }}>
            <div className="space-y-4">
              <h1 className="text-center text-2xl font-bold"> <span className='text-gray-700 font-normal'>Edit:</span> {section.charAt(0).toUpperCase() + section.slice(1, section.length)}</h1>
              {editorItems.map((item, index) => (
                <div className="w-3/4 rounded bg-gray-100 dark:bg-gray-700 p-4 mx-auto dark:shadow-xl hover:-translate-y-2 duration-300 ease-in-out transition" key={index}>
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
                        <div className='w-1/2'>
                          From:
                          <DatePicker
                            className="border mt-2 border-gray-300 bg-white dark:bg-gray-700 rounded px-2 py-1 w-1/2 text-black dark:text-white"
                            selected={item.startedAt}
                            placeholderText="Start Date"
                            onChange={(date) => updateItem(index, 'startedAt', date)}
                          />
                        </div>
                        <div className='w-1/2'>
                          To:
                          <div className="flex flex-col justify-start">
                          <div style={{ display: 'flex', alignItems: 'center' }}>
  <span style={{ marginRight: '8px' }}>Ongoing</span>
  <input
    onChange={e => {
      if (item.endedAt === null) {
        updateItem(index, 'endedAt', new Date());
      } else {
        updateItem(index, 'endedAt', null);
      }
    }}
    type="checkbox"
    className="peer mr-auto"
    checked={item.endedAt === null}
  />
</div>

                            <div className={item.endedAt === null ? 'hidden' : ''}>
                              <DatePicker
                                className={`border mt-2 border-gray-300 bg-white dark:bg-gray-700 rounded px-2 py-1 w-1/2 text-black dark:text-white`}
                                selected={item.endedAt}
                                placeholderText="End Date"
                                onChange={(date) => updateItem(index, 'endedAt', date)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <input
                        className="border border-gray-300  bg-white dark:bg-gray-700 rounded px-2 py-1 mb-2 w-full text-black dark:text-white"
                        placeholder="Location"
                        maxLength={MAX_LOCATION_LENGTH}
                        value={item.location}
                        onChange={(e) => updateItem(index, 'location', e.target.value)}
                      />
                      <textarea
                        className="border border-gray-300  bg-white dark:bg-gray-700 rounded px-2 py-1 mb-2 w-full text-black dark:text-white"
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
                    className="bg-red-500 hover:bg-red-600 dark:bg-red-800/50 dark:hover:bg-red-900/50 text-white font-bold py-2 px-4 rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                    onClick={() => deleteItem(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <div className="space-x-2 ml-4">
              {editorItems.length < 10 && (
                <button
                  className="bg-green-500 hover:bg-green-600 dark:bg-green-800/50 dark:hover:bg-green-900/50 text-white font-bold py-2 px-4 rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                  onClick={createItem}
                >
                  Add Item
                </button>
              )}
              <button
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-800/50 dark:hover:bg-blue-900/50 text-white font-bold py-2 px-4 rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                onClick={saveChanges}
              >
                Save
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 dark:bg-red-800/50 dark:hover:bg-red-900/50 text-white font-bold py-2 px-4 rounded transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                onClick={() => {
                  setEditorItems(_.cloneDeep(liveItems));
                  setMode('view');
                }}
              >
                Close
              </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyComponent;