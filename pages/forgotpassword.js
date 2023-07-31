// pages/forgotpassword.js
// This is the code for the Forgot Password page of the inBDPA project. It is responsible for rendering the UI of the forgot password page and handling user input for sending a password reset link. The page includes a form where the user can enter their email. When the form is submitted, an API request is made to the server to send a password reset link to the provided email address. If there is an error during the submission process, an error message is displayed to the user.
// 
// The code uses the useState hook from React to manage the form inputs and error state. It also imports the withIronSessionSsr function from the iron-session/next library to handle session authentication. The getServerSideProps function is used to redirect authenticated users to the home page.
// 
// Overall, this code handles the rendering and submission logic for the forgot password page of the inBDPA project.

"use client";
import Head from 'next/head'
import { useState } from 'react';
import Link from 'next/link'
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '@/utils/ironConfig';

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [btnText, setBtnText] = useState("Sign Up");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white py-2">
      <Head>
        <title>Forgot Password | inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center justify-center w-full flex-1 px-20 text-center">

        <div className="w-full max-w-md">
          <form
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl px-8 pt-6 pb-8 mb-4"
            onSubmit={event => {
              event.preventDefault();
              fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  username: name,
                  email,
                  password,
                  rememberMe
                }),
                credentials: "include"
              }).then(response => {
                setBtnText("Sign Up");
                response.json().then(data => {
                  if(data.error) {
                    setError(data.error);
                    return;
                  }
                  // Redirect to home page
                  window.location.href = "/";
                });
              }).catch(error => {
                setBtnText("Sign Up");
                setError("An error occurred while signing up.");
              });
            }}
          >
            <h1 className="text-3xl mb-6 text-center font-bold dark:text-gray-200">Forgot Password?</h1>
      
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="appearance-none rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={event => setEmail(event.target.value)}
              />
            </div>
            
            
            <div className="flex items-center justify-center">
              <button
                className="pr-6 pl-6 pt-2 pb-2 text-left border  rounded-xl bg-gray-300 hover:bg-gray-400 text-white border-black dark:border-white text-xl "
                type="submit"
              >
                Send
              </button>
            </div>
           
             
          </form>

        </div>
      </main>

    </div>
  )
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  if(req.session.user) {
    // redirect to home page
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    }
  }
  return {
    props: {},
  }
},
ironOptions);