import { getRequestCookie } from "@/utils/getRequestCookie";
import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";
import Navbar from "@/components/navbar";
import { getUserFromProfileId } from "@/utils/api";
import Stats from "@/components/Stats";
import UserCreation from "@/components/UserCreation";
import UserSearch from "@/components/UserSearch";
import { ironOptions } from "@/utils/ironConfig";
import { useRouter } from "next/router";

export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
  params,
}) {
  // Get id param of dynamic route
  // ex: /profile/1
  const id = params.id;
  const requestedUser = (await getUserFromProfileId(id)).user;
  if (
    req.session.user == null ||
    !req.session.user?.id ||
    req.session.user.type !== "administrator"
  ) {
    return {
      redirect: {
        permanent: false,
        destination:
          "/auth/login?error=You must have an account or be logged in to view this page.",
      },
      props: {},
    };
  }
  return {
    props: { user: req.session.user ?? null },
  };
},
ironOptions);

export default function Page({ user }) {
  console.log("User:");
  console.log(user);

  const handleSubmit = () => {};

  const increaseSessions = () => {
    console.log("Increasing session count");
    info.sessions++;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-800 w-full">
      <Head>
        <title>inBDPA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />
      <main className="flex flex-col items-center justify-center flex-grow pt-24 w-full">
        <div className="flex flex-col items-center justify-center flex-grow w-full">
          <div className="text-blue-600 text-3xl sm:text-4xl md:text-5xl lg:text-6xl  pt-2 text-center font-bold hover:-translate-y-2 transition duration-300 ease-in-out ">
            Admin Dashboard <hr />
          </div>
          <Stats />
          <UserSearch />
          <UserCreation />
        </div>
        <div className="pb-52"></div>
      </main>
    </div>
  );
}
