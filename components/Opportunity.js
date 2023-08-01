// components/Opportunity.js
// // This file contains the Opportunity component which is responsible for rendering an individual opportunity on the Opportunities page.
// // It takes in various props such as opportunity, selected, i, canDelete, user, deleteOpportunity, setEditingOpportunity, setTitle, and setValue.
// // The component displays the title of the opportunity, its creation time in a relative format, and the number of views and active viewers.
// // If the user is the creator of the opportunity, it also displays buttons for deleting and editing the opportunity.
// // The component uses the msToTime function to convert the duration of the opportunity since its creation into a human-readable format.
// // The updateInfo function is used to fetch additional information about the opportunity from the server, such as the number of views and active viewers.
// // The useEffect hook is commented out, but it can be used to update the views and active state of the opportunity whenever it changes.
// // The component also includes a Link component from the next/link package to link to the individual opportunity page.
// // The Opportunity component is exported as the default export of this module.

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenNib, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import msToTime from "@/utils/msToTime";

async function updateInfo(opportunity_id) {
  let data = await fetch("/api/opportunities/getOpportunity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      opportunity_id,
    }),
  }).then((res) => res.json());
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

  return (
    <Link href={`/opportunity/${opportunity.opportunity_id}`}>

    <div className="p-4 mb-4 bg-gray-200 shadow-none hover:-translate-y-1 dark:bg-gray-700 text-gray-600 dark:text-gray-400  dark:hover:bg-gray-600 rounded-md dark:shadow-xl cursor-pointer transition duration-200 ease-in-out content-normal">


      <p className="text-xl font-semibold overflow-hidden dark:text-gray-300">{opportunity.title}</p>
      <p className="text-xs ml-1">
        {msToTime(Date.now() - opportunity.createdAt)} ago
      </p>
<div className="flex flex-row">
      <p className="text-sm py-1 bg-gray-300 dark:bg-gray-800 font-semibold dark:text-gray-50 w-fit px-2 mt-1 rounded-xl">
        Views: {opportunity.views}</p>
      <p className="text-sm py-1 ml-1 bg-gray-300 dark:bg-gray-800 font-semibold dark:text-gray-50 w-fit px-2 mt-1 rounded-xl">
        Active Viewers: {opportunity.active}</p>
        </div>

      {user.id === opportunity.creator_id ? (
                <div className='flex space-x-2 justify-end mt-4'>
                  <button
                    onClick={() => deleteOpportunity(opportunity.opportunity_id)}
                    className="bg-red-600 hover:bg-red-500 text-red-50 font-bold py-2 px-4 rounded-md transition-all ease-in-out"
                  >
                    Delete
                    <FontAwesomeIcon className="text-white w-4 h-4 inline ml-2" icon={faTrash} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingOpportunity(opportunity);
                      setTitle(opportunity.title);
                      setValue(opportunity.content);
                    }}
                    className="bg-orange-600 hover:bg-orange-500 text-orange-50 font-bold py-2 px-4 rounded-md transition-all ease-in-out"
                  >
                    Edit
                    <FontAwesomeIcon className="text-white w-4 h-4 inline ml-2" icon={faPenNib} />
                  </button>
                </div>
              ) : null}
    </div>
      </Link>
  );
};

export default Opportunity;
