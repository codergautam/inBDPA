// pages/auth/signup.js
// This script is responsible for handling the signup functionality of the application. It contains form inputs for the user to enter their name, email, and password. It also includes a captcha component to verify that the user is not a bot. The script checks if all required fields are filled and validates the input for each field. It also updates the button text based on the state of the form inputs and captcha. Once the form is submitted, it sends a POST request to the server to create a new user. If successful, it redirects the user to the home page. If there are any errors, it displays an error message.
"use client";
import Head from "next/head";
import Link from "next/link";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import Navbar from "@/components/navbar";
import ErrorComponent from "./ErrorComponent";
import { useEffect, useState } from "react";
import React from "react";
// const Captcha = dynamic(() => import('../captchatry2'), { ssr: false })
import Captcha from "@/components/Captcha";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [btnText, setBtnText] = useState("Fill all Fields");
  const [captchaSolved, setSolved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submityesno, setSubmitYesNo] = useState(false);
  const [passwordstrength, setPassStrength] = useState("");
  const [nameerror, setNameError] = useState("");
  const [emailerror, setEmailError] = useState("");

  // Function to check if all fields are filled
  const areAllFieldsFilled = () => {
    return name !== "" && email !== "" && password !== "";
  };
  const areallfieldsfilled = areAllFieldsFilled();
  useEffect(() => {
    {
      password.length === 0
        ? setPassStrength("Empty")
        : password.length < 11
        ? setPassStrength("Weak")
        : password.length < 18
        ? setPassStrength("Moderate")
        : setPassStrength("Strong");
    }
    {
      name.length === 0
        ? setNameError("Fill Username")
        : /[A-Z]/.test(name)
        ? setNameError("Must be lowercase")
        : name.length < 4
        ? setNameError("Must be over at least 4 characters")
        : name.length > 16
        ? setNameError("Cannot be greater than 16 characters")
        : !/^[a-zA-Z0-9_-]+$/.test(name)
        ? setNameError("Cannot have special characters")
        : setNameError("✓");
    }
    {
      email.length === 0
        ? setEmailError("Fill Email")
        : !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
          )
        ? setEmailError("Invalid email")
        : setEmailError("✓");
    }
    if (!areallfieldsfilled && !captchaSolved) {
      setBtnText("Fill all Fields");
    } else if (areallfieldsfilled && captchaSolved && !submityesno) {
      setBtnText("Sign up →");
    } else if (areallfieldsfilled && !captchaSolved) {
      setBtnText("Continue →");
    } else if (!areallfieldsfilled && captchaSolved) {
      setBtnText("Fill all Fields");
    }
  }, [
    name,
    email,
    password,
    areallfieldsfilled,
    captchaSolved,
    error,
    submityesno,
  ]);

  const submitForm = (event, fromCaptcha=false) => {
    if (!areAllFieldsFilled() && !captchaSolved) {
      setSuccess(null);
      setError("Please solve the captcha.");
      setSubmitYesNo(false);
    } else if (areAllFieldsFilled() && (captchaSolved || fromCaptcha)) {
      setError(null);
      <ErrorComponent
        error={"User Created"}
        side="bottom"
        color="green"
        blocked={false}
        setError={setSuccess}
        attempterror={false}
      />;
      setError(null);
      setSubmitYesNo(true);
    } else if (areAllFieldsFilled() && !captchaSolved) {
      setSuccess(null);
      <ErrorComponent
      error={"Please fill out all fields."}
      side="bottom"
      color="red"
      blocked={false}
      setError={setError}
      attempterror={false}
    />
      setSubmitYesNo(false);
    } else {
      setSuccess(null);
      setError("Please fill out all fields.");
      setSubmitYesNo(false);
    }
    if(event) event?.preventDefault();
    setBtnText("Signing up...");
    fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: name,
        email,
        password,
        rememberMe,
        changeUser: true,
      }),
      credentials: "include",
    })
      .then((response) => {
        response.json().then((data) => {
          if (data.error) {
            setSubmitYesNo(false);
            setSuccess(null);
            setError(data.error);
            return;
          }
          // Redirect to home page
          window.location.href = "/";
        });
      })
      .catch((error) => {
        setSubmitYesNo(false);
        setBtnText("Sign up");
        setSuccess(null);
        setError("An error occurred while signing up.");
      });
  }

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900 h-full">
                <div className=" z-40 fixed w-screen md:static md:h-0">
          <Navbar />
        </div>


        <Head>
          <title>Signup | inBDPA</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-full lg:py-0 z-10  min-h-screen">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8 md:pt-6">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <form
                className="space-y-1 "
                onSubmit={submitForm}
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required=""
                    placeholder="john"
                    name="name"
                    type="text"
                    className={
                      name === ""
                        ? `bg-gray-50 border border-gray-400 text-gray-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`
                        : nameerror !== "✓"
                        ? `bg-gray-50 border border-red-400 text-gray-500 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-red-600 placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500`
                        : `bg-gray-50 border border-green-400 text-gray-500 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-green-600 placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500`
                    }
                  />
                  {name === "" ? (
                    <p className="text-sm text-gray-200 dark:text-gray-600 text-right pt-1 pr-2">
                      {nameerror && nameerror}
                    </p>
                  ) : nameerror !== "✓" ? (
                    <p className="transform transition-all ease-in-out text-sm text-red-500 text-right pt-1 pr-2">
                      {nameerror && nameerror}
                    </p>
                  ) : (
                    <p className="text-sm text-green-500 text-right pt-1 pr-2">
                      {nameerror && nameerror}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required=""
                    placeholder="name@company.com"
                    name="email"
                    className={
                      name === ""
                        ? `bg-gray-50 border border-gray-400 text-gray-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`
                        : emailerror !== "✓"
                        ? `bg-gray-50 border border-red-400 text-gray-500 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-red-600 placeholder-gray-400 dark:text-white dark:focus:ring-red-600 dark:focus:border-red-500`
                        : `bg-gray-50 border border-green-400 text-gray-500 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-green-600 placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500`
                    }
                  />
                  {email === "" ? (
                    <p className="text-sm text-gray-200 dark:text-gray-600 text-right pt-1 pr-2">
                      {emailerror && emailerror}
                    </p>
                  ) : emailerror !== "✓" ? (
                    <p className="transform transition-all ease-in-out text-sm text-red-500 text-right pt-1 pr-2">
                      {emailerror && emailerror}
                    </p>
                  ) : (
                    <p className="text-sm text-green-500 text-right pt-1 pr-2">
                      {emailerror && emailerror}
                    </p>
                  )}
                </div>
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
                        onChange={(event) => setPassword(event.target.value)}
                        required=""
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className={`bg-gray-50 border border-red-400 text-black sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-red-600 placeholder-gray-400 dark:text-white  dark:focus:ring-red-500 dark:focus:border-red-500`}
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
                        onChange={(event) => setPassword(event.target.value)}
                        required=""
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className={`bg-gray-50 border border-yellow-400 text-black sm:text-sm rounded-lg focus:ring-yellow-600 focus:border-yellow-600 block w-full p-2.5 dark:bg-gray-700 dark:border-yellow-600 placeholder-gray-400 dark:text-white  dark:focus:ring-yellow-500 dark:focus:border-yellow-500`}
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
                        onChange={(event) => setPassword(event.target.value)}
                        required=""
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className={`bg-gray-50 border border-green-400 text-black sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-green-600 placeholder-gray-400 dark:text-white  dark:focus:ring-green-500 dark:focus:border-green-500`}
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
                        onChange={(event) => setPassword(event.target.value)}
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

                {/* <div className="mb-6">
<label
htmlFor="password"
className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
>
Confirm password
</label>
<input
required=""
placeholder=""
name="password"
type="password"
className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
defaultValue=""
/>
</div> */}
                <div className="flex items-center justify-between pb-3 ">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded accent-blue-600 bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        required=""
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        checked={rememberMe}
                        onChange={(event) =>
                          setRememberMe(event.target.checked)
                        }
                        className="text-gray-500 dark:text-gray-300"
                        htmlFor="remember"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                </div>

                {areAllFieldsFilled() && captchaSolved && (
                  <button
                    className="w-full text-white bg-green-400 hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    type="submit"
                    disabled={!areAllFieldsFilled()}
                  >
                    <span className="flex justify-center items-center">
                      {btnText}
                    </span>
                  </button>
                )}
                {!areAllFieldsFilled() && !captchaSolved && (
                  <button
                    className="cursor-not-allowed w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    type="button"
                    disabled={!areAllFieldsFilled()}
                    onClick={() => setShowModal(true)}
                  >
                    <span className="flex justify-center items-center">
                      {btnText}
                    </span>
                  </button>
                )}
                {areAllFieldsFilled() && !captchaSolved && (
                  <button
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    type="button"
                    disabled={!areAllFieldsFilled()}
                    onClick={() => setShowModal(true)}
                  >
                    <span className="flex justify-center items-center">
                      {btnText}
                    </span>
                  </button>
                )}
                {!areAllFieldsFilled() && captchaSolved && (
                  <button
                    className="cursor-not-allowed w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    type="submit"
                    disabled={!areAllFieldsFilled()}
                  >
                    <span className="flex justify-center items-center">
                      {btnText}
                    </span>
                  </button>
                )}

                <div className="text-sm font-light text-gray-500 dark:text-gray-400 pt-2">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium underline text-primary-600 dark:text-primary-500"
                  >
                    Log in
                  </Link>
                </div>
                {showModal && !captchaSolved && (
                  <>
                    <div className="justify-center items-center flex fixed inset-0 z-50 w-4/5 sm:w-1/2 md:w-2/5 xl:w-1/5 mx-auto">
                      <div className="h-fit bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 w-full">
                        <div className="p-8 w-full h-fit">
                          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white pb-7">
                            Captcha
                          </h1>
                          <div className="mx-auto rounded-2xl" id="captchadiv">
                            {captchaSolved ? (
                              <Captcha
                                setSolved={setSolved}
                                solvedyesno={true}
                                submitForm={submitForm}
                                setShowModal={setShowModal}
                              />
                            ) : (
                              <Captcha
                                setSolved={setSolved}
                                solvedyesno={false}
                                submitForm={submitForm}
                                setShowModal={setShowModal}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                  </>
                )}
                {captchaSolved && (
                  <ErrorComponent
                    error={"Captcha completed"}
                    side="bottom"
                    color="green"
                    blocked={false}
                    setError={setSuccess}
                    attempterror={false}
                  />
                )}
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
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
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
},
ironOptions);
