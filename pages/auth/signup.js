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
  const [btnText, setBtnText] = useState("Fill all Fields");
  const [captchaSolved, setSolved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submityesno, setSubmitYesNo] = useState(false);
  const [passwordstrength, setPassStrength] = useState("");

  // Function to check if all fields are filled
  const areAllFieldsFilled = () => {
    return name !== "" && email !== "" && password !== "";
  };
  const areallfieldsfilled = areAllFieldsFilled();
  useEffect(() => {
    {
      password.length === 0
        ? setPassStrength("Empty")
        : password.length < 10
        ? setPassStrength("Weak")
        : password.length < 17
        ? setPassStrength("Moderate")
        : setPassStrength("Strong");
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

  return (
    <>
      <section class="bg-gray-50 dark:bg-gray-900 h-screen">
        <div className="h-0 w-screen">
          <Navbar />
        </div>

        <Head>
          <title>Signup | inBDPA</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={(event) => {
                  if (!areAllFieldsFilled() && !captchaSolved) {
                    setError("Please solve the captcha.");
                    setSubmitYesNo(false);
                  } else if (areAllFieldsFilled() && captchaSolved) {
                    <ErrorComponent
                      error="User created"
                      side="bottom"
                      color="green"
                      blocked={false}
                    />;
                    setSubmitYesNo(true);
                  } else if (areAllFieldsFilled() && !captchaSolved) {
                    setError("Please fill out all fields.");
                    setSubmitYesNo(false);
                  } else {
                    setError("Please fill out all fields.");
                    setSubmitYesNo(false);
                  }
                  event.preventDefault();
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
                      setError("An error occurred while signing up.");
                    });
                }}
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
                    // onChange={(event) => {

                    //   realbtnText()
                    // }}
                    onChange={(event) => setName(event.target.value)}
                    required=""
                    placeholder="john"
                    name="name"
                    type="text"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                    defaultValue=""
                  />
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    defaultValue=""
                  />
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
                        className={`bg-gray-50 border border-red-300 text-red-900 sm:text-sm rounded-lg focus:ring-red-600 focus:border-red-600 block w-full p-2.5 dark:bg-gray-700 dark:border-red-600 placeholder-gray-400 dark:text-red-500 dark:focus:ring-red-500 dark:focus:border-red-500`}
                        defaultValue=""
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
                        className={`bg-gray-50 border border-yellow-300 text-yellow-900 sm:text-sm rounded-lg focus:ring-yellow-600 focus:border-yellow-600 block w-full p-2.5 dark:bg-gray-700 dark:border-yellow-600 placeholder-gray-400 dark:text-yellow-500 dark:focus:ring-yellow-500 dark:focus:border-yellow-500`}
                        defaultValue=""
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
                        className={`bg-gray-50 border border-green-300 text-green-900 sm:text-sm rounded-lg focus:ring-green-600 focus:border-green-600 block w-full p-2.5 dark:bg-gray-700 dark:border-green-600 placeholder-gray-400 dark:text-green-500 dark:focus:ring-green-500 dark:focus:border-green-500`}
                        defaultValue=""
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
                        defaultValue=""
                      />
                      <p className="text-sm text-white dark:text-gray-800 text-right pt-1 pr-2">
                         password strength
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
                        onChange={(event) =>
                          setRememberMe(event.target.checked)
                        }
                        class="text-gray-500 dark:text-gray-300"
                        for="remember"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                </div>

                {areAllFieldsFilled() && captchaSolved && (
                  <button
                    className="w-full text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800"
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

                <div className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    class="font-medium underline text-primary-600 dark:text-primary-500"
                  >
                    Log in
                  </Link>
                </div>
                {showModal && !captchaSolved && (
                  <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                      <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-gray-900 outline-none focus:outline-none">
                          <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 dark:border-slate-600 rounded-t">
                            <h3 className="text-3xl font-semibold">Captcha</h3>
                          </div>
                          <div
                            className="mx-auto pb-6 p-10 rounded-2xl"
                            id="captchadiv"
                          >
                            {captchaSolved ? (
                              <Captcha
                                setSolved={setSolved}
                                solvedyesno={true}
                              />
                            ) : (
                              <Captcha
                                setSolved={setSolved}
                                solvedyesno={false}
                              />
                            )}
                          </div>

                          <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 dark:border-slate-600 rounded-b">
                            <button
                              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={() => setShowModal(false)}
                            >
                              ← Back
                            </button>
                            {/* <button
                              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                              type="submit"
                              // onClick={() => setShowModal(false)}
                            >
                              Create Account
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                  </>
                )}
                {captchaSolved && (
                  <ErrorComponent
                    error="Captcha completed"
                    side="bottom"
                    color="green"
                    blocked={false}
                  />
                )}
                {error && (
                  <ErrorComponent
                    error={error}
                    side="bottom"
                    color="red"
                    blocked={false}
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
