import Head from 'next/head';
import Navbar from '@/components/navbar';
import { useState, useEffect, useRef } from 'react';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '@/utils/ironConfig';
import { getUserFromMongo } from '@/utils/api';
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

export default function Page({ user }) {
  const router = useRouter();
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [title, setTitle] = useState("");
  const [creatingOpportunity, setCreatingOpportunity] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(false);
  const [value, setValue] = useState("");
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(false);
  const lastOppRef = useRef(null);



const loadOpportunities = async (first=false) => {

  if(!lastOppRef.current &&!first) return;
  setLoading(true);

  console.trace("loading opportunities", lastOppRef.current)
  let data = await fetch("/api/opportunities/getOpportunities", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      opportunity_id: lastOppRef.current
    })
  }).then(res => res.json());

  if (data.success) {
    let newOpps = data.opportunities;
    setOpps(prevOpps => [...prevOpps, ...newOpps]);
    lastOppRef.current = newOpps[newOpps.length - 1]?.opportunity_id;
  } else {
    alert("Failed to load opportunities...");
  }
  setLoading(false);
};

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const handleScroll = debounce(() => {
  if (
    window.innerHeight + document.documentElement.scrollTop >=
    document.documentElement.offsetHeight - 1
  ) {
    loadOpportunities();
  }
}, 100);

useEffect(() => {
  loadOpportunities(true);
  window.addEventListener('scroll', () => {
    setLoading(true)
    handleScroll();
  });
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);



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

    if (data.success) {
      alert("Created a new opportunity!");
      router.reload();
    } else {
      alert("Failed to create a new opportunity...");
    }

    setCreatingOpportunity(false);
    setValue("");
    setTitle("");
    setSelectedOpportunity(null);
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

    if (data.success) {
      router.reload();
    } else {
      alert("Failed to delete opportunity...");
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

    if (data.success) {
      alert("Successfully edited opportunity!");
      router.reload();
    } else {
      alert("Failed to edit this opportunity...");
    }

    setValue("");
    setEditingOpportunity(null);
    setTitle("");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      <Head>
        <title>inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <Navbar user={user} />
      </div>

      <main className="container px-5 py-24 mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-12 text-center">Opportunities</h2>

        {user.type === "staff" || user.type === "administrator" ? (
          <div className="flex justify-center">
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded mt-2 hover:bg-blue-700 transition duration-300 ease-in-out mb-8"
              onClick={() => setCreatingOpportunity(true)}
            >
              Create Opportunity
            </button>
          </div>
        ) : null}

        <Modal
          isOpen={creatingOpportunity}
          contentLabel="Create Opportunity"
        >
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setCreatingOpportunity(false)}>Close</button>
          <div className='flex flex-col mt-8'>
            <label htmlFor="" className="text-3xl font-bold text-black">Title:</label>
            <input onChange={e => setTitle(e.target.value)} value={title} type="text" className='mb-4 outline-none text-black border-b-2 w-1/2' />
          </div>
          <MDEditor className='mt-4' value={value} onChange={setValue} height={"90%"} />
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
          <MDEditor className='mt-4' value={value} onChange={setValue} height={"90%"} />
          <button className="bg-amber-500 hover:bg-orange-500 transition duration-300 ease-in-out text-white font-bold py-2 px-4 rounded mt-2" onClick={editOpportunity}>Complete Edits</button>
        </Modal>

        <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto items-center">
          {opps.map((opportunity, i) => (
            <div className="rounded-lg overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700 p-6" key={opportunity.opportunity_id}>
              <Opportunity i={i} opportunity={opportunity} selected={selectedOpportunity} />

              {user.id === opportunity.creator_id ? (
                <div className='flex justify-between mt-4'>
                  <button
                    onClick={() => deleteOpportunity(opportunity.opportunity_id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-all ease-in-out"
                  >
                    Delete
                    <FontAwesomeIcon className="text-white w-4 h-4 inline ml-2" icon={faTrash} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingOpportunity(opportunity);
                      setTitle(opportunity.title);
                      setValue(opportunity.contents);
                    }}
                    className="bg-orange-400 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-full transition-all ease-in-out"
                  >
                    Edit
                    <FontAwesomeIcon className="text-white w-4 h-4 inline ml-2" icon={faPenNib} />
                  </button>
                </div>
              ) : null}
            </div>
          ))}
          {loading ? (
  <div className="flex justify-center items-center h-10">
    <span className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 dark:border-white"></span>
  </div>
) : null}
        </div>

      </main>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
  params
}) {
  if (!req.session.user) {
    return {
      redirect: {
        destination: '/auth/login?error=You must be logged in to view this page.',
        permanent: false
      },
      props: {}
    }
  }

  let type = (await getUserFromMongo(req.session.user.id)).type;
  req.session.user.type = type;

  return {
    props: { user: req.session.user ?? null },
  };
}, ironOptions);
