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
  const loginerror = searchParams.get("error");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [btnText, setBtnText] = useState("Log In");
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
      } else if(storedResetTime && new Date() >= new Date(storedResetTime)) {
        localStorage.removeItem("resetTime");
        setTimeRemaining("");
        setRemainingAttempts(3);
        setLoginAttempts(0);
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

      setBtnText("Log in");
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
    // <div className="flex flex-col items-center justify-center h-screen sm:min-h-screen bg-white dark:bg-black text-black dark:text-white">
    //   <Navbar />
    // <ErrorComponent error={loginerror} side="top" />
    // {error && <ErrorComponent error={error} side="bottom" />}
    //   <Head>
    //     <title>Login | inBDPA</title>
    //     <link rel="icon" href="/favicon.ico" />
    //   </Head>

    //   <main className="flex items-center justify-center w-screen h-full flex-1 px-0 sm:px-20 text-center">
    //     <div className="w-full h-full sm:h-min sm:max-w-md">
    //       <form
    //         className="bg-white h-full sm:h-min dark:bg-black sm:dark:bg-gray-900 rounded-lg shadow-xl px-8 pt-14 sm:pt-6 pb-8 mb-4"
    //         onSubmit={handleLogin}
    //       >
    //         <h1 className="text-3xl mb-6 text-center font-bold dark:text-gray-200">
    //           <span>Welcome to </span>
    //           <Link href="/">
    //             <img
    //               className="w-24 self-center dark:hidden inline"
    //               src="https://cdn.discordapp.com/attachments/1121115967120998540/1129195814447759410/Screenshot_2023-07-13_at_6.34.43_PM-PhotoRoom.png-PhotoRoom.png"
    //               alt="BDPA logo"
    //             />
    //           </Link>
    //           <Link href="/">
    //             <img
    //               className="w-24 self-center hidden dark:inline"
    //               src="https://cdn.discordapp.com/attachments/1121115967120998540/1129463854536085557/168935544518199980.png"
    //               alt="BDPA logo"
    //             />
    //           </Link>
    //         </h1>

    //         {remainingAttempts === 0 && timeRemaining ? (
    //           <>
    //             <p className="text-gray-500 text-sm my-4">
    //               {remainingAttempts}{" "}
    //               {remainingAttempts === 1 ? "attempt" : "attempts"} remaining.
    //             </p>
    //             <ErrorComponent
    //               error={
    //                 <p className=" mb-1">
    //                   You are temporarily blocked.
    //                   <br /> Please try again after {timeRemaining}.<br />
    //                 </p>
    //               }
    //             />
    //           </>
    //         ) : (
    //           <p className="text-gray-500 text-sm my-4">
    //             {remainingAttempts}{" "}
    //             {remainingAttempts === 1 ? "attempt" : "attempts"} remaining.
    //           </p>
    //         )}

    //         <div className="mb-4">
    //           <label
    //             className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
    //             htmlFor="username"
    //           >
    //             Username / Email
    //           </label>
    //           <input
    //             className="appearance-none rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    // id="username"
    // type="text"
    // placeholder="Username"
    // value={username}
    // onChange={(event) => setUsername(event.target.value)}
    //           />
    //         </div>
    //         <div className="mb-6">
    //           <label
    //             className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
    //             htmlFor="password"
    //           >
    //             Password
    //           </label>
    //           <input
    //             className="appearance-none rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
    //             id="password"
    //             type="password"
    //             placeholder="Password"
    //             value={password}
    //             onChange={(event) => setPassword(event.target.value)}
    //           />
    //         </div>
    //         <div className="mb-6">
    //           <label className="block text-gray-700 dark:text-gray-200 text-sm mb-2">
    //             <input
    //               className="mr-2 leading-tight"
    //               type="checkbox"
    //               checked={rememberMe}
    //               onChange={(event) => setRememberMe(event.target.checked)}
    //             />
    //             <span className="text-sm font-bold">Remember me</span>
    //           </label>
    //         </div>
    //         <div className="flex items-center justify-center">
    //           <button
    //             className="pr-6 pl-6 pt-2 pb-2 text-left border  rounded-xl bg-gray-300 hover:bg-gray-400 text-white focus:text-blue-600 dark:bg-gray-800 border-black dark:border-white text-xl "
    //             type="submit"
    //             disabled={remainingAttempts === 0}
    //           >
    //             {btnText}
    //           </button>
    //         </div>
    //         <p className="text-center text-gray-700 dark:text-gray-200 mt-5">
    //           Don&rsquo;t have an account yet?{" "}
    //           <Link
    //             href="/auth/signup"
    //             className="text-blue-600 dark:text-blue-400"
    //           >
    //             Sign up here
    //           </Link>
    //         </p>
    //         <p className="text-center text-gray-700 dark:text-gray-200 mt-5 text-sm">
    //           <Link
    //             href="/auth/forgot"
    //             className="text-blue-600 dark:text-blue-400"
    //           >
    //             Forgot Password?
    //           </Link>
    //         </p>
    //       </form>
    //     </div>
    //   </main>
    // </div>

    // {remainingAttempts === 0 && timeRemaining ? (
    //   <>
    //     <p className="text-gray-500 text-sm my-4">
    //       {remainingAttempts}{" "}
    //       {remainingAttempts === 1 ? "attempt" : "attempts"} remaining.
    //     </p>
    //     <ErrorComponent
    //       error={
    //         <p className=" mb-1">
    //           You are temporarily blocked.
    //           <br /> Please try again after {timeRemaining}.<br />
    //         </p>
    //       }
    //     />
    //   </>
    // ) : (
    //   <p className="text-gray-500 text-sm my-4">
    //     {remainingAttempts}{" "}
    //     {remainingAttempts === 1 ? "attempt" : "attempts"} remaining.
    //   </p>
    // )}
    <section class="bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <ErrorComponent error={loginerror} side="top" />
      {error && <ErrorComponent error={error} side="bottom" />}
      <Head>
        <title>Login | inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          href="/"
          class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Link href="/">
            <img
              className="w-24 self-center hidden dark:inline"
              src="https://cdn.discordapp.com/attachments/1121115967120998540/1129463854536085557/168935544518199980.png"
              alt="BDPA logo"
            />
          </Link>
        </Link>
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            {remainingAttempts === 0 && timeRemaining ? (
              <>
                <p className="text-gray-500 text-sm text-center my-4">
                  {remainingAttempts}{" "}
                  {remainingAttempts === 1 ? "attempt" : "attempts"} remaining.
                </p>
                <ErrorComponent
                  error={
                    <p className=" mb-1">
                      You are temporarily blocked.
                      <br /> Please try again after {timeRemaining}.<br />
                    </p>
                  }
                />
              </>
            ) : (
              <p className="text-gray-500 text-center text-sm my-4">
                {remainingAttempts}{" "}
                {remainingAttempts === 1 ? "attempt" : "attempts"} remaining.
              </p>
            )}
            <form class="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required=""
                />
              </div>
              <div>
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required=""
                />
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      class="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <Link
                  href="/auth/forgot"
                  class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={remainingAttempts === 0}
              >
                Sign in
              </button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/auth/signup"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
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
