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

  const intervalRef = useRef();

  async function dostuff() {
    console.log("Doing stuff");
    // setUsers("...");
    // setTotalViews("...");
    // setSessions("...");
    // setOpportunities("...");
    let data = await getInfoData();
    if (data.success) {
      console.log();
      setUsers(data.info.users);
      setTotalViews(data.info.views);
      setSessions(data.info.sessions);
      setOpportunities(data.info.opportunities);
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
    <div className="flex flex-col lg:flex-row justify-center mt-6 mx-auto w-full sm:w-4/5 lg:w-3/4 xl:w-1/2">
      <StatItem label="Total Users" value={users} />
      <StatItem label="Active Sessions" value={sessions} />
      <StatItem label="Total Views on Platform" value={totalViews} />
      <StatItem label="Total Opportunities" value={opportunities} />
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="lg:w-1/4 text-center m-4 grow flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md p-4 transition-all duration-500 transform hover:scale-105">
      <p className="text-center text-gray-500 dark:text-gray-200 text-md lg:text-lg xl:text-xl mb-2">
        {label}
      </p>
      <p className="text-center font-bold text-xl sm:text-2xl lg:text-2xl text-blue-600">
        {numberWithCommas(value)}
      </p>
    </div>
  );
}
