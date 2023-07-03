import Head from 'next/head'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <a className="text-blue-600" href="https://inbdpa.com">inBDPA!</a>
        </h1>

        <p className="mt-3 text-2xl">
          The professional network for the digital age.
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <a
            href="/signup"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Sign up &rarr;</h3>
            <p className="mt-4 text-xl">
              Start connecting with professionals today.
            </p>
          </a>

          <a
            href="/login"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Log in &rarr;</h3>
            <p className="mt-4 text-xl">
              Already have an account? Log in here.
            </p>
          </a>
        </div>


      </main>


    </div>
  )
}
