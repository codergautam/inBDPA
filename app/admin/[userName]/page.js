"use client"

import { getRequestCookie } from "@/utils/getRequestCookie";
import Head from "next/head";
import { useEffect, useState } from "react";
import { cookies } from "next/headers";
import { getUserFromProfileId } from "@/utils/api";
import Stats from "./Stats";
// import Navbar from "@/components/navbar";

// async function getInfoData() {
//   let data = await fetch("http://localhost:3000/api/info", {
//     next: {
//       revalidate: 60
//     }
//   }).then((res)=> res.json());
//   return data;
// }

export default async function Page({params}){ 
  
  const user = await getRequestCookie(cookies())

  const requestedUser = await getUserFromProfileId(params.id);
  // let data = await getInfoData();
  // const [info, setInfo] = useState({});
  // const [password, setPassword] = useState("");
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [rememberMe, setRememberMe] = useState(false);
  // if(data.success) setInfo(data.info)
  // useEffect(()=>{
  //   console.log("why")
  // },[])
  // console.log("Info:")
  // console.log(data)
  // if(data.success) {
  //   console.log("Success!")
  //   info = data.info;
  // }
  
  const handleSubmit = () => {

  }

  const increaseSessions = () => {
    console.log("Increasing session count")
    info.sessions++;
  }
  return (
        <div className="flex flex-col h-screen dark:bg-black">
        <Head>
          <title>inBDPA</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
          <div className='w-full'>
            <Navbar user={user}/>
          </div>
          <div className="text-gray-700 text-4xl text-center mt-4">
            Hello
          </div>
          <div className="text-white text-7xl text-center font-bold">
            {params.userName}
          </div>
          <form onSubmit={handleSubmit} className="mt-4 px-6 py-4 bg-gray-700 w-1/2 mx-auto rounded"> <h1 className="text-2xl mb-6 text-center font-bold dark:text-gray-200">Create an Account</h1>
            {/* {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
                {btnText}
              </button>
            </div>
            <p className="text-center text-gray-700 dark:text-gray-200 mt-5">
              Already have an account? <Link href="/auth/login" className="text-blue-600 dark:text-blue-400">Log in here</Link>
            </p> */}
            </form>
        </div>
        )
}