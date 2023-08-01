// components/UserInfo.js
// This code is used to render a component called "UserInfo" that allows a user to view and edit information about themselves. It uses state variables to keep track of the user's information and the current mode (view or edit). It also includes functions for creating, updating, and deleting items in the user's information. The code includes client-side validation to ensure that the user enters valid information before saving the changes. The component also includes a modal for editing the information and handles the API request to update the user's profile.
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import _ from "lodash";

const MAX_TITLE_LENGTH = 100;
const MAX_LOCATION_LENGTH = 30;
const MAX_DESCRIPTION_LENGTH = 250;

const MyComponent = ({ user, requestedUser, section, setRequestedUser }) => {
  const [editorItems, setEditorItems] = useState(
    requestedUser.sections[section]?.map((s) => {
      if (typeof s === "string") return s;
      return {
        title: s.title,
        startedAt: new Date(s.startedAt),
        endedAt: s.endedAt ? new Date(s.endedAt) : null,
        location: s.location,
        description: s.description,
      };
    }) ?? []
  );
  const [liveItems, setLiveItems] = useState(
    requestedUser.sections[section]?.map((s) => {
      if (typeof s === "string") return s;
      return {
        title: s.title,
        startedAt: new Date(s.startedAt),
        endedAt: s.endedAt ? new Date(s.endedAt) : null,
        location: s.location,
        description: s.description,
      };
    }) ?? []
  );
  const [mode, setMode] = useState("view");

  const editable = user?.id === requestedUser.user_id;
  function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  }

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
    setMode(mode === "view" ? "edit" : "view");
  };

  const createItem = () => {
    const newItem =
      section === "skills"
        ? ""
        : {
            title: "",
            startedAt: new Date(),
            endedAt: new Date(),
            location: "",
            description: "",
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
    setIsPresent(false);
    // Save changes to a database or perform any necessary actions
    let items2 = editorItems.map((item) => {
      if (typeof item === "string") return item;

      return {
        title: item.title,
        startedAt: item.startedAt.getTime(),
        endedAt: item.endedAt?.getTime() ?? null, // If this is null, then it is ongoing
        location: item.location,
        description: item.description,
      };
    });
    // items2 = items2.filter((item) => {
    //   if (typeof item === 'string' && item.trim().length == 0) return false;
    //   return true;
    // });

    // Client side validation
    if (section !== "skills") {
      for (const item of items2) {
        if (item.title.trim().length === 0) {
          alert("Please enter a title for each item.");
          return;
        }
        if (item.location.trim().length === 0) {
          alert("Please enter a location for each item.");
          return;
        }
        if (item.description.trim().length === 0) {
          alert("Please enter a description for each item.");
          return;
        }
        if (
          !item.startedAt ||
          item.startedAt > (item.endedAt ?? Date.now()) ||
          item.startedAt > 9007199254740991 ||
          item.startedAt <= 1
        ) {
          alert("Please enter a valid start date for each item.");
          return;
        }
        if (
          (item.endedAt && item.endedAt > Date.now()) ||
          (item.endedAt &&
            (item.endedAt > 9007199254740991 || item.endedAt <= 1))
        ) {
          alert("Please enter a valid end date for each item.");
          return;
        }
      }
    } else {
      for (const item of items2) {
        if (item.trim().length === 0) {
          alert("Please fill out all the skills.");
          return;
        }
        // Make sure no spaces
        if (!item.match(/^[^\s]+$/)) {
          alert("Skills cannot contain spaces.");
          return;
        }
        // Make sure skill is alphanumeric (dashes and underscore allowed)
        if (!item.match(/^[a-zA-Z0-9-_]+$/)) {
          alert("Skills cannot contain special characters.");
          return;
        }
      }
    }

    fetch("/api/updateUserSection", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        section,
        content: items2,
      }),
    })
      .then((e) => e.json())
      .then((data) => {
        if (data.success) {
          setLiveItems(_.cloneDeep(editorItems));
          setMode("view");
        } else {
          alert(data.error ?? "Unexpected Error, please try again");
        }
      })
      .catch((e) => {
        alert("Unexpected Error when updating profile");
      });
  };

  const [isPresent, setIsPresent] = useState(false);
  return (
    <div className="container mx-auto">
      <div className={`flex items-center justify-center mx-auto pb-5`}>
        <button
          className="text-gray-600 dark:text-gray-500 font-bold hover:text-black dark:hover:text-white border-b border-gray-700 hover:border-black hover:-translate-y-1 dark:hover:translate-y-0 dark:hover:border-white duration-300 ease-in-out"
          onClick={() => {
            toggleMode();
            createItem();
          }}
          style={{ display: editable ? "block" : "none" }}
        >
          {liveItems.length > 0 ? "Edit" : "Add to this section"}
        </button>
      </div>

      {mode === "view" ? (
        <div className="space-y-4">
          {section !== "skills"
            ? liveItems.map((item, index) => (
                <div
                  className="w-3/4 rounded bg-gray-100 dark:bg-gray-800 p-4 mx-auto dark:shadow-xl hover:-translate-y-2 duration-300 ease-in-out transition"
                  key={index}
                >
                  <h2 className="text-sm text-black dark:text-white md:text-lg font-bold mb-2 break-words">
                    {item.title}
                  </h2>
                  <p className="text-gray-800 text-xs md:text-base dark:text-white mb-1 break-words">
                    {item.startedAt.toDateString()} -{" "}
                    {item.endedAt ? item.endedAt.toDateString() : "Present Day"}
                  </p>
                  <p className="text-gray-800 text-sm md:text-lg dark:text-white mb-1 break-words">
                    {item.location}
                  </p>
                  <p className="text-gray-800 text-xs md:text-base dark:text-white break-words">
                    {item.description}
                  </p>
                </div>
              ))
            : liveItems.map((item, index) => (
                <div className="w-3/4 mx-auto" key={index}>
                  <h2 className="text-sm md:text-lg text-black dark:text-white font-bold break-words rounded bg-gray-100 dark:bg-gray-800 px-4 py-2 mx-auto dark:shadow-xl hover:-translate-y-2 duration-300 ease-in-out transition">
                    {item}
                  </h2>
                </div>
              ))}
        </div>
      ) : (
        <Modal
          isOpen={mode !== "view"}
          contentLabel="Example Modal"
          overlayClassName={`fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black bg-opacity-50 `}
          className={`border border-gray-200 p-4 ${
            mode === "view" ? "hidden" : ""
          } bg-white dark:bg-gray-900 max-w-2xl max-h-full mx-auto mt-12`}
          ariaHideApp={false} // Added to prevent the warning about appElement not being defined
        >
          <button
            className="sticky w-full"
            onClick={() => {
              setEditorItems(_.cloneDeep(liveItems));
              setMode("view");
            }}
          >
            <svg
              className="fill-current text-red-500 hover:text-red-400 w-7 h-7 p-1 stroke-2 ml-auto rounded-full bg-white dark:bg-black"
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
                {" "}
                <path
                  className="fill-current stroke-red-600"
                  d="M7 17L16.8995 7.10051"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
                <path
                  className="fill-current stroke-red-600"
                  d="M7 7.00001L16.8995 16.8995"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </g>
            </svg>
          </button>
          <div className="overflow-auto" style={{ maxHeight: "80vh" }}>
            <div className="relative h-fit w-fit">
              <h1 className="text-center text-2xl font-bold pb-4">
                <span className="text-gray-700 dark:text-white font-normal">
                  {section.charAt(0).toUpperCase() +
                    section.slice(1, section.length)}
                </span>
              </h1>
              <div>{createItem}</div>
              {editorItems.map((item, index) => (
                <div
                  className="w-3/4 rounded bg-gray-100 dark:bg-gray-800 p-4 mx-auto dark:shadow-xl duration-300 ease-in-out transition mb-4"
                  key={index}
                >
                  {section !== "skills" ? (
                    <>
                      <input
                        className="border dark:border-gray-600 bg-white dark:bg-gray-800 rounded px-2 py-1 mb-2 w-full text-black dark:text-white"
                        placeholder="Title"
                        maxLength={100}
                        value={item.title}
                        onChange={(e) =>
                          updateItem(index, "title", e.target.value)
                        }
                      />
                      <div className="flex space-x-2">
                        <div className="w-1/2 flex flex-col text-black dark:text-white">
                          From:
                          <input
                            type="date"
                            className="w-fit border mt-2 border-gray-600 bg-white dark:bg-gray-800 rounded px-2 py-1 text-black dark:text-white"
                            value={
                              item.startedAt
                                ? item.startedAt.toISOString().substr(0, 10)
                                : ""
                            }
                            onChange={(event) =>
                              isValidDate(new Date(event.target.value)) &&
                              updateItem(
                                index,
                                "startedAt",
                                new Date(event.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="w-1/2 flex flex-col text-black dark:text-white">
                          To:
                          <div className="flex flex-col mx-auto w-fit items-center">
                            <div
                              className={
                                item.endedAt === null
                                  ? "mx-auto w-fit"
                                  : "mx-auto w-fit"
                              }
                            >
                              { item.endedAt !== null ? (
                              <input
                                type="date"
                                className="w-fit border mt-2 border-gray-600 bg-white dark:bg-gray-800 rounded px-2 py-1 text-black dark:text-white"
                                value={
                                  item.endedAt
                                    ? item.endedAt.toISOString().substr(0, 10)
                                    : ""
                                }
                                  onChange={(event) =>
                                    isValidDate(new Date(event.target.value)) &&
                                    updateItem(
                                      index,
                                      "endedAt",
                                      new Date(event.target.value)
                                    )
                                }
                              />
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="w-fit mx-auto my-2 mb-3">
                        <input
                          onChange={(e) => {
                            if (item.endedAt === null) {
                              updateItem(index, "endedAt", new Date());
                            } else {
                              updateItem(index, "endedAt", null);
                            }
                          }}
                          type="checkbox"
                          className="mr-1 accent-black"
                          checked={item.endedAt === null}
                        />
                        <span className="text-gray-600 dark:text-white">
                          Ongoing
                        </span>
                      </div>
                      <input
                        className="border border-gray-600 bg-white dark:bg-gray-800 rounded px-2 py-1 mb-2 w-full text-black dark:text-white"
                        placeholder="Location"
                        maxLength={MAX_LOCATION_LENGTH}
                        value={item.location}
                        onChange={(e) =>
                          updateItem(index, "location", e.target.value)
                        }
                      />
                      <textarea
                        className="border border-gray-600 bg-white dark:bg-gray-800 rounded px-2 py-1 mb-2 w-full text-black dark:text-white"
                        placeholder="Description"
                        maxLength={MAX_DESCRIPTION_LENGTH}
                        value={item.description}
                        style={{ resize: "none" }}
                        onChange={(e) =>
                          updateItem(index, "description", e.target.value)
                        }
                      />
                    </>
                  ) : (
                    <input
                      className="border border-gray-600 dark:border-gray-500 bg-white dark:bg-gray-700 rounded px-2 py-1 mb-2 w-full text-black dark:text-white"
                      placeholder="Skill"
                      maxLength={30}
                      value={item}
                      onChange={(e) =>
                        updateItem(index, undefined, e.target.value)
                      }
                    />
                  )}
                  <button
                    className="text-white py-2 px-4 rounded mx-auto cursor-pointer hover:bg-red-700 bg-red-600 duration-200 transition"
                    onClick={() => deleteItem(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
              {editorItems.length >= 10 && (
                <p className="text-rose-400 dark:text-red-500 font-bold dark:font-normal mb-2 ml-4">
                  You cannot add more than 10 items here.
                </p>
              )}
              <div className="space-x-2 mx-auto w-fit h-fit">
                {editorItems.length < 10 && (
                  <button
                    className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 rounded-md transition"
                    onClick={createItem}
                  >
                    Add Item
                  </button>
                )}
                <button
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md duration-200 ease-in-out transition"
                  onClick={saveChanges}
                >
                  Save
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
