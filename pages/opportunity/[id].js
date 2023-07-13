import Head from "next/head"
import Navbar from "@/components/navbar"
import { withIronSessionSsr } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { getOpportunity } from "@/utils/api"
import { useState } from "react"
import { marked } from "marked"
import Link from "next/link"

export default function Opportunity({user, opportunity}) {
    const [views, setViews] = useState(opportunity?.views)
    const [sessions, setSessions] = useState(0)
    return (
        <>
            <div>
                <Head></Head>
                <Navbar user={user}></Navbar>
            </div>
            {!opportunity ? (
                <div className="w-full h-full items-center justify-center">
                    <p className="text-5xl text-white">Opportunity not found</p>
                    <Link href="/opportunities" className="text-2xl text-white">Go back</Link>

                </div>
            ) : (
            <main className="w-5/6 mx-auto mt-6">
                <p className="text-5xl text-center font-bold text-white">
                    {opportunity.title}
                </p>
                <p className="flex text-white text-lg w-min min-w-max mx-auto space-x-2">
                    <div><span className="text-gray-600">Views: </span> {views}</div>
                    <div><span className="text-gray-600">Active Sessions: </span> {sessions}</div>
                </p>
                <p className="text-gray-600 font-bold text-xl text-center mt-4">Contents:</p>
                <p dangerouslySetInnerHTML={{__html: marked(opportunity.contents)}} className="text-lg text-center text-white">
                </p>
            </main>
            )}
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

    let opportunityReq = await getOpportunity(params.id);
    let opportunity = opportunityReq.opportunity;
    console.log("Opportunity: ", opportunity)
    console.log(`Opportunities ID: ${params.id}`)
    // const window = new JSDOM('').window
    // const DOMPurify = createDOMPurify(window)
    // opportunity.contents = DOMPurify.sanitize(marked(opportunity.contents))
    return { props: { user: req.session.user ?? null, opportunity: opportunity ?? null }}
}, ironOptions)