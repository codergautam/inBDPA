import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/navbar";
import ErrorComponent from "./ErrorComponent";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [btnText, setBtnText] = useState("Reset Password");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
        setSuccess(data.reset_id);
      }
    } catch (error) {
      setBtnText("Reset Password");
      setError("An error occurred while resetting the password.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navbar />
      {error && <ErrorComponent error={error} />}

      <Head>
        <title>Forgot Password | inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex items-center justify-center w-full flex-1 px-20 text-center">
        <div className="w-full max-w-md">
          <form
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl px-8 pt-6 pb-8 mb-4"
            onSubmit={handleResetPassword}
          >
            <h1 className="text-3xl mb-6 text-center font-bold dark:text-gray-200">
              Forgot Your Password?
            </h1>
            {success ? (
              <p className="text-green-500 text-sm mb-4">
                Ideally, this generated reset link would be sent to the provided
                email for verification, but for the purposes of this project,
                its here to demo functionality: <br /> <br />
                <Link href={`/auth/reset/${success}`}>
                  {window.location.hostname + `/auth/reset/${success}`}
                </Link>
                <br />
                The link expires in one hour
              </p>
            ) : (
              <>
                <p className="text-gray-500 text-sm mb-4">
                  Enter your email address and we&apos;ll send you instructions
                  on how to reset your password.
                </p>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="appearance-none rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <button
                    className="pr-6 pl-6 pt-2 pb-2 text-left border rounded-xl bg-gray-300 hover:bg-gray-400 text-white focus:text-blue-600 dark:bg-gray-800 border-black dark:border-white text-xl"
                    type="submit"
                  >
                    {btnText}
                  </button>
                </div>
              </>
            )}
            <p className="text-center text-gray-700 dark:text-gray-200 mt-5">
              Remember your password?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 dark:text-blue-400"
              >
                Log in here
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
