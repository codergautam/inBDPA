// components/UserCreation.js
// This file contains the code for a component called "UserCreation".
//
// This component is used to create a new user by filling out a form.
//
// The component uses React's useState, useRef, and useEffect hooks to manage state and handle form submission.
//
// The component displays a form to collect information such as username, email, password, and user type.
//
// The form submission is handled by the handleSubmit function, which sends a POST request to the "/api/auth/signup" endpoint with the form data.
//
// If the user creation is successful, the component displays a success message and resets the form.
//
// If there is an error during user creation, the component displays an error message.
import { useState, useRef, useEffect } from "react";

export default function UserCreation() {
  let types = ["inner", "staff", "administrator"];
  const [type, setType] = useState(types[0]);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showingForm, setShowingForm] = useState(false);

  // Status
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);

  let timeout;

  const handleSubmit = async () => {
    setShowStatus(true);
    clearTimeout(timeout);
    setError(false);
    setStatus("...");

    let obj = {
      username,
      fullName,
      email,
      password,
      type: type == "admin" ? "administrator" : type,
      changeUser: false,
      fullName
    };

    let res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
      credentials: "include",
    }).then((res) => res.json());

    if (res.success) {
      setError(false);
      setStatus(`Successfully created new ${type} user.`);
        setShowingForm(false);
        setUsername("");
        setPassword("");
        setFullName("");
        setType(types[0]);
        setEmail("");
        setTimeout(() => {
            setShowStatus(false);
            setStatus("");
        }, 2000);
    } else {
      setStatus(`Error: ${res.error}`);
      setError(true);
    }
  };

  return (
    <div className="mt-8 mb-8 m-4 flex flex-col sm:w-4/5 lg:w-1/2 xl:w-1/2 mx-auto text-center bg-white dark:bg-gray-700 p-8 rounded-lg dark:border-none dark:shadow-xl">
      {showStatus && (
        <p className={`text-2xl font-bold mb-4 ${error ? "text-red-500" : "text-green-500"}`}>
          {status}
        </p>
      )}
      <center>
      <p
        onClick={() => setShowingForm(!showingForm)}
        className={`text-xl cursor-pointer text-white w-min min-w-max px-4 bg-blue-500 hover:bg-blue-600 mb-2 py-2  transition duration-300 ease-in-out dark:hover:bg-gray-800 dark:bg-gray-800 rounded-md font-bold ${showingForm ? "bg-red-500 hover:bg-red-600  dark:text-red-500" : ""}`}
      >
        {!showingForm ? "Create a new user" : "Close this form"}
      </p>
      </center>
      {showingForm && (
        <div className="flex flex-col items-center">
          <p className="text-2xl sm:text-3xl lg:text-4xl  text-black dark:text-green-600 font-bold mb-4">
            Create a New User
          </p>
          <div className="w-5/6">
            <label className="text-gray-500 dark:text-gray-300 text-xl mb-2 block text-left">Username:</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="bg-transparent text-black border-b-4 border-gray-500 dark:border-gray-300 px-4 py-2 focus:ring-none outline-none text-lg dark:text-white mb-4 w-full"
              type="text"
            />
            <label className="text-gray-500 dark:text-gray-300 text-xl mb-2 block text-left">Full Name:</label>
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              className="bg-transparent text-black border-b-4 border-gray-500 dark:border-gray-300 px-4 py-2 focus:ring-none outline-none text-lg dark:text-white mb-4 w-full"
              type="text"
            />
            <label className="text-gray-500 dark:text-gray-300 text-xl mb-2 block text-left">Email:</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent text-black border-b-4 border-gray-500 dark:border-gray-300 px-4 py-2 focus:ring-none outline-none text-lg dark:text-white mb-4 w-full"
              type="text"
            />
            <label className="text-gray-500 dark:text-gray-300 text-xl mb-2 block text-left">Password:</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent text-black border-b-4 border-gray-500 dark:border-gray-300 px-4 py-2 focus:ring-none outline-none text-lg dark:text-white mb-4 w-full"
              type="password"
            />
            <label className="text-gray-500 dark:text-gray-300 text-xl mb-2 block text-left">Type of User:</label>
            <select
              onChange={(e) => setType(e.target.value)}
              value={type}
              className="bg-gray-700 text-black border-b-4 border-gray-500 dark:border-gray-300 px-4 py-2 focus:ring-none outline-none text-lg dark:text-white mb-4 w-full"
              name="type"
            >
              {types.map((type, i) => (
                <option value={type} key={i}>
                  {type}
                </option>
              ))}
            </select>
            <button
              onClick={handleSubmit}
              className="bg-blue-400 dark:bg-green-500 cursor-pointer hover:scale-105 transition duration-300 ease-in-out w-full mt-2 rounded-lg text-white px-6 py-3 text-xl"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
