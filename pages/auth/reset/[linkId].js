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
      <section class="bg-gray-50 dark:bg-gray-900 h-screen">
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
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            {failError ? (
              <div class="space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-6">
                  {failError ?? "Unexpected Error"}
                </h1>
                <Link href="/auth/login">
                  <button class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Return to login
                  </button>
                </Link>
              </div>
            ) : (
              <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Reset Your Password
                </h1>
                <form
                  class="space-y-4 md:space-y-6"
                  onSubmit={handleChangePassword}
                >
                  {success ? (
                    <p></p>
                  ) : (
                    <>
                      <div>
                        <label
                          for="email"
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Your password
                        </label>
                        <input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required=""
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          for="password"
                          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Confirm password
                        </label>
                        <input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required=""
                          value={confirmPassword}
                          onChange={(event) =>
                            setConfirmPassword(event.target.value)
                          }
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
                      <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                        Remember password?{" "}
                        <Link
                          href="/auth/login"
                          class="font-medium text-primary-600 hover:underline dark:text-primary-500"
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
