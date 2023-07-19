import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenNib, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons"

async function updateInfo(opportunity_id) {
    console.log("Updating")
    let data = await fetch("/api/opportunities/getOpportunity", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            opportunity_id
        })
    }).then(res => res.json())
    console.log(data)
    if(data.opportunity) {
        return {views: data.opportunity.views, active: data.opportunity.active}
    } else {
        return {views: "N/A", active: "N/A"}
    }
}

export default function Opportunity({opportunity, selected, i, canDelete}) {
    const [active, setActive] = useState(0)
    const [views, setViews] = useState(opportunity.views)
    function msToTime(duration) {
        const portions = [];
          const msInDay = 1000 * 60 * 60 * 24;
        const days = Math.trunc(duration / msInDay);
        if (days > 0) {
          portions.push(days + 'd');
          duration = duration - (days * msInDay);
        }

        const msInHour = 1000 * 60 * 60;
        const hours = Math.trunc(duration / msInHour);
        if (hours > 0) {
          portions.push(hours + 'h');
          duration = duration - (hours * msInHour);
        }

        const msInMinute = 1000 * 60;
        const minutes = Math.trunc(duration / msInMinute);
        if (minutes > 0) {
          portions.push(minutes + 'm');
          duration = duration - (minutes * msInMinute);
        }

        const seconds = Math.trunc(duration / 1000);
        if (seconds > 0) {
          portions.push(seconds + 's');
        }

        return portions[0];
      }

    let refreshRef = useRef()

    // useEffect(()=>{
    //     setTimeout(async ()=> {
    //         let { views, active } = await updateInfo(opportunity.opportunity_id).then()
    //         setViews(views)
    //         setActive(active)
    //     }, i * 1000)

    //     // refreshRef.current = setInterval(async ()=> {
    //     //     setTimeout(async ()=> {
    //     //         setViews("...")
    //     //         setActive("...")
    //     //         let { views, active } = await updateInfo(opportunity.opportunity_id)
    //     //         setViews(views)
    //     //         setActive(active)
    //     //     }, i*1500)
    //     // }, 30000)
    //     // return () => clearInterval(refreshRef.current)
    // }, [])


    return (
        <Link href={`/opportunity/${opportunity.opportunity_id}`}>
            <div
                key={opportunity.opportunity_id}
                className={`p-2 rounded flex flex-col cursor-pointer group hover:text-white transition duration-200 ease-in-out`}>
                    <div>
                        <p className="text-lg">{opportunity.title}</p>
                        {/* <p className="text-base"><span className={`text-gray-500 group-hover:text-blue-300 transition duration-200 ease-in-out`}>Active Viewers: </span>{active}</p> */}
                        <p className="text-base"><span className={`text-gray-500 transition duration-200 ease-in-out`}>Views: </span>{views}</p>
                        <p className="text-base"><span className={`text-gray-500 transition duration-200 ease-in-out`}> </span>{msToTime(Date.now() - opportunity.createdAt)} ago</p>
                        <p className="text-base"><span className={`text-gray-500 transition duration-200 ease-in-out`}> </span>{opportunity.active} viewing right now</p>

                    </div>
            </div>
        </Link>
    )
}