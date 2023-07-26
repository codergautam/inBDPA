/* eslint-disable @next/next/no-img-element */
"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import Navbar from "@/components/navbar";
import ErrorComponent from "./ErrorComponent";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const searchParams = useSearchParams();
  const [loginerror, setLoginError] = useState(searchParams.get("error"));

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [btnText, setBtnText] = useState("Fill all Fields");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(3 - loginAttempts);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [submityesno, setSubmitYesNo] = useState(false);

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
      } else if (storedResetTime && new Date() >= new Date(storedResetTime)) {
        localStorage.removeItem("resetTime");
        setTimeRemaining("");
        setRemainingAttempts(3);
        setLoginAttempts(0);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingAttempts]);

  const areAllFieldsFilled = () => {
    return username !== "" && password !== "";
  };
  const areallfieldsfilled = areAllFieldsFilled();
  useEffect(() => {
    if (!areallfieldsfilled) {
      setBtnText("Fill all Fields");
    } else if (areallfieldsfilled && !submityesno) {
      setBtnText("Log in →");
    } else {
      return;
    }
  }, [username, password, areallfieldsfilled, error, submityesno]);

  const handleLogin = async (event) => {
    if (!areAllFieldsFilled()) {
      setError("Please fill out all fields.");
      setSubmitYesNo(false);
    } else if (areAllFieldsFilled()) {
      setSuccess("Logging in...");
      <ErrorComponent
      errorInComponent={success}
        side="bottom"
        color="green"
        blocked={false}
        setError={setSuccess}
      />;
      setSubmitYesNo(true);
    }
    event.preventDefault();
    setBtnText("Logging in...");

    try {
      setBtnText("Logging in...");
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

      const data = await response.json();

      if (data.error) {
        setBtnText("Log in");
        setSubmitYesNo(false);
        setLoginAttempts(loginAttempts + 1);
        setRemainingAttempts(3 - loginAttempts - 1);
        localStorage.setItem("loginAttempts", loginAttempts + 1);
        setError(data.error);
      } else {
        setBtnText("Logging in...");
        // Redirect to home page
        localStorage.removeItem("loginAttempts");

        window.location.href = "/";
      }
    } catch (error) {
      setSubmitYesNo(false);
      setBtnText("Log in");
      setError("An error occurred while logging in.");
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
    <section className="bg-gray-50 dark:bg-gray-900 h-screen">
      <div className="h-0 w-screen">
        <Navbar />
      </div>
      {loginerror && (
        <ErrorComponent
          errorInComponent={loginerror}
          side="top"
          color="red"
          blocked={false}
          setError={setLoginError}
        />
      )}
      {error && (
        <ErrorComponent
        errorInComponent={error}
          side="top"
          color="red"
          blocked={false}
          setError={setError}
        />
      )}
      <Head>
        <title>Login | inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        {/* <Link
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
            <img
              className="w-24 self-center hidden dark:inline"
              src="https://cdn.discordapp.com/attachments/1121115967120998540/1129463854536085557/168935544518199980.png"
              alt="BDPA logo"
            />
        </Link> */}
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Log in to your account
            </h1>
            {remainingAttempts === 0 && timeRemaining ? (
              <>
                <p className="text-gray-500 text-sm text-center my-4">
                  {remainingAttempts}{" "}
                  {remainingAttempts === 1 ? "attempt" : "attempts"} remaining.
                </p>
                <ErrorComponent
                errorInComponent={
                    <p className=" mb-1">
                      You are temporarily blocked.
                      <br /> Please try again after {timeRemaining}.<br />
                    </p>
                  }
                  side="bottom"
                  color="red"
                  blocked={true}
                  setError={setError}
                />
              </>
            ) : (
              <p className="text-gray-500 text-center text-sm my-4">
                {remainingAttempts}{" "}
                {remainingAttempts === 1 ? "attempt" : "attempts"} remaining.
              </p>
            )}
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email or username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                />
              </div>
              <div className="flex xs:flex-row items-center flex-col xs:justify-between">
                <div className="flex items-start mb-1 xs:mb-0">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="text-gray-500 dark:text-gray-300"
                      htmlFor="remember"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <Link
                  href="/auth/forgot"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </Link>
              </div>
              {areAllFieldsFilled() ? (
                <button
                  className="w-full text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
                  type="submit"
                  disabled={remainingAttempts === 0 || !areAllFieldsFilled()}
                >
                  <span className="flex justify-center items-center">
                    {btnText}
                  </span>
                </button>
              ) : (
                <button
                  className="cursor-not-allowed w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  type="button"
                  disabled={remainingAttempts === 0 || !areAllFieldsFilled()}
                >
                  <span className="flex justify-center items-center">
                    {btnText}
                  </span>
                </button>
              )}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="font-medium underline text-primary-600 dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
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