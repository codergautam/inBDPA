// pages/auth/reset/[linkId].js
// This file is responsible for handling the reset password functionality in the authentication process. It renders the reset password form and handles the password change request.
// 
// The code imports necessary modules and components needed for the functionality such as useState, useEffect, Head, useRouter, Link, Navbar, ErrorComponent, and redirect.
// 
// The ResetPassword function is the main component in this file. It takes two props as parameters: resetId and failError. The resetId is used to identify the reset link and the failError is used to display any error that occurs during the reset process.
// 
// Inside the ResetPassword component, there are several state variables defined using the useState hook. These variables keep track of the current password, confirm password, button text, error message, success message, and password strength.
// 
// There are two helper functions defined: areAllFieldsFilled and handleChangePassword. areAllFieldsFilled checks if both password and confirm password fields are filled. handleChangePassword is an asynchronous function that handles the password change request. It sends a POST request to the reset endpoint using the fetch API and updates the state variables accordingly based on the response.
// 
// There are also two useEffect hooks defined. The first useEffect hook updates the button text based on whether all fields are filled or not. The second useEffect hook updates the password strength based on the length of the password.
// 
// The return statement contains the JSX code that renders the reset password form. It includes input fields for password and confirm password, as well as conditional rendering based on the success and failure states.
// 
// The file also exports a getServerSideProps function that is responsible for fetching the reset link information from the server. It checks if the reset link exists and if it has expired or been used. It returns the resetId prop or an error message prop for rendering in the ResetPassword component.
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter, push } from "next/router";
import { getResetLink } from "@/utils/api";
import Link from "next/link";
import Navbar from "@/components/navbar";
import ErrorComponent from "pages/auth/ErrorComponent.js";
import { redirect } from "next/navigation";

export default function ResetPassword({ resetId, failError }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [btnText, setBtnText] = useState("Reset Password");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [passwordstrength, setPassStrength] = useState("");

  const { router } = useRouter();

  const areAllFieldsFilled = () => {
    return password !== "" && confirmPassword !== "";
  };
  const areallfieldsfilled = areAllFieldsFilled();
  useEffect(() => {
    if (!areallfieldsfilled) {
      setBtnText("Fill all Fields");
    } else {
      setBtnText("Reset Password");
    }
  }, [areallfieldsfilled]);
  useEffect(() => {
    {
      password.length === 0
        ? setPassStrength("Empty")
        : password.length < 11
        ? setPassStrength("Weak")
        : password.length < 17
        ? setPassStrength("Moderate")
        : setPassStrength("Strong");
    }
  }, [password]);

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setBtnText("Changing Password...");

    try {
      const response = await fetch("/api/auth/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetId,
          password,
          confirmPassword,
        }),
      });

      setBtnText("Change Password");
      const data = await response.json();

      if (data.error) {
        setSuccess(null);
        setError(data.error);
      } else {
        setError(null);
        setSuccess("Your password has been reset");
      }
    } catch (error) {
      setBtnText("Reset Password");
      setSuccess(null);
      setError("An error occurred while changing the password.");
    }
  };
  useEffect(() => {
    if (success !== null) {
      push('/auth/login?success="Your password has been reset"');
    }
  }, [success]);

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 h-screen">
        <Head>
          <title>Reset Password | inBDPA</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="h-0 w-screen">
          <Navbar />
        </div>
        {error && (
          <ErrorComponent
            error={error}
            side="bottom"
            color="red"
            blocked={false}
            setError={setError}
            attempterror={false}
          />
        )}
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            {failError ? (
              <div className="space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-6">
                  {failError ?? "Unexpected Error"}
                </h1>
                <Link href="/auth/login">
                  <button className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Return to login
                  </button>
                </Link>
              </div>
            ) : (
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Reset Your Password
                </h1>
                <form
                  className="space-y-1 lg:space-y-4"
                  onSubmit={handleChangePassword}
                >
                  {success ? (
                    <p></p>
                  ) : (
                    <>
                      <div>
                        <label
                          htmlFor="password"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Your password
                        </label>
                        {passwordstrength === "Weak" ? (
                          <>
                            <input
                              id="password"
                              value={password}
                              onChange={(event) =>
                                setPassword(event.target.value)
                              }
                              required=""
                              name="password"
                              type="password"
                              placeholder="••••••••"
                              className={`bg-gray-50 border border-red-400 text-black sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-red-600 placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500`}
                            />
                            <p className="text-sm text-red-500 text-right pt-1 pr-2">
                              Weak Password
                            </p>
                          </>
                        ) : passwordstrength === "Moderate" ? (
                          <>
                            <input
                              id="password"
                              value={password}
                              onChange={(event) =>
                                setPassword(event.target.value)
                              }
                              required=""
                              name="password"
                              type="password"
                              placeholder="••••••••"
                              className={`bg-gray-50 border border-yellow-400 text-black sm:text-sm rounded-lg focus:ring-yellow-600 focus:border-yellow-600 block w-full p-2.5 dark:bg-gray-700 dark:border-yellow-600 placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500`}
                            />
                            <p className="text-sm text-yellow-500 text-right pt-1 pr-2">
                              Moderate Password
                            </p>
                          </>
                        ) : passwordstrength === "Strong" ? (
                          <>
                            <input
                              id="password"
                              value={password}
                              onChange={(event) =>
                                setPassword(event.target.value)
                              }
                              required=""
                              name="password"
                              type="password"
                              placeholder="••••••••"
                              className={`bg-gray-50 border border-green-400 text-black sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-green-600 placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500`}
                            />
                            <p className="text-sm text-green-500 text-right pt-1 pr-2">
                              Strong Password
                            </p>
                          </>
                        ) : (
                          <>
                            <input
                              id="password"
                              value={password}
                              onChange={(event) =>
                                setPassword(event.target.value)
                              }
                              required=""
                              name="password"
                              type="password"
                              placeholder="••••••••"
                              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <p className="text-sm text-gray-200 dark:text-gray-600 text-right pt-1 pr-2">
                              Fill Password
                            </p>
                          </>
                        )}
                      </div>
                      <div>
                        <label
                          for="password"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Confirm password
                        </label>
                        {!confirmPassword ? (
                          <>
                            <input
                              id="confirmPassword"
                              required=""
                              type="password"
                              placeholder="••••••••"
                              value={confirmPassword}
                              onChange={(event) =>
                                setConfirmPassword(event.target.value)
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:font-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            />
                            <p className="text-sm text-gray-200 dark:text-gray-600 text-right pt-1 pr-2">
                              Fill Confirm Password
                            </p>
                          </>
                        ) : confirmPassword !== password ? (
                          <>
                            <input
                              id="confirmPassword"
                              value={confirmPassword}
                              onChange={(event) =>
                                setConfirmPassword(event.target.value)
                              }
                              required=""
                              name="password"
                              type="password"
                              placeholder="••••••••"
                              className={`bg-gray-50 border border-red-400 text-black sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-red-600 placeholder-gray-400 dark:text-white  dark:focus:ring-red-500 dark:focus:border-red-500`}
                            />
                            <p className="text-sm text-red-500 text-right pt-1 pr-2">
                              Passwords Don&apos;t Match
                            </p>
                          </>
                        ) : (
                          <>
                            <input
                              id="cofirmPassword"
                              value={confirmPassword}
                              onChange={(event) =>
                                setConfirmPassword(event.target.value)
                              }
                              required=""
                              type="password"
                              placeholder="••••••••"
                              className={`bg-gray-50 border border-green-400 text-black sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-green-600 placeholder-gray-400 dark:text-white  dark:focus:ring-green-500 dark:focus:border-green-500`}
                            />
                            <p className="text-sm text-green-500 text-right pt-1 pr-2">
                              Passwords Match
                            </p>
                          </>
                        )}
                      </div>

                      {!areAllFieldsFilled() ? (
                        <button
                          className="cursor-not-allowed w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                          type="submit"
                          disabled={!areAllFieldsFilled()}
                          onClick={() => setShowModal(true)}
                        >
                          <span className="flex justify-center items-center">
                            {btnText}
                          </span>
                        </button>
                      ) : (
                        <button
                          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                          type="submit"
                          disabled={!areAllFieldsFilled()}
                        >
                          <span className="flex justify-center items-center">
                            {btnText}
                          </span>
                        </button>
                      )}
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Remember password?{" "}
                        <Link
                          href="/auth/login"
                          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        >
                          Log in
                        </Link>
                      </p>
                    </>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const resetId = params.linkId;

  let resetLink = await getResetLink(resetId);
  if (!resetLink || resetLink.error) {
    return {
      props: {
        failError: resetLink.error ?? "Unexpected Error",
      },
    };
  }
  let oneHr = 1000 * 60 * 60;
  if (Date.now() - resetId.createdAt > oneHr) {
    return {
      props: {
        failError: "This link has expired",
      },
    };
  }
  if (resetLink.used) {
    return {
      props: {
        failError: "This link has been used",
      },
    };
  }

  return {
    props: {
      resetId,
    },
  };
}
