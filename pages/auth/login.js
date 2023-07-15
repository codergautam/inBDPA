import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import Navbar from "@/components/navbar";
import ErrorComponent from "./ErrorComponent";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [btnText, setBtnText] = useState("Sign In");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(3 - loginAttempts);
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    const storedLoginAttempts =
      parseInt(localStorage.getItem("loginAttempts")) || 0;
    const storedResetTime = localStorage.getItem("resetTime");

    if (storedLoginAttempts >= 3 && !storedResetTime) {
      setLoginAttempts(0);
      setRemainingAttempts(3);
      localStorage.setItem("loginAttempts", 0);
    } else if (storedResetTime && new Date() < new Date(storedResetTime)) {
      setRemainingAttempts(0);
      setTimeRemaining(formatTimeRemaining(new Date(storedResetTime)));
    } else {
      setLoginAttempts(storedLoginAttempts);
      setRemainingAttempts(3 - storedLoginAttempts);
    }
  }, []);

  useEffect(() => {
    if (remainingAttempts === 0 && !localStorage.getItem("resetTime")) {
      const resetDate = new Date();
      resetDate.setHours(resetDate.getHours() + 1);
      localStorage.setItem("resetTime", resetDate.toISOString());
    }

    const interval = setInterval(() => {
      const storedResetTime = localStorage.getItem("resetTime");
      if (storedResetTime && new Date() < new Date(storedResetTime)) {
        setTimeRemaining(formatTimeRemaining(new Date(storedResetTime)));
      } else {
        localStorage.removeItem("resetTime");
        setTimeRemaining("");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingAttempts]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setBtnText("Signing in...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          rememberMe,
        }),
        credentials: "include",
      });

      setBtnText("Sign In");
      const data = await response.json();

      if (data.error) {
        setLoginAttempts(loginAttempts + 1);
        setRemainingAttempts(3 - loginAttempts - 1);
        localStorage.setItem("loginAttempts", loginAttempts + 1);
        setError(data.error);
      } else {
        // Redirect to home page
        localStorage.removeItem("loginAttempts");

        window.location.href = "/";
      }
    } catch (error) {
      setBtnText("Sign In");
      setError("An error occurred while signing in.");
    }
  };

  const formatTimeRemaining = (resetTime) => {
    const now = new Date();
    const diffInSeconds = Math.floor((resetTime - now) / 1000);

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white py-2">
      {/* <div class="bg-red-100 border-t-4 border-red-500 rounded-b text-teal-900 px-4 py-3 shadow-md absolute inset-x-0 mx-auto w-3/4 top-0">
        <div class="flex w-fit mx-auto">
          <div class="py-1">
            <svg
              class="fill-current h-6 w-6 text-teal-500 mr-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
            </svg>
          </div>
          <span class="absolute right-0 px-4 py-3 ">
            <svg
              class="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
          <div>
            <p class="font-bold">Our privacy policy has changed</p>
            <p class="text-sm">
              Make sure you know how these changes affect you.
            </p>
          </div>
        </div>
      </div> */}
      {/* <div class="relative w-3/4 mx-auto top-0">
        <div class="bg-red-100 border-t-4 border-red-500 rounded-b text-teal-900 px-4 py-3 shadow-md absolute inset-x-0">
          <div class="flex items-center">
            <div class="py-1">
              <svg
                class="fill-current h-6 w-6 text-teal-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p class="font-bold">Our privacy policy has changed</p>
              <p class="text-sm">
                Make sure you know how these changes affect you.
              </p>
            </div>
          </div>
        </div> */}
      {/* </div> */}
      {error && <ErrorComponent error={error} />}
      <Head>
        <title>Login | inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full">
        <Navbar />
      </div>

      <main className="flex items-center justify-center w-full flex-1 px-20 text-center">
        <div className="w-full max-w-md">
          <form
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl px-8 pt-6 pb-8 mb-4"
            onSubmit={handleLogin}
          >
            <h1 className="text-3xl mb-6 text-center font-bold dark:text-gray-200">
              Welcome back to inBDPA
            </h1>

            {remainingAttempts === 0 && timeRemaining ? (
              <ErrorComponent error={
              <p className=" mb-1">
                You are temporarily blocked.
                <br /> Please try again after {timeRemaining}.<br />
              </p>
              } />
            ) : (
              <p className="text-gray-500 text-sm mb-4">
                {remainingAttempts}{" "}
                {remainingAttempts === 1 ? "attempt" : "attempts"} remaining.
              </p>
            )}

            <div className="mb-4">
              <label
                className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username / Email
              </label>
              <input
                className="appearance-none rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="appearance-none rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-200 text-sm mb-2">
                <input
                  className="mr-2 leading-tight"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span className="text-sm font-bold">Remember me</span>
              </label>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="pr-6 pl-6 pt-2 pb-2 text-left border  rounded-xl bg-gray-300 hover:bg-gray-400 text-white focus:text-blue-600 dark:bg-gray-800 border-black dark:border-white text-xl "
                type="submit"
                disabled={remainingAttempts === 0}
              >
                {btnText}
              </button>
            </div>
            <p className="text-center text-gray-700 dark:text-gray-200 mt-5">
              Don&rsquo;t have an account yet?{" "}
              <Link
                href="/auth/signup"
                className="text-blue-600 dark:text-blue-400"
              >
                Sign up here
              </Link>
            </p>
            <p className="text-center text-gray-700 dark:text-gray-200 mt-5 text-sm">
              <Link
                href="/auth/forgot"
                className="text-blue-600 dark:text-blue-400"
              >
                Forgot Password?
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
  if (req.session.user) {
    // redirect to home page
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  return {
    props: {},
  };
}, ironOptions);
