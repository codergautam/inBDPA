import Head from "next/head";
import Footer from "../components/FooterHome";
import Navbar from "@/components/navbar";
import Main from "@/components/HomeMain";

export default function Home() {
  return (
    <div className="text-black bg-black">
      <Head>
        <title>nine4</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Navbar />
      <Main/>
    </div>
  );
}