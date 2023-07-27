import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/navbar";
import ErrorComponent from "./ErrorComponent";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [btnText, setBtnText] = useState("Fill all Fields");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [link, setLink] = useState(false);
  const areAllFieldsFilled = () => {
    return email !== "";
  };
  const areallfieldsfilled = areAllFieldsFilled();
  useEffect(() => {
    if (!areallfieldsfilled) {
      setBtnText("Fill Field");
    }else{
      setBtnText("Reset Password");
    }
  }, [areallfieldsfilled])

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess(false);
    setBtnText("Resetting...");

    try {
      const response = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      setBtnText("Reset Password");
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess("Email sent");
        setLink(data.reset_id);
      }
    } catch (error) {
      setBtnText("Reset Password");
      setError("An error occurred while resetting the password.");
    }
  };

  return (
    <section class="bg-gray-50 dark:bg-gray-900 h-screen">
      <div className="h-0 w-screen">
        <Navbar />
      </div>{" "}
      {error && (
        <ErrorComponent
          error={error}
          side="bottom"
          color="red"
          blocked={false}
          setError={setError}
        />
      )}
      {success && (
        <ErrorComponent
          error={success}
          side="bottom"
          color="green"
          blocked={false}
          setError={setSuccess}
        />
      )}
      <Head>
        <title>Forgot Password | inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class={success ? "p-6" : "p-6 space-y-4 md:space-y-6 sm:p-8"}>
            {success ? (
              <>
                <p className="text-green-500 text-sm mb-7 text-center">
                  Ideally, this generated reset link would be sent to the
                  provided email for verification, but for the purposes of this
                  project, its here to demo functionality:
                </p>
                <Link href={`/auth/reset/${link}`}>
                  <div className="text-center mx-auto mb-2 text-blue-600 w-fit font-bold text-xs sm:text-lg bg-white pt-3 pb-3 px-2 sm:px-8 rounded-md underline">
                  {window.location.hostname + `/auth/reset/${link}`}
                  </div>
                </Link>
                <p className="text-blue-400 text-sm text-center italic mb-6">
                  expires in one hour
                </p>
                <p
                  className="text-gray-500 dark:hover:text-gray-300 hover:text-gray-800 text-sm text-center underline cursor-pointer"
                  onClick={handleResetPassword}
                >
                  Didn&apos;t get the link? resend
                </p>
              </>
            ) : (
              <>
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Forgot your password?
                  <p className="text-gray-500 font-semibold text-sm mt-3">
                    Enter your email address and we&apos;ll send you
                    instructions on how to reset your password.
                  </p>
                </h1>
                <form
                  class="space-y-4 md:space-y-6"
                  onSubmit={handleResetPassword}
                >
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                      required=""
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
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
                  {/* <button
                    type="submit"
                    class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    {btnText}
                  </button> */}
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                    Remember password?{" "}
                    <Link
                      href="../auth/login"
                      class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Log in
                    </Link>
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
