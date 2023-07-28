import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenNib, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

async function updateInfo(opportunity_id) {
  console.log("Updating");
  let data = await fetch("/api/opportunities/getOpportunity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      opportunity_id,
    }),
  }).then((res) => res.json());
  console.log(data);
  if (data.opportunity) {
    return { views: data.opportunity.views, active: data.opportunity.active };
  } else {
    return { views: "N/A", active: "N/A" };
  }
}

const Opportunity = ({ opportunity, selected, i, canDelete, user, deleteOpportunity, setEditingOpportunity, setTitle, setValue }) => {

//   useEffect(() => {
//     // Update info
//     const fetchData = async () => {
//       let { views, active } = await updateInfo(opportunity.opportunity_id);
//       setViews(views);
//       setActive(active);
//     };

//     fetchData();
//   }, [opportunity.opportunity_id]);

  function msToTime(duration) {
    const portions = [];
    const msInDay = 1000 * 60 * 60 * 24;
    const days = Math.trunc(duration / msInDay);
    if (days > 0) {
      portions.push(days + "d");
      duration = duration - days * msInDay;
    }

    const msInHour = 1000 * 60 * 60;
    const hours = Math.trunc(duration / msInHour);
    if (hours > 0) {
      portions.push(hours + "h");
      duration = duration - hours * msInHour;
    }

    const msInMinute = 1000 * 60;
    const minutes = Math.trunc(duration / msInMinute);
    if (minutes > 0) {
      portions.push(minutes + "m");
      duration = duration - minutes * msInMinute;
    }

    const seconds = Math.trunc(duration / 1000);
    if (seconds > 0) {
      portions.push(seconds + "s");
    }

    return portions[0];
  }

  return (
    <div className="p-4 mb-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md shadow-lg cursor-pointer  transition duration-200 ease-in-out">
    <Link href={`/opportunity/${opportunity.opportunity_id}`}>

      <p className="text-lg font-semibold overflow-clip">{opportunity.title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-200">
        {msToTime(Date.now() - opportunity.createdAt)} ago
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-200">Views: {opportunity.views}</p>
      <p className="text-sm text-gray-600 dark:text-gray-200 ">
        Active Viewers: {opportunity.active}
      </p>
      </Link>

      {user.id === opportunity.creator_id ? (
                <div className='flex justify-between mt-4'>
                  <button
                    onClick={() => deleteOpportunity(opportunity.opportunity_id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-all ease-in-out"
                  >
                    Delete
                    <FontAwesomeIcon className="text-white w-4 h-4 inline ml-2" icon={faTrash} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingOpportunity(opportunity);
                      setTitle(opportunity.title);
                      console.log(opportunity);
                      setValue(opportunity.content);
                    }}
                    className="bg-orange-400 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-full transition-all ease-in-out"
                  >
                    Edit
                    <FontAwesomeIcon className="text-white w-4 h-4 inline ml-2" icon={faPenNib} />
                  </button>
                </div>
              ) : null}
    </div>
  );
};

export default Opportunity;
