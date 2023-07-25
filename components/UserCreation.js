import { useState, useRef, useEffect } from "react";

export default function UserCreation() {
  let types = ["inner", "staff", "admin"];
  const [type, setType] = useState(types[0]);
  const [username, setUsername] = useState("");
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
      email,
      password,
      type: type == "admin" ? "administrator" : type,
      changeUser: false,
    };

    let res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
      credentials: "include",
    }).then((res) => res.json());

    console.log("Response from Form:");
    console.log(res);

    if (res.success) {
      setError(false);
      setStatus(`Successfully created new ${type} user.`);
        setShowingForm(false);
        setUsername("");
        setPassword("");
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
    <div className="mt-8 mb-8 flex flex-col w-1/2 mx-auto text-center bg-white dark:bg-gray-900 p-8 rounded-lg shadow-md">
      {showStatus && (
        <p className={`text-2xl font-bold mb-4 ${error ? "text-red-500" : "text-green-500"}`}>
          {status}
        </p>
      )}
      <p
        onClick={() => setShowingForm(!showingForm)}
        className={`text-xl cursor-pointer font-bold ${showingForm ? "text-red-500" : ""}`}
      >
        {!showingForm ? "Create a new user" : "Close this form"}
      </p>
      {showingForm && (
        <div className="flex flex-col items-center">
          <p className="text-4xl text-gray-700 dark:text-white font-bold mb-4">
            Create a New User
          </p>
          <div className="w-3/4">
            <label className="text-gray-500 dark:text-gray-300 text-xl mb-2 block text-left">Username:</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="bg-transparent border-b-4 border-gray-500 dark:border-gray-300 px-4 py-2 focus:ring-none outline-none text-lg dark:text-white mb-4 w-full"
              type="text"
            />
            <label className="text-gray-500 dark:text-gray-300 text-xl mb-2 block text-left">Email:</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent border-b-4 border-gray-500 dark:border-gray-300 px-4 py-2 focus:ring-none outline-none text-lg dark:text-white mb-4 w-full"
              type="text"
            />
            <label className="text-gray-500 dark:text-gray-300 text-xl mb-2 block text-left">Password:</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent border-b-4 border-gray-500 dark:border-gray-300 px-4 py-2 focus:ring-none outline-none text-lg dark:text-white mb-4 w-full"
              type="password"
            />
            <label className="text-gray-500 dark:text-gray-300 text-xl mb-2 block text-left">Type of User:</label>
            <select
              onChange={(e) => setType(e.target.value)}
              value={type}
              className="bg-transparent border-b-4 border-gray-500 dark:border-gray-300 px-4 py-2 focus:ring-none outline-none text-lg dark:text-white mb-4 w-full"
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
              className="bg-gray-500 dark:bg-blue-700 cursor-pointer hover:scale-105 transition duration-300 ease-in-out w-full mt-2 rounded text-white px-6 py-3 text-xl"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
