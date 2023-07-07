import Head from 'next/head'
import Navbar from '@/components/Navbar';
import UserStats from '@/components/UserStats';

import UserConnections from '@/components/UserConnections';
import UserViewStatus from '@/components/UserViewStatus';
import UserProfilePicture from '@/components/UserProfilePicture';

import { useEffect, useState } from 'react';
import { withIronSessionSsr } from 'iron-session/next';
import { ironOptions } from '@/utils/ironConfig';
import UserInfo from '@/components/UserInfo';
import { getOpportunities } from '@/utils/api';
import Modal from 'react-modal';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

// THIS PAGE DOESNT HAVE PAGINATION YET!
// TODO: ADD PAGINATION TO THIS PAGE

export default function Page({ user, opportunities }) {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [creatingOpportunity, setCreatingOpportunity] = useState(false);
  const [value, setValue] = useState("");

  const handleOpportunityClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
  };

  return (
    <div className="flex flex-col h-screen dark:bg-black">
      <Head>
        <title>inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full">
        <Navbar user={user} />
      </div>

      <main className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 lg:w-1/4 p-4 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-bold mb-4">Opportunities</h2>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setCreatingOpportunity(true)}>Create Opportunity</button>
          <Modal
            isOpen={creatingOpportunity}
            contentLabel="Create Opportunity"
          >
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => setCreatingOpportunity(false)}>Close</button>
              <MDEditor value={value} onChange={setValue} height={"90%"}/>
            </Modal>
          <ul className="space-y-2">
            {opportunities.map((opportunity) => (
              <li
                key={opportunity.opportunity_id}
                className={`p-2 cursor-pointer ${
                  selectedOpportunity === opportunity
                    ? 'bg-blue-500 text-white'
                    : ''
                }`}
                onClick={() => handleOpportunityClick(opportunity)}
              >
                {opportunity.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-2/3 lg:w-3/4 p-4">
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
            <p className="text-lg">Select an opportunity to view details.</p>
          )}
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

  if(!req.session.user) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      },
      props: {}
    }
  }

  const opportunities = (await getOpportunities()).opportunities;
  console.log(opportunities);
  return {
    props: { user: req.session.user ?? null, opportunities },
  };
},
ironOptions);