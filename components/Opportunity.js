import Link from "next/link"
import { useState } from "react"

export default function Opportunity({opportunity, selected}) {
    const [activeSessions, setActiveSessions] = useState(0)
    const [totalViews, setTotalViews] = useState(0)

    
    return (
        <Link href={`/opportunity/${opportunity.opportunity_id}`}>
            <div
                key={opportunity.opportunity_id}
                className={`p-2 mt-2 rounded flex flex-col cursor-pointer group hover:bg-blue-500 hover:text-white transition duration-200 ease-in-out`}>
                <p className="text-lg">{opportunity.title}</p>
                <p className="text-base"><span className={`text-gray-500 group-hover:text-blue-300 transition duration-200 ease-in-out`}>Active Sessions: </span>{activeSessions}</p>
                <p className="text-base"><span className={`text-gray-500 group-hover:text-blue-300 transition duration-200 ease-in-out`}>Views: </span>{totalViews}</p>
            </div>
        </Link>
    )
}