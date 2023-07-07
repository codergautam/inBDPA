import { getRequestCookie } from "@/utils/getRequestCookie";
import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";
import Navbar from "@/components/Navbar"
import { getUserFromProfileId } from "@/utils/api";
import Stats from "@/components/Stats";
import UserCreation from "@/components/UserCreation";
import PromoteUser from "@/components/PromoteUser";
import { ironOptions } from "@/utils/ironConfig";
import { useRouter } from "next/router";

export const getServerSideProps = withIronSessionSsr(async function ({req, res, params}) {
  // Get id param of dynamic route
  // ex: /profile/1
  const id = params.id;
  const requestedUser = (await getUserFromProfileId(id)).user;
  if(req.session.user == null || req.session.user.type != "administrator") {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props:{},
    };
  }
  return {
    props: { user: req.session.user ?? null },
  };
}, ironOptions);

export default function Page({user}){ 
  console.log("User:")
  console.log(user)

  // let data = await getInfoData();
  // const [info, setInfo] = useState({});
  // const [password, setPassword] = useState("");
  // const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  // const [rememberMe, setRememberMe] = useState(false);
  // if(data.success) setInfo(data.info)
  // useEffect(()=>{
  //   console.log("why")
  // },[])
  // console.log("Info:")
  // console.log(data)
  // if(data.success) {
  //   console.log("Success!")
  //   info = data.info;
  // }
  
  const handleSubmit = () => {

  }

  const increaseSessions = () => {
    console.log("Increasing session count")
    info.sessions++;
  }
  return (
        <div className="flex flex-col h-screen dark:bg-black">
        <Head>
          <title>inBDPA</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
          <div className='w-full'>
            <Navbar user={user}/>
          </div>
          <div className="text-gray-700 text-4xl text-center mt-4">
            Hello
          </div>
          <div className="text-white text-7xl text-center font-bold hover:-translate-y-2 transition duration-300 ease-in-out">
            {user.username}
          </div>
          <Stats></Stats>
          <PromoteUser></PromoteUser>
          <UserCreation></UserCreation>
          <div className="pb-52"></div>
        </div>
        )
}