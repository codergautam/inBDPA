"use client";w
import Head from 'next/head'
import { useState } from 'react';
import Link from 'next/link'

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white py-2">
      <Head>
        <title>Sign Up | inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center justify-center w-full flex-1 px-20 text-center">

        <div className="w-full max-w-md">
          <form
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl px-8 pt-6 pb-8 mb-4"
            onSubmit={event => {
              event.preventDefault();
              // Do signup logic here
            }}
          >
            <h1 className="text-2xl mb-6 text-center font-bold dark:text-gray-200">Create an Account</h1>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="appearance-none rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </div>
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
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="appearance-none rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={event => setPassword(event.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                <input
                  className="mr-2 leading-tight"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={event => setRememberMe(event.target.checked)}
                />
                <span className="text-sm">
                  Remember me
                </span>
              </label>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="pr-6 pl-6 pt-2 pb-2 text-left border  rounded-xl hover:text-blue-600 focus:text-blue-600 border-black dark:border-white text-xl "
                type="submit"
              >
                Sign Up
              </button>
            </div>
            <p className="text-center text-gray-700 dark:text-gray-200 mt-5">
              Already have an account? <Link href="/auth/login" className="text-blue-600 dark:text-blue-400">Log in here</Link>
            </p>
          </form>

        </div>
      </main>

    </div>
  )
}
