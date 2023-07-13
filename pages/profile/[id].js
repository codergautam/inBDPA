// Importing required components and modules
import Head from 'next/head'
import Navbar from '@/components/navbar';
import UserStats from '@/components/UserStats';
import UserConnections from '@/components/UserConnections';
import UserProfilePicture from '@/components/UserProfilePicture';
import UserInfo from '@/components/UserInfo';
import {  getUserFromProfileId, getUserPfp, incrementUserViews } from '@/utils/api';
import { useEffect, useState } from 'react';
import { withIronSessionSsr } from 'iron-session/next'; // server-side session handling
import { ironOptions } from '@/utils/ironConfig'; // session configurations
import AboutSection from '@/components/AboutSection';
import Link from 'next/link';
import { fetchConnections, findConnectionDepth } from '@/utils/neo4j.mjs';
import addSuffix from '@/utils/ordinalSuffix';
import LinkChanger from '@/components/LinkChanger';
import ConnectionList from '@/components/ConnectionList';
import { get } from 'mongoose';




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
export default function Page({ user, requestedUser: r, depth:d, connections: c , link, pfp, error}) {

  // State to store number of active sessions
  const [activeSess, setActiveSessions] = useState("...");
  const [requestedUser, setRequestedUser] = useState(r);
  const [connections, setConnections] = useState(c);
  const [depth, setDepth] = useState(d);
  const [connectionLabel, setConnectionLabel] = useState(connections[0]?.includes(user?.id) ? "Disconnect" : "Connect");


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

{editable ? (
<LinkChanger link={link} />
) : null}

    <UserProfilePicture editable={editable} email={requestedUser.email} pfp={pfp}/>
    <ConnectionList connections={connections} clickable={!!user} user_id={requestedUser.user_id} depth={depth} />

    {user ? (
      <>
      {editable ? null : (
      <button
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      onClick={async () => {
        // Indicate that a connection/disconnection operation is happening
        if(connectionLabel == "Connect") setConnectionLabel("Connecting...");
        else if(connectionLabel == "Disconnect") setConnectionLabel("Disconnecting...");
        else return;

        let data = await fetch("/api/toggleConnection", {
          method: "POST",
          body: JSON.stringify({
            user_id: requestedUser.user_id
          })
        });
        data = await data.json();
        if (data.success) {
          setConnections(() => data.connections);
          setDepth(() => data.newDepth);
          // Indicate that the operation is complete
          setConnectionLabel(data.connections[0]?.includes(user?.id) ? "Disconnect" : "Connect");
        } else {
          // If the operation fails, reset the button's label
          setConnectionLabel(connections[0]?.includes(user?.id) ? "Disconnect" : "Connect");
        }
      }}
    >
      {connectionLabel}
    </button>
      )}
      </>
    ): null}
    {editable || requestedUser.sections.about ? (
    <AboutSection about={requestedUser.sections.about} onSave={handleAboutSave} setRequestedUser={setRequestedUser} editable={editable}/>
    ) : null}

    {user ? (

        <div className="flex flex-col md:flex-row gap-4 mt-4 w-full">
          <div className="w-full md:w-1/3 bg-white dark:bg-gray-700 p-4 rounded-md shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Profile Statistics</h2>
            <UserStats views={requestedUser.views} activeSessions={activeSess} connectionStatus={depth > 0 ? addSuffix(depth)+" connection": "Not Connected"} editable={editable}/>
            </div>

           <div className="w-full md:w-2/3 bg-white dark:bg-gray-700 p-4 rounded-md shadow">
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
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white pt-5 ">{error ?? "Unexpected Error"}</h1>
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
  const request = await getUserFromProfileId(id);
  const requestedUser = request.user;
  if(request.error) {
    return {
      props: { user: req.session?.user ?? null, requestedUser: null, depth: 0, connections: [[],[]], link: id, pfp: null, error: request.error },
    };
  }
  let depth = 0;
  let connections = []
  let connected = false;
  if(requestedUser && req.session?.user) {
   connected = requestedUser.connections?.includes(req.session?.user?.id);
   if(connected) depth = 1;
  if(!connected && req.session?.user && (req.session?.user?.id != requestedUser?.user_id)) {
    // Find connection depth
    depth = await findConnectionDepth(req.session?.user?.id, requestedUser?.user_id);
  }
}
if(requestedUser) connections.push(await fetchConnections(requestedUser?.user_id, 1), await fetchConnections(requestedUser?.user_id, 2));

if(requestedUser && !(requestedUser?.user_id == req.session?.user?.id)) {
  // Increment view count
  try {
  await incrementUserViews(requestedUser?.user_id);
  } catch(e) {
    console.log(e);
  }
}
let pfp;
if(requestedUser) {
  pfp = await getUserPfp(requestedUser?.user_id);
}


let safeRequestedUser;
if(requestedUser) safeRequestedUser = {
  ...requestedUser,
  salt: null,
  key: null,
}


  return {
    props: { user: req.session?.user ?? null, requestedUser: safeRequestedUser ?? null, depth: depth ?? 0, connections: connections ?? [[],[]], link: id, pfp: pfp ?? null },
  };
},
ironOptions)