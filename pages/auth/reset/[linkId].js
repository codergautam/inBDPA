import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getResetLink } from '@/utils/api';
import Link from 'next/link';
import Navbar from '@/components/navbar';

export default function ResetPassword({ resetId, failError }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [btnText, setBtnText] = useState('Change Password');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess(false);
    setBtnText('Changing Password...');

    try {
      const response = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resetId,
          password,
        }),
      });

      setBtnText('Change Password');
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(true);
      }
    } catch (error) {
      setBtnText('Change Password');
      setError('An error occurred while changing the password.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white py-2">
      <Head>
        <title>Reset Password | inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='w-full'>
      <Navbar />
      </div>

      <main className="flex items-center justify-center w-full flex-1 px-20 text-center">
        { failError ? (
           <>
           <div>
           <h1 className="text-3xl font-semibold text-gray-900 dark:text-white pt-5 ">{failError ?? "Unexpected Error"}</h1>
           <br/>
           <Link href="/" className="text-xl text-gray-900 dark:text-white mt-2 mb-4 bg-blue-200 p-2 rounded-sm dark:bg-blue-800">
             Return to home page
           </Link>
           </div>
           </>
        ) : (
        <div className="w-full max-w-md">
          <form className="bg-white dark:bg-gray-900 rounded-lg shadow-xl px-8 pt-6 pb-8 mb-4" onSubmit={handleChangePassword}>
            <h1 className="text-3xl mb-6 text-center font-bold dark:text-gray-200">Reset Your Password</h1>
            {success ? (
              <div>
              <p className="text-green-500 text-sm mb-4">Your password has been reset successfully.</p>
              <br/>
              <Link href="/auth/login" className="text-xl text-gray-900 dark:text-white mt-2 mb-4 bg-blue-200 p-2 rounded-sm dark:bg-blue-800">
                Log In
              </Link>
              </div>
            ) : (
              <>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="password">
                    New Password
                  </label>
                  <input
                    className="appearance-none rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    className="appearance-none rounded-lg w-full py-2 px-3 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <button
                    className="pr-6 pl-6 pt-2 pb-2 text-left border rounded-xl bg-gray-300 hover:bg-gray-400 text-white focus:text-blue-600 dark:bg-gray-800 border-black dark:border-white text-xl"
                    type="submit"
                  >
                    {btnText}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const resetId = params.linkId;

  let resetLink = await getResetLink(resetId);
  if(!resetLink || resetLink.error) {
    return {
      props: {
        failError: resetLink.error ?? "Unexpected Error"
      }
    }
  }
  let oneHr = 1000 * 60 * 60;
  if(Date.now() - resetId.createdAt > oneHr) {
    return {
      props: {
        failError: "This link has expired"
      }
    }
  }
  if(resetLink.used) {
    return {
      props: {
        failError: "This link has been used"
      }
    }
  }

  return {
    props: {
      resetId,
    },
  };
}
