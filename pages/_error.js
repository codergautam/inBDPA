// pages/_error.js
// This file defines a Next.js error page component.
// 
// The Error component takes in two props, `statusCode` and `user`, and displays an error message with the status code if it exists, or a generic error message if not. It also displays a link to return to the home page.
// 
// The component is wrapped in a section with a white background and black text. 
// 
// There is a div with a gray background and within it, the Next.js Head component and the Navbar component are rendered. 
// 
// Inside the main div, there is another div which is centered vertically and horizontally and has a gray background. 
// 
// Inside this div, there is a paragraph that displays the error message based on the `statusCode` prop. 
// 
// Below the paragraph, there is a link styled as a button that navigates back to the home page.
// 
// The `getInitialProps` function is used to set the `statusCode` prop based on the response from the server or the error object. The `user` prop is set to null for now, but in a real implementation it would be fetched from the server.
// 
// The Error component is exported as the default export of the module.
import Link from 'next/link';
import Head from 'next/head';
import Navbar from '../components/navbar'; // Replace with path to your Navbar component

function Error({ statusCode, user }) {
  return (
    <section className="text-black bg-white dark:bg-gray-800 flex flex-col min-h-screen">
      <div className="bg-gray-100 dark:bg-gray-800">
        <Head />
        <Navbar user={user} />
      </div>
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
        <p className="text-4xl text-gray-800 dark:text-white text-center font-bold mb-8">
          {statusCode
            ? <>
            We couldn't find that <br/> An error {statusCode} occurred on server
            </>
            : 'An error occurred on client'}
        </p>
        <Link href="/" className="text-lg text-gray-800 dark:text-white font-semibold py-2 px-6 bg-blue-500 hover:bg-blue-600 rounded transition duration-200 ease-in-out">
            Go home
          </Link>
      </div>
    </section>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  // User would be fetched here. For now, it's null.
  const user = null;
  return { statusCode, user };
}

export default Error;
