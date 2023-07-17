"use client"

import { useEffect, useRef, useState } from "react"

async function getInfoData() {
  let data = await fetch("/api/info").then((res)=> res.json());
  return data;
}

export default function Stats() {
    const [users, setUsers] = useState("...");
    const [totalViews, setTotalViews] = useState("...");
    const [sessions, setSessions] = useState("...");
    const [opportunities, setOpportunities] = useState("...");

    const intervalRef = useRef()

    async function dostuff() {
      console.log("Doing stuff")
      setUsers("...");
        setTotalViews("...");
        setSessions("...");
        setOpportunities("...");
        let data = await getInfoData();
        if(data.success) {
            console.log()
            setUsers(data.info.users);
            setTotalViews(data.info.views);
            setSessions(data.info.sessions);
            setOpportunities(data.info.opportunities);
        }
    }

    useEffect(()=>{
      dostuff()
      intervalRef.current = setInterval(() => {
        // console.log("Bello there")
        dostuff()
      }, 30000)
      return () => clearInterval(intervalRef.current)
    }, [])

    return (
        <div className="flex flex-row justify-between w-1/2 mx-auto mt-6">
          <span>
            <p className="text-gray-500">
              Total Users: <span className="dark:text-white font-bold">{users}</span>
            </p>
          </span>
          <span>
            <p className="text-gray-500">
              Active Sessions: <span className="dark:text-white font-bold">{sessions}</span>
            </p>
          </span>
          <span>
            <p className="text-gray-500">
              Total Views on Platform: <span className="dark:text-white font-bold">{totalViews}</span>
            </p>
          </span>
          <span>
            <p className="text-gray-500">
              Total Opportunities: <span className="dark:text-white font-bold">{opportunities}</span>
            </p>
          </span>
        </div>)
}