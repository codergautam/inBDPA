// pages/index.js
// This code is for the index page of the inBDPA website. It imports necessary components and functions, and exports a function component called `Home` that renders the content of the page. The `Home` component receives `count` and `user` as props.
//
// The page starts with a `div` element with a class name and some CSS styles. It contains a `Head` component that sets the page title and favicon. It also includes a `Navbar` component, which displays the navigation bar based on the user's login status. If the user is logged in, it renders a `LoggedInHome` component, otherwise, it renders a `Main` component.
//
// The code also includes a `getServerSideProps` function, which is a Next.js API route that runs during server-side rendering. It retrieves the user count and user data from the server. If the user is logged in and has additional data (link, type, pfp), it updates the user session with this information. The function returns an object with the props to be passed to the `Home` component.
//
// The `withIronSessionSsr` function is a Higher Order Function that provides server-side session management using Iron Session library. It wraps the `getServerSideProps` function to handle session related logic.
//
// Note: The code is lazily written and could benefit from better variable naming and additional comments to improve readability and maintainability.
import Head from "next/head";
import Navbar from "@/components/navbar";
import Main from "@/components/HomeMain";
import { getUserCount, getUserFromMongo } from "@/utils/api";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "@/utils/ironConfig";
import HomeLoggedIn from "@/components/HomeLoggedIn";

export default function Home({count, user}) {
  return (
    <div className="text-black bg-gray-50 dark:bg-gray-900 flex flex-col min-h-screen">
      <Head>
        <title>inBDPA - Home</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar user={user} />
      { user ? <HomeLoggedIn user={user}/> :  <Main count={count}/> }
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
    } else {
      // Log em out
      req.session.destroy()
      return {props:{user: null, count: userCount}};
    }
  }

  return {
    props: { user: req.session.user ?? null, count: userCount },
  };
}, ironOptions);
