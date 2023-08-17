// components/Stats.js
// This file contains the code for the Stats component. The Stats component is responsible for fetching data from the "/api/info" endpoint and displaying various statistics about the platform. It makes use of the useState, useEffect, useRef, and fetch functions from React. The component also includes a StatItem component that is used to display individual statistics. The component fetches data from the "/api/info" endpoint and updates the state variables with the fetched data. It also sets up an interval to fetch data every 30 seconds. The fetched data is then displayed using the StatItem component.
import { useEffect, useRef, useState } from "react";

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
  const [sessions, setSessions] = useState("...");
  const [opportunities, setOpportunities] = useState("...");
  const [articles, setArticles] = useState("...");

  const intervalRef = useRef();

  async function dostuff() {
    // setUsers("...");
    // setTotalViews("...");
    // setSessions("...");
    // setOpportunities("...");
    let data = await getInfoData();
    if (data.success) {
      setUsers(data.info.users);
      setTotalViews(data.info.views);
      setSessions(data.info.sessions);
      setOpportunities(data.info.opportunities);
      setArticles(data.info.articles);
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
    <div className="flex flex-col lg:flex-row justify-center mt-6 mx-auto w-full sm:w-4/5 lg:w-3/4 ">
      <StatItem label="Total Users" value={users} />
      <StatItem label="Active Sessions" value={sessions} />
      <StatItem label="Total Views on Platform" value={totalViews} />
      <StatItem label="Total Opportunities" value={opportunities} />
      <StatItem label="Total Articles" value={articles} />
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="lg:w-1/4 text-center m-4 grow flex flex-col items-center justify-center dark:bg-gray-700 rounded-lg shadow-none bg-white border-2 dark:border-none dark:shadow-md p-4 transition-all duration-300 transform hover:scale-105">
      <p className="text-center font-semibold text-black dark:font-semibold dark:text-white text-md lg:text-lg xl:text-xl mb-2">
        {label}:
      </p>
      <p className="text-center font-bold text-xl sm:text-2xl lg:text-2xl text-black dark:text-white">
        {numberWithCommas(value)}
      </p>
    </div>
  );
}
