import Head from "next/head";
import Navbar from "@/components/navbar";
import Main from "@/components/HomeMain";
import { getUserCount } from "@/utils/api";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import LoggedInHome from "@/components/HomeLoggedIn";

export default function Home({count, user}) {
  return (
    <div className="text-black bg-black flex flex-col min-h-screen">
      <Head>
        <title>inBDPA - Home</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar user={user} />
      { user ? <LoggedInHome user={user}/> :  <Main count={count}/> }
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(async function ({ req, res }) {
  let userCount = await getUserCount();

  return {
    props: { user: req.session.user ?? null, count: userCount },
  };
}, ironOptions);
