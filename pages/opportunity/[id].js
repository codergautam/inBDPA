import Head from "next/head"
import Navbar from "@/components/navbar"
import { withIronSessionSsr } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { countSessionsForOpportunity, getOpportunity, incrementOpportunityViews } from "@/utils/api"
import { useEffect, useRef, useState } from "react"
import { marked } from "marked"

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
export default function Opportunity({user, opportunity, activeSessions}) {
    const [views, setViews] = useState(opportunity.views)
    const [active, setActive] = useState(activeSessions)

    let refreshRef = useRef()

    useEffect(()=>{
        refreshRef.current = setInterval(async ()=> {
            setViews("...")
            setActive("...")
            let { views, active } = await updateInfo(opportunity.opportunity_id)
            setViews(views)
            setActive(active)
        }, 5000)
        return () => clearInterval(refreshRef.current)
    }, [])

    return (
        <>
            <div>
                <Head></Head>
                <Navbar user={user}></Navbar>
            </div>
            <main className="w-5/6 mx-auto mt-6">
                <p className="text-5xl text-center font-bold text-white">
                    {opportunity.title}
                </p>
                <p className="flex text-white text-lg w-min min-w-max mx-auto space-x-2">
                    <div><span className="text-gray-600">Views: </span> {views}</div>
                    <div><span className="text-gray-600">Active Viewers: </span> {active}</div>
                </p>
                <p className="text-gray-600 font-bold text-xl text-center mt-4">Contents:</p>
                <p dangerouslySetInnerHTML={{__html: marked(opportunity.contents)}} className="text-lg text-center text-white">
                </p>
            </main>
        </>
    )
}

export const getServerSideProps = withIronSessionSsr(async ({
    req,
    res,
    params
}) => {

    if(!req.session.user) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false
        },
        props: {}
      }
    }

    try {
        await incrementOpportunityViews(params.id)
    } catch (error) {
        console.log(`Error incrementing views on Opportity ${params.id}: ${error} `)
    }
    let active = (await countSessionsForOpportunity(params.id)).active
    console.log(`Active Sessions: ${active}`)
    let opportunity = (await getOpportunity(params.id)).opportunity;
    console.log("Opportunity: ", opportunity)
    console.log(`Opportunities ID: ${params.id}`)
    // const window = new JSDOM('').window
    // const DOMPurify = createDOMPurify(window)
    // opportunity.contents = DOMPurify.sanitize(marked(opportunity.contents)) 
    return { props: { user: req.session.user ?? null, opportunity: opportunity ?? null, activeSessions: active ?? 0}}
}, ironOptions)