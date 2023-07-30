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
        <p className="text-4xl text-gray-800 dark:text-white font-bold mb-8">
          {statusCode
            ? `An error ${statusCode} occurred on server`
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
