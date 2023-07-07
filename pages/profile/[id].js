import Head from 'next/head'
<<<<<<< HEAD:pages/profile/[id].js
import Navbar from '@/components/navbar';
import UserStats from '@/components/UserStats';
import UserEducation from '@/components/UserEducation';
import UserExperience from '@/components/UserExperience';
import UserSkills from '@/components/UserSkills';
import UserVolunteering from '@/components/UserVolunteering';
import UserConnections from '@/components/UserConnections';
import UserViewStatus from '@/components/UserViewStatus';
import UserProfilePicture from '@/components/UserProfilePicture';
=======
import Navbar from '@/components/Navbar';
import { getRequestCookie } from '@/utils/getRequestCookie';
import UserStats from './UserStats';
import UserEducation from './UserEducation';
import UserExperience from './UserExperience';
import UserSkills from './UserSkills';
import UserVolunteering from './UserVolunteering';
import UserConnections from './UserConnections';
import UserViewStatus from './UserViewStatus';
import { cookies } from 'next/headers';
import UserProfilePicture from './UserProfilePicture';
import { getUserFromProfileId } from '@/utils/api';
>>>>>>> 97755b8989932646377eaa0777d44670bd9789e2:app/profile/[id]/page.js

import { countSessionsForUser, getUserFromProfileId } from '@/utils/api';
import { useEffect, useState } from 'react';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '@/utils/ironConfig';

export default function Page({ user, requestedUser, activeSessions }) {
  const [activeSess, setActiveSessions] = useState(0);
  useEffect(() => {
    setActiveSessions(activeSessions);
  }, [activeSessions]);


  return (
    <div className="flex flex-col h-screen dark:bg-black">
      <Head>
        <title>inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='w-full'>
        <Navbar user={user}/>
      </div>


      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
    <h1 className="text-7xl font-semibold text-gray-900 dark:text-white pt-5">{requestedUser.username}</h1>
    <UserProfilePicture />



        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-700 p-4 rounded-md shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Profile Statistics</h2>
            <UserStats views={requestedUser.views} activeSessions={activeSess} connectionStatus="Second-order connection"/>
          </div>

          <div className="w-full md:w-1/2 bg-white dark:bg-gray-700 p-4 rounded-md shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Education</h2>
            <UserEducation />
          </div>
        </div>

        <div className="w-full bg-white dark:bg-gray-700 p-4 mt-4 rounded-md shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Experience</h2>
          <UserExperience />
        </div>

        <div className="w-full bg-white dark:bg-gray-700 p-4 mt-4 rounded-md shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Skills</h2>
          <UserSkills />
        </div>

        <div className="w-full bg-white dark:bg-gray-700 p-4 mt-4 rounded-md shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Volunteering</h2>
          <UserVolunteering />
        </div>

        <div className="w-full bg-white dark:bg-gray-700 p-4 mt-4 rounded-md shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connections</h2>
          <UserConnections />
        </div>

        <div className="w-full bg-white dark:bg-gray-700 p-4 mt-4 rounded-md shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Viewing Status</h2>
          <UserViewStatus />
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
  params
}) {

  // Get id param of dynamic route
  // ex: /profile/1
  const id = params.id;
  const requestedUser = (await getUserFromProfileId(id)).user;
  const activeSessions = (await countSessionsForUser(requestedUser.user_id)).active;

  return {
    props: { user: req.session.user, requestedUser, activeSessions },
  };
},
ironOptions);