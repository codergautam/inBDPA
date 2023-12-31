// components/AboutSection.js
// This component is responsible for rendering and editing the "About" section of a user's profile. It allows the user to edit their bio and save the changes. The component also includes functionality for generating or improving the bio using AI. The user can click on the "Edit" button to enable editing mode, where they can type and modify their bio. When they click the "Save" button, the changes are saved and the editing mode is turned off. The component also includes a button for generating or improving the bio with AI. Clicking this button opens a modal where the user can enter a prompt for the AI, and upon submission, the AI generates a new bio or improves the existing one. The component displays the current bio of the user and provides an option to add an about section if one does not exist already. Only the user and authorized entities can edit the about section.
import axios from "axios";
import { useState } from "react";

const AboutSection = ({
  about,
  onSave,
  setRequestedUser,
  editable,
  otherSections,
  name,
}) => {
  const [editing, setEditing] = useState(false);
  const [newAbout, setNewAbout] = useState(about ?? "");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [suggesionsopen, setSuggestionsOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiError, setAiError] = useState(null);
  const [aiSubmitting, setAiSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleEditClick = () => {
    setNewAbout(about);
    setEditing(true);
  };

  const formatAbout = (content) => {
    if (!content) return "";
    // If there are multiple consectutive newlines, replace them with a single newline
    content = content.replace(/\n\n+/g, "\n\n");

    return content.replace(/\n/g, "\n");
  };


  const handleSaveClick = () => {
    setSaving(true);
    onSave(newAbout, setRequestedUser)
      .then((updatedAbout) => {
        setEditing(false);
        setSaving(false);
        setNewAbout(updatedAbout);
      })
      .catch((error) => {
        // Handle the error if needed
        setSaving(false);
      });
  };

  const handleCancelClick = () => {
    setSaving(false);
    setEditing(false);
  };

  const handleAiSubmit = async () => {
    if (aiSubmitting) return;

    const sections = ["education", "volunteering", "skills", "experience"];
    let dataText = "Username: " + name + "\n\n";
    sections.forEach((section) => {
      if (otherSections[section].length == 0) return;

      if (section == "skills") {
        dataText += "Skills: " + otherSections[section].join(", ");
      } else {
        dataText += section.charAt(0).toUpperCase() + section.slice(1) + ": \n";
        otherSections[section].forEach((item) => {
          dataText += "Title: " + item.title + "\n";
          dataText += "Description: " + item.description + "\n";
          dataText += "Start Date: " + item.startDate + "\n";
          dataText += "End Date: " + item.endDate + "\n";
          dataText += "Location: " + item.location + "\n\n";
        });
      }
      dataText += "\n\n\n";
    });

    if (about) dataText += "Current Bio: " + about;

    setAiSubmitting(true);
    setAiError(null);

    try {
      const res = await axios.post("/api/askAi", {
        contents: dataText,
        prompt: aiPrompt,
        bio: true,
      });
      setAiSubmitting(false);
      if (res.data.error) {
        console.error(res.data.error);
        setAiError("Unexpected Error");
        return;
      }
      setNewAbout(
        res.data.gptResponse.content.length > 1000
          ? res.data.gptResponse.content.substring(0, 1000)
          : res.data.gptResponse.content
      );

      setAiPrompt("");

      setAiModalOpen(false);
    } catch (error) {
      setAiSubmitting(false);
      setAiError(error.response?.data?.error ?? "Unexpected Error");
    }
  };

  const handleChange = (event) => {
    setNewAbout(event.target.value);
  };

  return (
    <div className="w-full p-4 group mt-4 rounded-md border-2 dark:bg-gray-800 border-gray-700 shadow-xl">
      <h2 className="text-base md:text-xl font-semibold text-black dark:text-white mb-2 duration-300 ease-in-out transition">
        About
      </h2>
      {editing ? (
        <div>
          <textarea
            className="w-full text-black text-xs md:text-base break-words h-20 p-2 mb-2 rounded-md resize-none dark:bg-black dark:text-white"
            value={newAbout}
            maxLength={1000}
            onChange={handleChange}
          />

          {aiModalOpen && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-75"></div>
                </div>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
                      id="modal-title"
                    >
                      {!newAbout || newAbout.length === 0
                        ? "Describe how you want your about section to be?"
                        : "How do you want to improve your about section?"}
                    </h3>
                    <div className="sm:flex sm:items-start">
                      {aiError ? (
                        <p className="text-red-500">{aiError}</p>
                      ) : null}

                      <input
                        type="text"
                        className="shadow appearance-none mt-2 border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        onClick={() => setSuggestionsOpen(!suggesionsopen)}
                        type="button"
                        className={`content-center mt-3 w-full inline-flex justify-center rounded-t-md ${
                          suggesionsopen && `border-b-0`
                        } border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm`}
                      >
                        <p className="place-self-center">Suggestions</p>
                        <svg
                          className="w-6 h-6 place-self-center fill-current dark:text-white text-black"
                          height="1000000"
                          viewBox="0 0 48 44"
                          width="1000000"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M14.83 16.42l9.17 9.17 9.17-9.17 2.83 2.83-12 12-12-12z" />
                          <path d="M0-.75h48v48h-48z" fill="none" />
                        </svg>
                      </button>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleAiSubmit}
                      >
                        <p className="place-self-center">
                          {!newAbout || newAbout.length === 0
                            ? aiSubmitting
                              ? "Generating... ✨"
                              : "Generate with AI 🌟"
                            : aiSubmitting
                            ? "Improving... ✨"
                            : "Improve with AI 🌟"}
                        </p>
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setAiModalOpen(false)}
                      >
                        <p className="place-self-center">Close</p>
                      </button>
                    </div>
                  </div>
                  {suggesionsopen && (
                    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse w-full mx-auto border-t border-gray-50 pt-4">
                      <ul className="w-fit font-black justify-self-center mx-auto space-y-2">
                        <li className="font-normal w-fit content-center mt-3 justify-center rounded-md shadow-sm px-3 py-1 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:text-sm">
                          Make my Bio sound Professional
                        </li>
                        <li className="font-normal w-fit content-center mt-3 justify-center rounded-md shadow-sm px-3 py-1 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:text-sm">
                          Cover all my fields in my Bio
                        </li>
                        <li className="font-normal w-fit content-center mt-3 justify-center rounded-md shadow-sm px-3 py-1 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:text-sm">
                          Create an attention-grabbing beginning{" "}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={() => setAiModalOpen(true)}
              className="
      px-4 py-2 mr-2 text-white bg-green-600 hover:bg-green-700 rounded-md duration-300 ease-in-out transition

      "
            >
              {!newAbout || newAbout.length === 0
                ? "Generate with AI"
                : "Improve with AI"}
            </button>
            <button
              className="px-4 py-2 mr-2 text-white bg-blue-600 hover:bg-blue-500 rounded-md duration-300 ease-in-out transition"
              onClick={handleSaveClick}
            >
              {saving ? "Saving.." : "Save"}
            </button>
            <button
              className="w-full justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {about ? (
            <p className="text-gray-900 text-xs md:text-base dark:text-white mb-4 break-words" style={{ whiteSpace: "pre-wrap" }}>
              {formatAbout(about).split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          ) : null}
          {editable ? (
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mx-auto text-gray-800 dark:text-gray-300 font-bold hover:text-black dark:hover:text-white pb-2 border-b border-gray-700  hover:-translate-y-1 dark:hover:translate-y-0 hover:border-black dark:hover:border-white duration-300 ease-in-out transition"
                onClick={handleEditClick}
              >
                {
                  about ? "Edit" : "Add"
                }
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default AboutSection;
