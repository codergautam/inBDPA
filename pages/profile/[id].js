import Head from 'next/head'
import Navbar from '@/components/navbar';
import UserStats from '@/components/UserStats';

import UserConnections from '@/components/UserConnections';
import UserViewStatus from '@/components/UserViewStatus';
import UserProfilePicture from '@/components/UserProfilePicture';

import { countSessionsForUser, getUserFromProfileId } from '@/utils/api';
import { useEffect, useState } from 'react';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '@/utils/ironConfig';
import UserInfo from '@/components/UserInfo';

export default function Page({ user, requestedUser, activeSessions }) {
  const [activeSess, setActiveSessions] = useState(0);
  useEffect(() => {
    setActiveSessions(activeSessions);
  }, [activeSessions]);

  const sections = ["volunteering", "skills", "experience"]


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
    <h1 className="text-xl text-gray-900 dark:text-white mt-2 mb-4">{requestedUser.type}</h1>
    <UserProfilePicture />



        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-700 p-4 rounded-md shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Profile Statistics</h2>
            <UserStats views={requestedUser.views} activeSessions={activeSess} connectionStatus="Second-order connection"/>
          </div>

           <div className="w-full md:w-1/2 bg-white dark:bg-gray-700 p-4 rounded-md shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Education</h2>
            <UserInfo type="education" user={user} requestedUser={requestedUser} section="education" />
          </div>
        </div>
{/*
        <div className="w-full bg-white dark:bg-gray-700 p-4 mt-4 rounded-md shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Experience</h2>
          <UserInfo type="experience" user={user} requestedUser={requestedUser} section="experience" />
        </div>

        <div className="w-full bg-white dark:bg-gray-700 p-4 mt-4 rounded-md shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2" section="skills" >Skills</h2>
          <UserInfo type="skills" user={user} requestedUser={requestedUser} />
        </div>

        <div className="w-full bg-white dark:bg-gray-700 p-4 mt-4 rounded-md shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2" section="volunteering" >Volunteering</h2>
          <UserInfo type="volunteering" user={user} requestedUser={requestedUser} />
        </div> */}

        {sections.filter((s)=>requestedUser.sections[s].length > 0 || requestedUser.user_id == user.id).map((section) => (
          <div className="w-full bg-white dark:bg-gray-700 p-4 mt-4 rounded-md shadow" key={section}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{section}</h2>
            <UserInfo type={section} user={user} requestedUser={requestedUser} section={section} />
          </div>
        ))}

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
  console.log("User:")
  console.log(requestedUser)
  const activeSessions = (await countSessionsForUser(requestedUser.user_id)).active;

  return {
    props: { user: req.session.user ?? null, requestedUser, activeSessions },
  };
},
ironOptions);