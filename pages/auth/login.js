import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '@/utils/ironConfig';
import Navbar from '@/components/navbar';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [btnText, setBtnText] = useState('Sign In');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState(3 - loginAttempts);

  useEffect(() => {
    const storedLoginAttempts = parseInt(localStorage.getItem('loginAttempts')) || 0;
    setLoginAttempts(storedLoginAttempts);
    setRemainingAttempts(3 - storedLoginAttempts);
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setBtnText('Signing in...');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          rememberMe,
        }),
        credentials: 'include',
      });

      setBtnText('Sign In');
      const data = await response.json();

      if (data.error) {
        setLoginAttempts(loginAttempts + 1);
        setRemainingAttempts(3 - loginAttempts - 1);
        localStorage.setItem('loginAttempts', loginAttempts + 1);
        setError(data.error);
      } else {
        // Redirect to home page
        window.location.href = '/';
      }
    } catch (error) {
      setBtnText('Sign In');
      setError('An error occurred while signing in.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white py-2">
      <Head>
        <title>Login | inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full">
        <Navbar />
      </div>

      <main className="flex items-center justify-center w-full flex-1 px-20 text-center">
        <div className="w-full max-w-md">
          <form
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl px-8 pt-6 pb-8 mb-4"
            onSubmit={handleLogin}
          >
            <h1 className="text-3xl mb-6 text-center font-bold dark:text-gray-200">Welcome back to inBDPA</h1>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {remainingAttempts > 0 && (
              <p className="text-gray-500 text-sm mb-4">
                {remainingAttempts} {remainingAttempts === 1 ? 'attempt' : 'attempts'} left
              </p>
            )}
            {remainingAttempts === 0 && (
              <p className="text-red-500 text-sm mb-4">You are temporarily blocked. Please try again later.</p>
            )}

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
                onChange={(event) => setUsername(event.target.value)}
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
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-200 text-sm mb-2">
                <input
                  className="mr-2 leading-tight"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                <span className="text-sm font-bold">Remember me</span>
              </label>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="pr-6 pl-6 pt-2 pb-2 text-left border  rounded-xl bg-gray-300 hover:bg-gray-400 text-white focus:text-blue-600 border-black dark:border-white text-xl "
                type="submit"
                disabled={remainingAttempts === 0}
              >
                {btnText}
              </button>
            </div>
            <p className="text-center text-gray-700 dark:text-gray-200 mt-5">
              Don&rsquo;t have an account yet?{' '}
              <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400">
                Sign up here
              </Link>
            </p>
            <p className="text-center text-gray-700 dark:text-gray-200 mt-5 text-sm">
              <Link href="http://localhost:3000/forgotpassword?email=email" className="text-blue-600 dark:text-blue-400">
                Forgot Password?
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
  if (req.session.user) {
    // redirect to home page
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
  return {
    props: {},
  };
}, ironOptions);
