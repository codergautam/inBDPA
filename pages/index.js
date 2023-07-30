import Head from "next/head";
import Navbar from "@/components/navbar";
import Main from "@/components/HomeMain";
import { getUserCount, getUserFromMongo } from "@/utils/api";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import LoggedInHome from "@/components/HomeLoggedIn";

export default function Home({count, user}) {
  return (
    <div className="text-black bg-gray-50 dark:bg-gray-900 flex flex-col min-h-screen">
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
  let user;
  if(req.session.user) {
    user = await getUserFromMongo(req.session.user.id);
    if(user && user.link && user.type) {
    req.session.user.link = user.link;
    req.session.user.type = user.type;
    req.session.user.pfp  = user.pfp;
    await req.session.save()
    }
  }

  return {
    props: { user: req.session.user ?? null, count: userCount },
  };
}, ironOptions);
