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
                    </div>
            </div>
        </Link>
    )
}