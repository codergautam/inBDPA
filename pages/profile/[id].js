// Importing required components and modules
import Head from "next/head";
import Navbar from "@/components/navbar";
import UserStats from "@/components/UserStats";
import UserProfilePicture from "@/components/UserProfilePicture";
import UserInfo from "@/components/UserInfo";
import {
  getUserFromMongo,
  getUserFromProfileId,
  increaseViewCountMongo,
  incrementUserViews,
  updateUserMongo,
} from "@/utils/api";
import { use, useEffect, useState } from "react";
import { withIronSessionSsr } from "iron-session/next"; // server-side session handling
import { ironOptions } from "@/utils/ironConfig"; // session configurations
import AboutSection from "@/components/AboutSection";
import Link from "next/link";
import { fetchConnections, findConnectionDepth } from "@/utils/neo4j.mjs";
import addSuffix from "@/utils/ordinalSuffix";
import LinkChanger from "@/components/LinkChanger";
import ConnectionList from "@/components/ConnectionList";
import UserBanner from "@/components/UserBanner";
import md5 from "blueimp-md5";
import rateLimit from "@/utils/rateLimit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { Router } from "react-router-dom";
import { useRouter } from "next/router";

const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hr
  uniqueTokenPerInterval: 1000,
});

const handleAboutSave = (newAbout, setRequestedUser) => {
  return new Promise((resolve, reject) => {
    fetch("/api/setAbout", {
      method: "POST",
      body: JSON.stringify({ about: newAbout }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          alert(data.error ?? "Unexpected Error saving about");
          reject();
        } else {
          setRequestedUser((prev) => ({
            ...prev,
            sections: { ...prev.sections, about: newAbout },
          }));
          resolve(newAbout);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// Profile page component
export default function Page({
  user,
  requestedUser: r,
  depth: d,
  connections: c,
  link,
  pfp,
  banner,
  error,
}) {
  // State to store number of active sessions
  const router = useRouter()
  const [activeSess, setActiveSessions] = useState("...");
  const [requestedUser, setRequestedUser] = useState(r);
  const [connections, setConnections] = useState(c);
  const [depth, setDepth] = useState(d);
  const [connectionLabel, setConnectionLabel] = useState(
    connections[0]?.includes(user?.id) ? "Disconnect" : "Connect"
  );
  const [editingFullName, setEditingFullName] = useState(false)
  const [editingEmail, setEditingEmail] = useState(false)
  const [newFullName, setNewFullName] = useState(r.fullName)
  const [newEmail, setNewEmail] = useState(r.email ?? null)

  const editable = user?.id === requestedUser?.user_id;

  // Use effect to handle fetching number of active sessions
  useEffect(() => {
    async function refreshActive() {
      if (!requestedUser) return;
      let data = await fetch("/api/countActiveSessions", {
        method: "POST",
        body: JSON.stringify({
          view: "profile",
          viewed_id: requestedUser.user_id,
        }),
      });
      data = await data.json();
      setActiveSessions(Math.max(1, data.active));
    }

    // Continuously refreshing the active sessions every 5 seconds
    let activeSessInterval = setInterval(async () => {
      if (!requestedUser) return;
      await refreshActive();
    }, 5000);
    refreshActive();

    // Cleanup function to clear interval when the component is unmounted
    return () => {
      clearInterval(activeSessInterval);
    };
  }, []);


  function deleteProfile() {
    fetch("/api/deleteProfile", {
      method: "POST",
      body: JSON.stringify({
        user_id: requestedUser.user_id,
      }),
    }).then(res => res.json()).then(data => {
      if(data.success) {
        window.location.href = "/";
      } else {
        alert(data.error ?? "Unexpected error deleting profile");
      }
    }).catch(err => {
      alert(err);
    })
  }

  // Sections in the user profile
  const sections = ["education", "volunteering", "skills", "experience"];

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-gray-800 min-h-screen h-full">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {requestedUser ? (
          <>
            <title>{requestedUser?.username + "'s Profile - inBDPA"}</title>
            <meta name="description" content={requestedUser?.sections?.about} />
            <meta
              name="viewport"
              content="initial-scale=1.0, width=device-width"
            />
            <meta
              property="og:title"
              content={`${requestedUser?.username}'s Profile`}
            />
            <meta
              property="og:description"
              content={requestedUser?.sections?.about}
            />
            <meta
              property="og:image"
              content={
                !requestedUser?.pfp || requestedUser?.pfp === "gravatar"
                  ? `https://www.gravatar.com/avatar/${requestedUser?.hashedEmail}?s=256`
                  : "/api/public/pfps/" + requestedUser?.pfp
              }
            />
            <meta property="og:type" content="profile" />
            <link rel="icon" href="/favicon.ico" />
          </>
        ) : (
          <title>Profile Not Found - inBDPA</title>
        )}
      </Head>
      <div className="w-full">
        <Navbar user={user} />
      </div>

      {requestedUser ? (
        <UserBanner editable={editable} banner={banner} />
      ) : null}

      <main className="flex flex-col mt-4 mb-12 pb-4 relative items-center justify-center bg-white border-gray-300 dark:bg-gray-700 border dark:border-gray-700 rounded w-11/12 md:w-2/3 mx-auto flex-1 px-4 md:px-20 text-center">
        {requestedUser ? (
          <>
            <div className="flex flex-col md:flex-row md:gap-6 w-full">
              <div className="hidden md:flex flex-col md:w-1/3 p-4">
                {user ? (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Statistics
                    </h2>

                    <UserStats
                      views={requestedUser.views}
                      activeSessions={activeSess}
                      connectionStatus={
                        depth > 0
                          ? addSuffix(depth) + " connection"
                          : "Not Connected"
                      }
                      editable={editable}
                    />
                  </>
                ) : null}
              </div>
              <div className="md:w-1/3">
                <UserProfilePicture
                  editable={editable}
                  hashedEmail={requestedUser?.hashedEmail}
                  pfp={pfp}
                />
              </div>
              <div className="flex md:hidden flex-col w-full mx-auto">
                {user ? (
                  <>
                    <h2 className="text-xs sm:text-lg md:text-xl text-center font-bold text-gray-900 dark:text-white mb-2 w-full">
                      Profile Statistics
                    </h2>
                    <UserStats
                      views={requestedUser.views}
                      activeSessions={activeSess}
                      connectionStatus={
                        depth > 0
                          ? addSuffix(depth) + " connection"
                          : "Not Connected"
                      }
                      editable={editable}
                    />
                  </>
                ) : null}
              </div>
              <div className="w-full md:w-1/3">
                <p className=" mt-4 font-bold text-black dark:text-white text-xs sm:text-lg md:text-xl">
                  Network
                </p>
                <ConnectionList
                  connections={connections}
                  clickable={!!user}
                  user_id={requestedUser.user_id}
                  isYou={user?.id == requestedUser.user_id}
                  depth={depth}
                  theirName={requestedUser.username}
                />
              </div>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 semism:text-7xl break-words dark:text-white pt-5 w-full">
              {requestedUser.username}
            </h1>
            {user ?
            <>
            {
              !editingFullName  ?
                <button onClick={() => setEditingFullName(true)} className="text-xl cursor-pointer flex hover:opacity-100 w-min min-w-max text-center items-end group transition duration-300 ease-in-out dark:hover:text-white font-semibold text-gray-700 semism:text-3xl break-words dark:text-gray-400 mt-2 mx-auto">
                  {requestedUser.fullName ? requestedUser.fullName : (r.user_id == user.id ? "Add your full name" : "")}
                {editable? "✏️": ""}
                </button>
             : <form onSubmit={async e => {
                e.preventDefault()
                console.log(user)
                let data = await fetch("/api/changeFullName", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    fullName: newFullName,
                    user_id: user.id
                  })
                }).then(res => res.json())
                console.log(data)
                if (data.success) {
                  // Redirect to the new link
                  let copy = r
                  copy.fullName = newFullName
                  setEditingFullName(false)
                  setRequestedUser(copy)
                  // await router.push(`/profile/${link}`)
                } else {
                  alert(`Something went wrong, ${data.error}`)
                  setEditingFullName(false)
                }
              }} className="flex flex-col space-y-2">
              <input
            type="text"
            placeholder="Enter your Full Name"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
            className="border-b-2 outline-none dark:text-white text-black bg-transparent pb-1 mt-2"
          />
          <div className="flex space-x-2 w-full">
          <button
                      className="px-4 py-2 text-white w-min min-w-max bg-blue-600 hover:bg-blue-700 rounded-md duration-200 ease-in-out transition"
           type="submit">
            Submit
          </button>
          <button
            className="px-4 py-2 w-min min-w-max text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 rounded-md duration-200 ease-in-out transition"
            onClick={(e) => {
              setNewFullName(r.fullName)
              setEditingFullName(false)
            }}>
            Cancel
          </button>
          </div>
              </form>
            }
            </> : <></>}
            <h1 className="text-base semism:text-xl text-gray-700 dark:text-gray-400">
              {requestedUser.type}
            </h1>
            {user && r.email ?
            <>
            {
              !editingEmail  ?
              <button onClick={() => setEditingEmail(true)} className="hover:text-white duration-300 transition ease-in-out">
                <h1 className="text-base semism:text-xl text-gray-700 dark:text-gray-400 hover:text-white duration-300 transition ease-in-out">
                  Email: {r.email}
                {editable? "✏️": ""}

                </h1>
              </button> : <form onSubmit={async e => {
                e.preventDefault()
                console.log(user)
                let data = await fetch("/api/changeEmail", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    newEmail,
                    user_id: user.id
                  })
                }).then(res => res.json())
                console.log(data)
                if (data.success) {
                  // Redirect to the new link
                  let copy = r
                  copy.email = newEmail
                  setRequestedUser(copy)
                  setEditingEmail(false)
                } else {
                  console.log(data.error)
                  alert(`Something went wrong, ${data.error}`)
                  setEditingEmail(false)
                }
              }} className="flex flex-col space-y-2">
              <input
            type="text"
            placeholder="Enter your New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border-b-2 outline-none dark:text-white text-black bg-transparent pb-1 mt-2"
          />
          <div className="space-x-2 w-full flex">
          <button
                      className="px-4 py-2 text-white w-min min-w-max bg-blue-600 hover:bg-blue-700 rounded-md duration-200 ease-in-out transition"
           type="submit">
            Submit
          </button>
          <button
            className="px-4 py-2 w-min min-w-max text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 rounded-md duration-200 ease-in-out transition"
            onClick={(e) => {
              setNewEmail(r.email)
              setEditingEmail(false)
            }}>
            Cancel
          </button>
          </div>
              </form>
            }
            </> : <></>}


            {editable ? <LinkChanger link={link} /> : null}
            <br />
            <br />
            { editable ? (
            <button onClick={()=>confirm("Are you sure you want to delete your account?") && deleteProfile()} className=" bg-red-600 rounded-full block px-4 py-2 hover:bg-red-700 text-black">Delete Profile </button>
            ) : null}
            {user ? (
              <>
                {editable ? null : (
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={async () => {
                      // Indicate that a connection/disconnection operation is happening
                      if (connectionLabel == "Connect")
                        setConnectionLabel("Connecting...");
                      else if (connectionLabel == "Disconnect")
                        setConnectionLabel("Disconnecting...");
                      else return;

                      let data = await fetch("/api/toggleConnection", {
                        method: "POST",
                        body: JSON.stringify({
                          user_id: requestedUser.user_id,
                        }),
                      });
                      data = await data.json();
                      if (data.success) {
                        setConnections(() => data.connections);
                        setDepth(() => data.newDepth);
                        // Indicate that the operation is complete
                        setConnectionLabel(
                          data.connections[0]?.includes(user?.id)
                            ? "Disconnect"
                            : "Connect"
                        );
                      } else {
                        // If the operation fails, reset the button's label
                        setConnectionLabel(
                          connections[0]?.includes(user?.id)
                            ? "Disconnect"
                            : "Connect"
                        );
                      }
                    }}
                  >
                    {connectionLabel}
                  </button>
                )}
              </>
            ) : null}
            {editable || requestedUser.sections?.about ? (
              <AboutSection
                about={requestedUser.sections?.about}
                onSave={handleAboutSave}
                setRequestedUser={setRequestedUser}
                editable={editable}
                otherSections={requestedUser.sections}
                name={requestedUser.username}
              />
            ) : null}

            {!user ? (
              <h1 className="text-red-600 font-semibold">Log in to view more details</h1>
            ) : null}
            {user
              ? sections
                  .filter(
                    (s) =>
                      requestedUser.sections[s].length > 0 ||
                      requestedUser.user_id == user?.id
                  )
                  .map((section) => (
                    <div
                      className="w-full p-4 group mt-4 border-gray-500 border-b"
                      key={section}
                    >

                    <div className="flex items-stretch"></div>



                      <h2 className="py-12 text-base md:text-xl text-black dark:text-white duration-300 ease-in-out transition font-semiboldmb-2">
                        {section.charAt(0).toUpperCase() +
                          section.slice(1, section.length)}
                      </h2>
                      <UserInfo
                        type={section}
                        user={user}
                        requestedUser={requestedUser}
                        section={section}
                        setRequestedUser={setRequestedUser}
                      />
                    </div>
                  ))
              : null}
          </>
        ) : (
          <>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white pt-5 ">
              {error ?? "Unexpected Error"}
            </h1>
            <Link
              href="/"
              className="text-xl text-gray-900 dark:text-white mt-2 mb-4 bg-blue-200 p-2 rounded-sm dark:bg-blue-800"
            >
              Return to home page
            </Link>
            <div className="h-screen w-full bg-white dark:bg-gray-700"></div>
          </>
        )}
      </main>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
  params,
}) {
  // Get id param of dynamic route
  // ex: /profile/1
  const id = params.id;
  const request = await getUserFromProfileId(id);
  const requestedUser = request.user;
  if (request.error) {
    return {
      props: {
        user: req.session?.user ?? null,
        requestedUser: null,
        depth: 0,
        connections: [[], []],
        link: id,
        pfp: null,
        error: request.error,
      },
    };
  }
  let depth = 0;
  let connections = [];
  let connected = false;
  if (requestedUser && req.session?.user) {
    connected = requestedUser.connections?.includes(req.session?.user?.id);
    if (connected) depth = 1;
    if (
      !connected &&
      req.session?.user &&
      req.session?.user?.id != requestedUser?.user_id
    ) {
      // Find connection depth
      depth = await findConnectionDepth(
        req.session?.user?.id,
        requestedUser?.user_id
      );
    }
  }
  if (requestedUser)
    connections.push(
      await fetchConnections(requestedUser?.user_id, 1),
      await fetchConnections(requestedUser?.user_id, 2)
    );

  if (requestedUser && !(requestedUser?.user_id == req.session?.user?.id)) {
    // Increment view count
    let view = true;
    // try {
    //   await limiter.check(res, 2, "viewUser"+requestedUser?.user_id, req)
    //   } catch(e) {
    //     console.log("ratelimited", e);
    //     view = false
    //   }
    if (view) {
      try {
        incrementUserViews(requestedUser?.user_id);
        increaseViewCountMongo(requestedUser?.user_id);
      } catch (e) {
        console.log(e);
      }
    }
  }
  let pfp;
  let banner;
  if (requestedUser) {
    const data = await getUserFromMongo(requestedUser?.user_id);
    if (!data.username) {
      await updateUserMongo(requestedUser?.user_id, {
        username: requestedUser.username,
      });
    }
    pfp = data.pfp;
    banner = data.banner;
    // banner = await getUserBanner(requestedUser?.user_id, "banner");
  }

  function getGravatarHash(email) {
    email = email.trim().toLowerCase();
    return md5(email);
  }

  let safeRequestedUser;
  if (requestedUser)
    safeRequestedUser = {
      ...requestedUser,
      salt: null,
      key: null,
      email: req.session.user?.id == requestedUser.user_id ? requestedUser.email : null,
      hashedEmail: getGravatarHash(requestedUser.email),
    };

  return {
    props: {
      user: req.session?.user ?? null,
      requestedUser: safeRequestedUser ?? null,
      depth: depth ?? 0,
      connections: connections ?? [[], []],
      link: id,
      pfp: pfp ?? null,
      banner: banner ?? null,
    },
  };
},
ironOptions);
