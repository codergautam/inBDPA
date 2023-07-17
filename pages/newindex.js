import Head from "next/head";
import Navbar from "@/components/navbar";
import Main from "@/components/HomeMain";
import { getUserCount } from "@/utils/api";

export default function Home({count}) {
  return (
    <div className="text-black bg-black">
      <Head>
        <title>nine4</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar />
      <Main count={count}/>
    </div>
  );
}

export async function getServerSideProps(context) {
  let userCount = await getUserCount();
  return {
    props: {count: userCount},
  };
}