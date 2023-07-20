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
      setBtnText("Sign Up →");
    } else {
      return;
    }
  }, [username, password, areallfieldsfilled, error, submityesno]);

  const handleLogin = async (event) => {
    if (!areAllFieldsFilled()) {
      setError("Please fill out all fields.");
      setSubmitYesNo(false);
    } else if (areAllFieldsFilled()) {
      <ErrorComponent
        error="Signing in..."
        side="bottom"
        color="green"
        blocked={false}
      />;
      setSubmitYesNo(true);
    }
    event.preventDefault();
    setBtnText("Signing in...");

    try {
      setBtnText("Signing in...");
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
        setBtnText("Signing in...");
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
    <section className="bg-gray-50 dark:bg-gray-900 h-screen">
      <div className="h-0 w-screen">
        <Navbar />
      </div>
      <ErrorComponent
        error={loginerror}
        side="top"
        color="red"
        blocked={false}
      />
      {error && (
        <ErrorComponent
          error={error}
          side="top"
          color="red"
          blocked={false}
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
                  side="bottom"
                  color="red"
                  blocked={true}
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
                  for="username"
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
                  for="password"
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
              {/* <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={remainingAttempts === 0}
              >
                <span className="flex justify-center items-center">
                Sign in →
                </span>
              </button> */}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
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
