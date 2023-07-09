import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGhost } from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "next/router"


export default function ImpersonateUser() {
    const router = useRouter()
    const [error, setError] = useState("")
    const [hasError, setHasError] = useState("")
    const [outputUser, setOutputUser] = useState(null)
    const [outputUserStatus, setOutputUserStatus] = useState("")
    const [showingImpersonation, setShowingImpersonation] = useState(false)

    const [query, setQuery] = useState("")
    let impersonationRef = useRef();

    useEffect(()=> {
        return () => clearTimeout(impersonationRef.current)
    })

    const impersonateUser = async (id) => {
        clearTimeout(impersonationRef.current)
        setShowingImpersonation(false);
        let data = await fetch("/api/admin/impersonateUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: id,
            })
        }).then(res => res.json());

        if(data.success) {
            router.push("/")
        } else {
            setOutputUser(null);
            setOutputUserStatus("Failed to create user")
            setShowingImpersonation(true);
            impersonationRef.current = setTimeout(()=>{
                setOutputUserStatus("")
            }, 2000)
        }
        //After everything
    }
    const checkForUser = async (value) => {
        clearTimeout(impersonationRef.current)
        setOutputUserStatus("...")
        console.log(value)
        let user = await fetch("/api/getUser", {
            next: {
                revalidate: 2
            },
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: value
            }),
            credentials: "include"
        }).then(res => res.json())
        if(user.success) {
            clearTimeout(impersonationRef.current)
            setOutputUserStatus("")
            console.log("User:")
            console.log(user.user)
            setOutputUser(user.user)
            return
        } else {
            setOutputUserStatus("No user found...")
            setOutputUser(null)
            impersonationRef.current = setTimeout(()=>{setOutputUserStatus("")}, 1000);
            return
        }
        //Error stuff
    }

    return (
        <div className="mt-4 mb-4 flex flex-col w-1/4 mx-auto text-center">
            <p className="text-2xl text-white font-bold">Impersonate</p>
            <label className="text-gray-700 text-lg mb-2">Username:</label>
            <input value={query} onChange={(e)=>{
                setQuery(e.target.value)
                checkForUser(e.target.value)
                }} className="bg-transparent border-b-2 border-white px-2 py-1 focus:ring-none outline-none" type="text" />
            <p className="text-center text-lg font-white mt-2">
                {outputUserStatus}
            </p>
            {outputUser ? <div className="text-center text-white">
                <p className="text-xl font-bold">
                    {outputUser.username}
                </p>
                <p className="text-base">
                    {outputUser.email}
                </p>
                <p className="text-base">
                    <span className="text-gray-700">Type:</span> {outputUser.type}
                </p>
                <p className="text-base">
                    <span className="text-gray-700">Total Views:</span> {outputUser.views}
                </p>
                {outputUser.type !== "administrator" ? <button onClick={()=>impersonateUser(outputUser.user_id)} className="bg-gray-900 group flex cursor-pointer hover:scale-105 transition duration-300 ease-in-out w-min min-w-max mx-auto mt-2 rounded text-white px-4 py-2">
                        Impersonate <FontAwesomeIcon className="my-auto ml-2 text-gray-700 group-hover:text-white transition duration-300 ease-in-out" icon={faGhost}></FontAwesomeIcon>
                    </button>: <></>}
            </div> : <></>}
        </div>
    )
}