import Head from 'next/head'
import Navbar from '@/components/navbar';

import { useState } from 'react';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '@/utils/ironConfig';
import { getInfo, getOpportunities } from '@/utils/api';
import Modal from 'react-modal';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import Opportunity from '@/components/Opportunity';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenNib, faTrash } from '@fortawesome/free-solid-svg-icons';

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

// THIS PAGE DOESNT HAVE PAGINATION YET!
// TODO: ADD PAGINATION TO THIS PAGE

export default function Page({ user, opportunities, remainingOpps, lastOppId }) {
  const router = useRouter()
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [title, setTitle] = useState("")
  const [creatingOpportunity, setCreatingOpportunity] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null)
  const [remaining, setRemaining] = useState(remainingOpps)
  const [lastOpp, setLastOpp] = useState(lastOppId)
  const [value, setValue] = useState("");
  const [opps, setOpps] = useState(opportunities)
  console.log(`User Id: `, user)

  const makeNewOpportunity = async () => {
    let data = await fetch("/api/opportunities/createOpportunity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        contents: value
      })
    }).then(res => res.json())
    if(data.success) {
      alert("Created a new opportunity!")
      router.reload()
      return
    } else {
      alert("Failed to create a new opportunity...")
      setCreatingOpportunity(false)
      setValue("")
      setTitle("")
      setSelectedOpportunity(null)
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

  const loadMore = async () => {
    let data = await fetch("/api/opportunities/getOpportunities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        opportunity_id: lastOpp
      })
    }).then(res => res.json())
    let newOpps = data.opportunities
    console.log("Additional Opportunities: ", newOpps)
    let list = [...opps, ...newOpps]
    // list = list.sort((a,b) => -(a.createdAt - b.createdAt)) //Arrange so that the most recent are first
    setOpps(list)
    setLastOpp(newOpps[newOpps.length-1].opportunity_id)
    setRemaining(remaining - newOpps.length)
  }

  return (
    <div className="flex flex-col  dark:bg-black">
      <Head>
        <title>inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full">
        <Navbar user={user} />
      </div>

      <main className="flex flex-col md:flex-row gap-2 px-4">
        <div className="mx-auto w-1/2 mt-8 mb-8">
          <h2 className="text-7xl font-bold mb-4">Opportunities:</h2>
          {user.type == "staff" || user.type == "administrator" ?
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 hover:bg-blue-700 transition duration-300 ease-in-out" onClick={() => setCreatingOpportunity(true)}>Create Opportunity</button>
          : <></>}
          <Modal
            isOpen={creatingOpportunity}
            contentLabel="Create Opportunity"
          >
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setCreatingOpportunity(false)}>Close</button>
              <div className='flex flex-col mt-8'>
                <label htmlFor="" className="text-3xl font-bold text-black">Title:</label>
                <input onChange={e => setTitle(e.target.value)} value={title} type="text" className='mb-4 outline-none text-black border-b-2 w-1/2' />
              </div>
              <MDEditor className='mt-4' value={value} onChange={setValue} height={"90%"}/>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={makeNewOpportunity}>Create Opportunity</button>
            </Modal>

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
            <div className="mr-auto space-y-8 w-1/2 pt-4">
            {opps.map((opportunity, i) => (
              <div className="flex flex-col" key={opportunity.opportunity_id}>
              <Opportunity i={i}  opportunity={opportunity} selected={selectedOpportunity} />
              {user.id == opportunity.creator_id ? <div className='flex space-x-2 mt-2'>
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
               : <></>}
               </div>
            ))}
            </div>
            {
              remaining > 0 ?
              <div onClick={loadMore} className="px-4 cursor-pointer py-2 hover:bg-gray-800 transition duration-300 ease-in-out bg-gray-900 text-white rounded w-min min-w-max mt-6 mr-auto">
                Load More
              </div> : <></>
            }
        </div>

        {/* Mini Display has been subsituted for a dynamic page
        <div className='w-2/3'>
          {selectedOpportunity ? (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {selectedOpportunity.title}
              </h2>
              <div
                className="mb-4"
                dangerouslySetInnerHTML={{
                  __html: selectedOpportunity.contents,
                }}
              ></div>
              <div>
              </div>
            </div>
          ) : (
            <p className="text-lg text-start mt-4">Select an opportunity to view details.</p>
          )}
        </div> */}
      </main>
      </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
  params
}) {

  if(!req.session.user) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      },
      props: {}
    }
  }

  let opportunities = (await getOpportunities()).opportunities;
  let info = (await getInfo()).info
  let opportunityCount = info.opportunities;
  opportunityCount -= 100; //Because we recieve 50 opportunities
  let lastOppId = opportunities[opportunities.length - 1].opportunity_id
  console.log(`Last Opportunity ID: ${lastOppId}`)
  opportunities = opportunities.sort((a,b) => -(a.createdAt - b.createdAt)) //Arrange so that the most recent are first
  console.log(info)
  // console.log("Opportunities (1-3): ", opportunities.slice(0,3))
  return {
    props: { user: req.session.user ?? null, opportunities, remainingOpps: opportunityCount, lastOppId },
  };
},
ironOptions);