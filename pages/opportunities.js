import Head from 'next/head'
import Navbar from '@/components/navbar';
import UserStats from '@/components/UserStats';



import { useEffect, useState } from 'react';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '@/utils/ironConfig';
import UserInfo from '@/components/UserInfo';
import { getOpportunities } from '@/utils/api';
import Modal from 'react-modal';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import Opportunity from '@/components/Opportunity';
import { useRouter } from 'next/router';

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

// THIS PAGE DOESNT HAVE PAGINATION YET!
// TODO: ADD PAGINATION TO THIS PAGE

export default function Page({ user, opportunities }) {
  const router = useRouter()
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [title, setTitle] = useState("")
  const [creatingOpportunity, setCreatingOpportunity] = useState(false);
  const [value, setValue] = useState("");


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
      // setSelectedOpportunity(null)
    }
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
        <div className="mx-auto w-1/2">
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
            <div className="mr-auto space-y-2 w-1/2">
            {opportunities.map((opportunity) => (
              <Opportunity key={opportunity.opportunity_id} opportunity={opportunity} selected={selectedOpportunity} />
            ))}
            </div>
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
  opportunities = opportunities.sort((a,b) => -(a.createdAt - b.createdAt)) //Arrange so that the most recent are first
  return {
    props: { user: req.session.user ?? null, opportunities },
  };
},
ironOptions);