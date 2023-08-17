// components/Stats.js
// This file contains the code for the Stats component. The Stats component is responsible for fetching data from the "/api/info" endpoint and displaying various statistics about the platform. It makes use of the useState, useEffect, useRef, and fetch functions from React. The component also includes a StatItem component that is used to display individual statistics. The component fetches data from the "/api/info" endpoint and updates the state variables with the fetched data. It also sets up an interval to fetch data every 30 seconds. The fetched data is then displayed using the StatItem component.
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { list } from "postcss";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

async function getInfoData() {
  let data = await fetch("/api/info").then((res) => res.json());
  return data;
}
function numberWithCommas(x) {
  return x.toLocaleString();
}


export default function Stats() {
  const [users, setUsers] = useState("...");
  const [totalViews, setTotalViews] = useState("...");
  const [sessionCount, setSessionCount] = useState("...");
  const [sessions, setSessions] = useState([])
  const [opportunities, setOpportunities] = useState("...");
  const [articles, setArticles] = useState("...");
  const [listOfUsers, setListOfUsers] = useState([])

  const intervalRef = useRef();

  async function dostuff() {
    // setUsers("...");
    // setTotalViews("...");
    // setSessions("...");
    // setOpportunities("...");
    let data = await getInfoData();
    if (data.success) {
      let info = data.info
      setUsers(info.users);
      setTotalViews(info.views);
      setSessionCount(info.sessionCount);
      setSessions(info.sessions)
      setOpportunities(info.opportunities);
      setArticles(info.articles);
      setListOfUsers(info.userList)
    }
  }

  useEffect(() => {
    dostuff();
    intervalRef.current = setInterval(() => {
      dostuff();
    }, 30000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="flex flex-col">
    <div className="flex lg:flex-row justify-center mt-6 mx-auto w-full sm:w-4/5 lg:w-full ">
      <StatItem label="Total Users" value={users} />
      <StatItem label="Total Views on Platform" value={totalViews} />
      <StatItem label="Total Opportunities" value={opportunities} />
      <StatItem label="Total Articles" value={articles} />
    </div>
          <StatItem sessions={JSON.parse(JSON.stringify(sessions))} listOfUsers={JSON.parse(JSON.stringify(listOfUsers))} type={"sessions"} label="Active Sessions" value={sessionCount} />

    </div>
  );
}

function StatItem({ label, listOfUsers, sessions, type, value }) {
  const [open, setOpen] = useState(false)
  const [userList, setUserList] = useState(listOfUsers)
  const [sessionList, setSessionList] = useState(sessions)
  const [filteredResults, setFilteredResults] = useState(listOfUsers)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [sessionId, setSessionId] = useState("")
  const [userId, setUserId] = useState("")
  const [auth, setAuth] = useState(0)
  const [view, setView] = useState(0)

  const router = useRouter()
  useEffect(() => {
    setUserList(listOfUsers)
    if(sessions) { //If loaded in
      console.log("has session")
      let updated = sessions.map((session, i) => {
        let matches = matchesQuery(userList[i], session)
        session.matchesQuery = matches
        return session
      })
      console.log(updated)
      setSessionList(updated)
    }
  }, [listOfUsers, sessions])

  const properLink = session => {
    console.log(session)
  }

  const matchesQuery = (user, session) => {
    let authMatch
    if(auth == 0) { //no req
      console.log("No req")
      authMatch = true
    } else if(auth == 1) { //auth must be true req
      console.log("Must be authed")
      authMatch = (user != null && typeof user !== "undefined")
    } else if(auth == 2) { //auth must be false req
      console.log("Don't have to be authed")
      authMatch = (user != null && typeof user !== "undefined")
      authMatch = !authMatch
    }
    let usernameMatch = (user?.username?.indexOf(username.trim()) != -1 || username.trim().length == 0)
    if(username.length > 0) {
      usernameMatch = usernameMatch && (user != null && typeof user !== "undefined")
    }
    let emailMatch = (user?.email?.indexOf(email.trim()) != -1 || email.trim().length == 0)
    if(email.length > 0) {
      emailMatch = emailMatch && (user != null && typeof user !== "undefined")
    }
    let viewMatch = (session.view == view || view == 0 || view == "No Specific View")
    let idMatch = (user?.user_id == userId || userId.trim().length == 0)
    if(userId.length > 0) {
      idMatch = idMatch && (user && typeof user != null !== "undefined")
    }
    console.log("id: ", session.session_id == sessionId)
    let sessionMatch = (session.session_id == sessionId || sessionId.length == 0)
    console.log("Auth: ", authMatch)
    console.log("Username: ", usernameMatch)
    console.log("Email: ", emailMatch)
    console.log("Session: ", sessionMatch)
    console.log("Id: ", idMatch)
    console.log("View: ", viewMatch)
    const res =  authMatch && usernameMatch && emailMatch && idMatch && sessionMatch && viewMatch
    console.log("Ending: ", res)
    console.log("\n\n")
    return res
  }

  useEffect(()=> {
    if(sessionList) { //If loaded in
      console.log("has session")
      let updated = sessionList.map((session, i) => {
        let matches = matchesQuery(userList[i], session)
        session.matchesQuery = matches
        return session
      })
      setSessionList(updated)
    }
  }, [username, email, auth, view, userId])

  const views = [
    "home", 
    "profile",
    "opportunity",
    "auth",
    "article",
    "admin"
  ]

  return (
    <div className="text-center h-min min-h-max m-4 flex flex-col items-center justify-center dark:bg-gray-700 rounded-lg shadow-none bg-white border-2 dark:border-none dark:shadow-md p-4 transition-all duration-300 transform hover:scale-105">
      {
        type != "sessions" ? <>
        <p className="text-center font-semibold text-black dark:font-semibold dark:text-white text-md lg:text-lg xl:text-xl mb-2">
          {label}:
        </p>
        <p className="text-center font-bold text-base sm:text-lg lg:text-2xl text-black dark:text-white">
          {numberWithCommas(value)}
        </p></>:  <div className="flex">
      <p className="text-center mx-auto font-semibold text-black dark:font-semibold dark:text-white text-md lg:text-lg xl:text-xl mb-2">
        {label}:<span className="ml-1 text-gray-400">{numberWithCommas(value)}</span>
      </p></div>
      }
      {
        type == "sessions" && value != "..." ? 
        <>
          <button onClick={() => setOpen(!open)} className="text-center hover:text-white duration-300 ease-in-out transition flex font-bold text-sm sm:text-base lg:text-lg text-black dark:text-gray-500">
            {!open ?  <>
              View Sessions
              <FontAwesomeIcon className="w-4 h-4 my-auto ml-2" icon={faArrowDown}></FontAwesomeIcon>
            </> : <>
              Close List
              <FontAwesomeIcon className="w-4 h-4 my-auto ml-2" icon={faArrowUp}></FontAwesomeIcon>
            </> }
          </button>
          {
            open && sessionList.length > 0 ? 
            <div className="flex w-full gap-2">
            <div className="flex w-3/4 px-2 overflow-y-auto max-h-52 flex-col space-y-2">
              {
                sessionList.map((session, i) => (
                  <div className={`flex ${session.matchesQuery ? "opacity-100" : "opacity-20"} text-start bg-gray-600 rounded`}>
                    <div className="flex-col w-11/12 px-2 py-1">
                      {
                        userList[i] ?
                        <>
                        <p className="flex">
                        <Link href={`/profile/${userList[i].link}`} className={`text-base no-underline pb-0 hover:text-blue-500 transition duration-300 ease-in-out text-white group font-bold cursor-pointer`}>
                          {userList[i].username}, <span className="font-normal">{userList[i].email}</span>
                        </Link>
                        </p>
                        </>:
                        <span className={`text-base cursor-default text-gray-400 font-semibold`}>
                          A Guest
                        </span>
                      }
                      <Link className="group" href={session.link}>
                      <p className="text-xs group-hover:text-blue-500 transition duration-300 ease-in-out text-gray-400 font-semibold">
                        {session.view} view
                      </p>
                      <p className="text-xs group-hover:text-blue-500 transition duration-300 ease-in-out text-gray-400 font-semibold">
                        {session.message}
                      </p>
                      </Link>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="flex w-1/4 mb-4 flex-col space-y-1">
              <p className="text-center font-semibold text-black dark:font-semibold dark:text-white text-md lg:text-lg xl:text-xl mb-2">
                Queries:
              </p>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username..." className="bg-transparent outline-none border-b-2 pb-0.5 border-gray-400" />
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email..." className="bg-transparent outline-none border-b-2 pb-0.5 border-gray-400" />
              <input type="text" value={sessionId} onChange={(e) => setSessionId(e.target.value)} placeholder="Session Id..." className="bg-transparent outline-none border-b-2 pb-0.5 border-gray-400" />
              <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User Id..." className="bg-transparent outline-none border-b-2 pb-0.5 border-gray-400" />
              <select value={auth} onChange={(e) => setAuth(e.target.value)} name="" id="" className="bg-transparent outline-none border-b-2 pb-0.5 text-white border-gray-400" >
                <option className="text-black" value={0}>Doesn't Matter</option>
                <option className="text-black" value={1}>Authenticated</option>
                <option className="text-black" value={2}>Unauthenticated</option>
              </select>
              <select value={view} onChange={(e) => setView(e.target.value)} name="" id="" className="bg-transparent outline-none border-b-2 pb-0.5 text-white border-gray-400" >
                <option className="text-black" value={null}>No Specific View</option>
                {views.map((view) => (
                    <option className="text-black" value={view}>{view}</option>
                ))}
              </select>
            </div>
            </div> : <></>
          }
        </> : <></>
      }
    </div>
  );
}
