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
  const router = useRouter()
  useEffect(() => {
    setUserList(listOfUsers)
    setSessionList(sessions)
  }, [listOfUsers, sessions])

  const properLink = session => {
  }

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
            <div className="flex px-2 overflow-y-auto max-h-52 w-full flex-col space-y-2">
              {
                sessionList.map((session, i) => (
                  <div className="flex text-start bg-gray-600 rounded">
                    <div className="flex-col w-11/12 px-2 py-1">
                      {
                        userList[i] ?
                        <p className="inline">
                        <Link href={`/profile/${userList[i].link}`} className={`text-base no-underline pb-0 hover:text-blue-500 transition duration-300 ease-in-out text-white group font-bold cursor-pointer`}>
                          {userList[i].username}
                        </Link>
                        </p>:
                        <span className={`text-base cursor-default text-gray-400 font-semibold`}>
                          A Guest
                        </span>
                      }
                      <p className="text-xs text-gray-400 font-semibold">
                        {session.view} view
                      </p>
                      <p className="text-xs text-gray-400 font-semibold">
                        {session.message}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div> : <></>
          }
        </> : <></>
      }
    </div>
  );
}
