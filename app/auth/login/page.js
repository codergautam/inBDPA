"use client";
import Head from 'next/head'
import { useState } from 'react';
import Link from 'next/link'

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-800 text-black dark:text-white py-2">
      <Head>
        <title>Login | inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center justify-center w-full flex-1 px-20 text-center">

        <div className="w-full max-w-md">
          <form
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl px-8 pt-6 pb-8 mb-4"
            onSubmit={event => {
              event.preventDefault();
              // Do login logic here
            }}
          >
          <h1 className="text-2xl mb-6 text-center font-bold dark:text-gray-200">Welcome back to inBDPA</h1>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="appearance-none rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={event => setUsername(event.target.value)}
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
                Sign In
              </button>
            </div>
            <p className="text-center text-gray-700 dark:text-gray-200 mt-5">
            Don't have an account yet? <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400">Sign up here</Link>
          </p>
          </form>

        </div>
      </main>

    </div>
  )
}
