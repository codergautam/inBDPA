import Navbar from '@/components/navbar'
import { getRequestCookie } from '@/utils/getRequestCookie'
import { cookies } from 'next/headers'
import Head from 'next/head'

 export default async function Home() {
  const user = await getRequestCookie(cookies())
  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='w-full'>
        <Navbar user={user}/>
      </div>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        {/* Welcome section */}
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-6xl font-bold">
            Welcome to <a className="text-blue-600" href="https://inbdpa.com">inBDPA!</a>

          </h1>

          <p className="mt-3 text-2xl">
            The professional network for the digital age.
          </p>
          {
            user ? (
              <p className="mt-3 text-2xl">
                Welcome back, {user.username}!
              </p>
            ) : (

          <div className="flex flex-wrap items-center justify-center max-w-4xl mt-6 sm:w-full md:w-full sm:space-x-0 md:space-x-0 lg:space-x-12">
            <a
              href="/auth/signup"
              className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 border-black dark:border-white"
            >
              <h3 className="text-2xl font-bold">Sign up &rarr;</h3>
              <p className="mt-4 text-xl">
                Start connecting with professionals today.
              </p>
            </a>

            <a
              href="/auth/login"
              className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 border-black dark:border-white"
            >
              <h3 className="text-2xl font-bold">Log in &rarr;</h3>
              <p className="mt-4 text-xl">
                Already have an account? Log in here.
              </p>
            </a>
          </div>
            )
 }
        </div>


        {/* Feature A section */}
        <div className="flex flex-col items-center justify-center h-screen dark:bg-black ">
          <h2 className="text-4xl font-bold">Feature A</h2>
          <p className="mt-3 text-xl">
            Detailed description about Feature A.
          </p>
        </div>

        {/* Feature B section */}
        <div className="flex flex-col items-center justify-center h-screen dark:bg-black">
          <h2 className="text-4xl font-bold">Feature B</h2>
          <p className="mt-3 text-xl">
            Detailed description about Feature B.
          </p>
        </div>

      </main>


    </div>
  )
}

