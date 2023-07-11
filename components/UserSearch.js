import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMask, faGhost } from '@fortawesome/free-solid-svg-icons';


export default function UserSearch() {
    const listOfTypes = [
        "inner",
        "staff",
        "administrator"
    ]

    const [error, setError] = useState("")
    const [hasError, setHasError] = useState("")
    const [nextPosition, setNextPosition] = useState("")
    const [previousPosition, setPreviousPosition] = useState("")
    const [outputUser, setOutputUser] = useState(null)
    const [outputUserStatus, setOutputUserStatus] = useState("")
    const [promotionDisabled, setPromotionDisabled] = useState(false)

    const [query, setQuery] = useState("")
    let promotionRef

    const impersonateUser = async (id) => {
        clearTimeout(promotionRef)
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
            promotionRef = setTimeout(()=>{
                setOutputUserStatus("")
            }, 2000)
        }
        //After everything
    }

    const checkForUser = async (value) => {
        clearTimeout(promotionRef)
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
            setOutputUserStatus("")
            console.log("User:")
            console.log(user.user)
            setOutputUser(user.user)
            clearTimeout(promotionRef)
            if(user.user.type != "administrator") {
                let newPos = listOfTypes[listOfTypes.indexOf(user.user.type)+1];
                console.log(`New Position: ${newPos}`)
                setNextPosition(newPos)
            }
            if(user.user.type != "inner") {
                let newPos = listOfTypes[listOfTypes.indexOf(user.user.type)-1];
                console.log(`Previous Position: ${newPos}`)
                setPreviousPosition(newPos)
            }
            return
        } else {
            setOutputUserStatus("No user found...")
            setOutputUser(null)
            promotionRef = setTimeout(()=>{setOutputUserStatus("")}, 1000);
            return
        }
        //Error stuff
    }

    // const inquire = (value) => {
    //     setOutputWords("...")
    //     if(value.trim() == "") {
    //         setOutputWords([])
    //         setQuery(value);
    //         return
    //     }
    //     setQuery(value);
    //     console.log("Query: " + value)
    //     let outputList = [];
    //     for(let i = 0; i < users.length; i++) {
    //         let user = users[i]
    //         if(user.username.toUpperCase().indexOf(value.toUpperCase()) != -1) {
    //             console.log(user)
    //             outputList.unshift(user)
    //         }
    //     }
    //     setOutputWords(outputList)
    // }

    const changeUserType = async (id, newPos) => {
        clearTimeout(promotionRef)
        setOutputUser(null)
        setQuery("")
        setOutputUserStatus("...")
        let data = await fetch("/api/admin/updateUserType", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: id,
                type: newPos
            })
        }).then(res => res.json());
        console.log("Data:")
        console.log(data)
        if(data.success) {
            setOutputUserStatus("Changed User to " + newPos)
            promotionRef = setTimeout(()=>{setOutputUserStatus("")}, 1000)
        } else {
            setOutputUserStatus("Failed to change user type...")
            promotionRef = setTimeout(()=>{setOutputUserStatus("")}, 1000)
        }
    }

    return (
        <div className="mt-4 mb-4 flex flex-col w-1/4 mx-auto text-center">
            <p className="text-2xl text-white font-bold">Search</p>
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
                <div className="flex flex-col">
                    {outputUser.type != "administrator" ? <button onClick={()=>changeUserType(outputUser.user_id, nextPosition)} className="bg-gray-900 cursor-pointer hover:scale-105 transition duration-300 ease-in-out w-min min-w-max mx-auto mt-2 rounded text-white px-4 py-2">
                        Promote to <span className="text-blue-500">{nextPosition}</span>
                    </button> : <></>}
                    {/* Administrators can not demote other admins!!!! */}
                    {(outputUser.type != "inner" && outputUser.type != "administrator") ? <button onClick={()=>changeUserType(outputUser.user_id, previousPosition)} className="bg-gray-900 cursor-pointer hover:scale-105 transition duration-300 ease-in-out w-min min-w-max mx-auto mt-2 rounded text-white px-4 py-2">
                        Demote to <span className="text-red-500">{previousPosition}</span>
                    </button> : <></>}
                    {outputUser.type !== "administrator" ? <button onClick={()=>impersonateUser(outputUser.user_id)} className="bg-gray-900 group flex cursor-pointer hover:scale-105 transition duration-300 ease-in-out w-min min-w-max mx-auto mt-2 rounded text-white px-4 py-2">
                            Impersonate <FontAwesomeIcon className="my-auto ml-2 text-gray-700 group-hover:text-white transition duration-300 ease-in-out" icon={faMask}></FontAwesomeIcon>
                        </button>: <></>}
                </div>
            </div> : <></>}
            
        </div>
    )
}