import Head from "next/head"
import Navbar from "@/components/navbar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faPenNib } from "@fortawesome/free-solid-svg-icons"
import { withIronSessionSsr } from "iron-session/next"
import { ironOptions } from "@/utils/ironConfig"
import { countSessionsForOpportunity, getOpportunity, incrementOpportunityViews } from "@/utils/api"
import { useEffect, useRef, useState } from "react"
import { marked } from "marked"
import { useRouter } from "next/router"
import Modal from 'react-modal';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import Link from "next/link"

import OpportunityForm from "@/components/OpportunityForm"


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
    const router = useRouter()

    const [views, setViews] = useState(opportunity?.views)
    const [active, setActive] = useState(activeSessions)
    const [editingOpportunity, setEditingOpportunity] = useState(null)
    const [value, setValue] = useState("");
    const [title, setTitle] = useState("")
    const [parsedContent, setParsedContent] = useState("");


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

    useEffect(() => {
      const parsed = marked(opportunity?.contents ?? "",  {gfm: true, breaks: true});
      setParsedContent(parsed);
    }, [opportunity?.contents]);


    const deleteOpportunity = async (opportunity_id) => {
      let data = await fetch("/api/opportunities/deleteOpportunity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          opportunity_id
        })
      }).then(res => res.json());
      if(data.success) {
        alert("Deleted Opportunity!")
        router.push("/opportunities")
        return
      } else {
        alert("Failed to delete opportunity...")
      }
    }

    const editOpportunity = async () => {
      let data = await fetch("/api/opportunities/editOpportunity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          opportunity_id: editingOpportunity.opportunity_id,
          title: title,
          contents: value
        })
      }).then(res => res.json())
      if(data.success) {
        alert("Successfully edited opportunity!")
        router.reload()
        return
      } else {
        alert("Failed to edit this opportunity...")
        setValue("")
        setEditingOpportunity(null)
        setTitle("")
        // setSelectedOpportunity(null)
      }
      console.log("Editing: " + opportunity_id)
    }


    return (
      <section className="text-black bg-white dark:bg-gray-800 flex flex-col min-h-screen">
  <div className="bg-gray-100 dark:bg-gray-800">
    <Head></Head>
    <Navbar user={user}></Navbar>
    </div>

        {!opportunity ? (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
          <p className="text-4xl text-gray-800 dark:text-white font-bold mb-8">Opportunity not found</p>
          <Link
            href="/opportunities"
            className="text-lg text-gray-800 dark:text-white font-semibold py-2 px-6 bg-blue-500 hover:bg-blue-600 rounded transition duration-200 ease-in-out"
          >
            Go back
          </Link>
        </div>

        ) : (
          <main className="w-5/6 mx-auto mt-6 bg-white dark:bg-gray-800 rounded-lg p-8">
<div className="sm:flex sm:justify-center lg:inline-block pb-0 sm:pb-5 ">
  <Link
    href="/opportunities"
    className="inline-block align-middle py-2 px-4 bg-transparent text-gray-800 font-bold rounded outline-none border border-gray-800 hover:bg-gray-200  transition duration-200 ease-in-out mt-4 dark:text-gray-200 dark:border-gray-200 dark:hover:bg-gray-600"
  >
    Back to All Opportunities
  </Link>
</div>
            <Modal
              isOpen={editingOpportunity}
              contentLabel="Create Opportunity"
            >
              <OpportunityForm title={title} setTitle={setTitle} value={value} setValue={setValue} handleFormSubmit={editOpportunity} handleClose={() => setEditingOpportunity(null)} editingOpportunity={true} />
            </Modal>
            <div className="bg-gray-100 dark:bg-gray-700 p-12 rounded-md">
            <p className="text-5xl text-center font-bold text-gray-800 dark:text-white">
              {opportunity.title}
            </p>
            <p className="flex text-gray-600 dark:text-gray-100 text-lg w-min min-w-max mx-auto mt-2 space-x-2">
  <span className="inline-flex items-center px-2.5 py-1.5 bg-gray-200 dark:bg-gray-800 text-sm font-medium text-gray-800 dark:text-gray-200 rounded">
   Views: {views}
  </span>
  <span className="inline-flex items-center px-2.5 py-1.5 bg-gray-200 dark:bg-gray-800 text-sm font-medium text-gray-800 dark:text-gray-200 rounded">
    Active Viewers:  {isNaN(active) ? active : Math.max(active, 1)}

  </span>
</p>

            {opportunity.creator_id == user.id ? (
              <div className='flex space-x-2 mt-2 mx-auto w-min min-w-max'>
                <span onClick={() => deleteOpportunity(opportunity.opportunity_id)} className="cursor-pointer rounded flex bg-red-500 hover:bg-rose-500 p-1 transition duration-300 ease-in-out">
                  Delete <FontAwesomeIcon className="text-white w-4 h-4 my-auto ml-1" icon={faTrash} />
                </span>
                <span onClick={() => {
                  setEditingOpportunity(opportunity)
                  setTitle(opportunity.title)
                  setValue(opportunity.contents)
                }} className="cursor-pointer rounded flex bg-orange-400 hover:bg-amber-500 p-1 transition duration-300 ease-in-out">
                  Edit <FontAwesomeIcon className="text-white w-4 h-4 my-auto ml-1" icon={faPenNib} />
                </span>
              </div>
            ) : null}
            <br/>
            <hr/>
            <div className="text-lg text-gray-800 dark:text-white w-11/12 mx-auto mt-2">
              <div className="markdown-content" dangerouslySetInnerHTML={{ __html: marked(opportunity.contents, {gfm: true, breaks: true}) }}></div>
            </div>
            </div>
          </main>
        )}
        </section>

    );


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
    let opportunity = (await getOpportunity(params.id)).opportunity;
    // const window = new JSDOM('').window
    // const DOMPurify = createDOMPurify(window)
    // opportunity.contents = marked(opportunity.contents)
    return { props: { user: req.session.user ?? null, opportunity: opportunity ?? null, activeSessions: active ?? 0}}
}, ironOptions)