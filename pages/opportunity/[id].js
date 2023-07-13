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
import dynamic from "next/dynamic";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
);


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
      router.reload()
      return
    } else {
      alert("Failed to delete opportunity...")
    }
  }

export default function Opportunity({user, opportunity, activeSessions}) {
    const router = useRouter()

    const [views, setViews] = useState(opportunity.views)
    const [active, setActive] = useState(activeSessions)
    const [editingOpportunity, setEditingOpportunity] = useState(null)
    const [value, setValue] = useState("");
    const [title, setTitle] = useState("")

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
        alert("Deleting Opportunity")
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
          <Modal
            isOpen={editingOpportunity}
            contentLabel="Create Opportunity"
          >
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setEditingOpportunity(false)}>Close</button>
              <div className='flex flex-col mt-8'>
                <label htmlFor="" className="text-3xl font-bold text-black">Title:</label>
                <input onChange={e => setTitle(e.target.value)} value={title} type="text" className='mb-4 outline-none text-black border-b-2 w-1/2' />
              </div>
              <MDEditor className='mt-4' value={value} onChange={setValue} height={"90%"}/>
              <button className="bg-amber-500 hover:bg-orange-500 transition duration-300 ease-in-out text-white font-bold py-2 px-4 rounded mt-2" onClick={editOpportunity}>Complete Edits</button>
            </Modal>
                <p className="text-5xl text-center font-bold text-white">
                    {opportunity.title}
                </p>
                <p className="flex text-white text-lg w-min min-w-max mx-auto mt-2 space-x-2">
                    <div><span className="text-gray-600">Views: </span> {views}</div>
                    <div><span className="text-gray-600">Active Viewers: </span> {active}</div>
                </p>
                {opportunity.creator_id == user.id ? <>
                <div className='flex space-x-2 mt-2 mx-auto w-min min-w-max'>
                  <span onClick={()=>deleteOpportunity(opportunity.opportunity_id)} className="cursor-pointer rounded flex bg-red-500 hover:bg-rose-500 p-1 transition duration-300 ease-in-out">
                      Delete <FontAwesomeIcon className="text-white w-4 h-4 my-auto ml-1" icon={faTrash} />
                  </span>
                  <span onClick={()=>{
                    setEditingOpportunity(opportunity)
                    setTitle(opportunity.title)
                    setValue(opportunity.contents)
                  }} className="cursor-pointer rounded flex bg-orange-400 hover:bg-amber-500 p-1 transition duration-300 ease-in-out">
                      Edit <FontAwesomeIcon className="text-white w-4 h-4 my-auto ml-1" icon={faPenNib} />
                  </span>
                </div>
                </> : <></>}
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