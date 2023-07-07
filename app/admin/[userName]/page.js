import { getRequestCookie } from "@/utils/getRequestCookie";
import Head from "next/head";
import Navbar from "@/components/Navbar"
import { cookies } from "next/headers";
import { getUserFromProfileId } from "@/utils/api";
import Stats from "./Stats";
import UserCreation from "./UserCreation";


// async function getInfoData() {
//   let data = await fetch("http://localhost:3000/api/info", {
//     next: {
//       revalidate: 60
//     }
//   }).then((res)=> res.json());
//   return data;
// }

export default async function Page({params}){ 
  
  const user = await getRequestCookie(cookies())

  const requestedUser = await getUserFromProfileId(params.id);
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
            {params.userName}
          </div>
          <Stats></Stats>
          <UserCreation></UserCreation>
          <div className="pb-52"></div>
        </div>
        )
}