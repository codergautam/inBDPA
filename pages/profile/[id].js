// Importing required components and modules
import Head from 'next/head'
import Navbar from '@/components/navbar';
import UserStats from '@/components/UserStats';
import UserConnections from '@/components/UserConnections';
import UserProfilePicture from '@/components/UserProfilePicture';
import UserInfo from '@/components/UserInfo';
import {  getUserFromProfileId } from '@/utils/api';
import { useEffect, useState } from 'react';
import { withIronSessionSsr } from 'iron-session/next'; // server-side session handling
import { ironOptions } from '@/utils/ironConfig'; // session configurations
import AboutSection from '@/components/AboutSection';
import Link from 'next/link';

const handleAboutSave = (newAbout, setRequestedUser) => {
  return new Promise((resolve, reject) => {
    fetch('/api/setAbout', {
      method: 'POST',
      body: JSON.stringify({ about: newAbout }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if(!data.success) {
          alert("Error saving about section");
        } else {
          console.log(setRequestedUser);
          setRequestedUser((prev) => ({...prev, sections: {...prev.sections, about: newAbout}}));
          console.log("New about: ", newAbout);
        resolve(newAbout);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};


// Profile page component
export default function Page({ user, requestedUser: d }) {

  // State to store number of active sessions
  const [activeSess, setActiveSessions] = useState("...");
  const [requestedUser, setRequestedUser] = useState(d);

  const editable = user?.id === requestedUser?.user_id;

  // Use effect to handle fetching number of active sessions
  useEffect(() => {
    async function refreshActive() {
      if(!requestedUser) return;
      let data = await fetch("/api/countActiveSessions", {
        method: "POST",
        body: JSON.stringify({
          view: "profile",
          viewed_id: requestedUser.user_id
        })
      })
      data = await data.json();
      setActiveSessions(Math.max(1,data.active));
    }

    // Continuously refreshing the active sessions every 5 seconds
    let activeSessInterval = setInterval(async () => {
      if(!requestedUser) return;
      await refreshActive();
    }, 5000);
    refreshActive();

    // Cleanup function to clear interval when the component is unmounted
    return () => {
      clearInterval(activeSessInterval);
    }
  }, []);

  // Sections in the user profile
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
        { requestedUser ? (
          <>
    <h1 className="text-7xl font-semibold text-gray-900 dark:text-white pt-5">{requestedUser.username}</h1>
    <h1 className="text-xl text-gray-900 dark:text-white mt-2 mb-4">{requestedUser.type}</h1>
    <UserProfilePicture />
    {editable || requestedUser.sections.about ? (
    <AboutSection about={requestedUser.sections.about} onSave={handleAboutSave} setRequestedUser={setRequestedUser} editable={editable}/>
    ) : null}

    {user ? (

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
) : null}

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

        {user ? sections.filter((s)=>requestedUser.sections[s].length > 0 || requestedUser.user_id == user?.id).map((section) => (
          <div className="w-full bg-white dark:bg-gray-700 p-4 mt-4 rounded-md shadow" key={section}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{section}</h2>
            <UserInfo type={section} user={user} requestedUser={requestedUser} section={section} />
          </div>
        )) : null}

{user ? (
        <div className="w-full bg-white dark:bg-gray-700 p-4 mt-4 rounded-md shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connections</h2>
          <UserConnections />
        </div>
) : null}

</>
      ): (
        <>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white pt-5 ">User not found</h1>
        <Link href="/" className="text-xl text-gray-900 dark:text-white mt-2 mb-4 bg-blue-200 p-2 rounded-sm dark:bg-blue-800">
          Return to home page
        </Link>
        </>
      )}
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

  return {
    props: { user: req.session.user ?? null, requestedUser: requestedUser ?? null },
  };
},
ironOptions);