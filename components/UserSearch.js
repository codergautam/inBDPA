import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMask, faGhost, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/router";
import Link from "next/link";


export default function UserSearch() {
    const listOfTypes = [
        "inner",
        "staff",
        "administrator"
    ]

    const router = useRouter()
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
        // setShowingImpersonation(false);
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
            setOutputUserStatus("Failed to create user with error: " + data.error)
            // setShowingImpersonation(true);
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
            if(user.user) {
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
        } else {
            setOutputUserStatus("No user found...")
        }
            return
        } else {
            setOutputUserStatus("No user found...")
            setOutputUser(null)
            // promotionRef = setTimeout(()=>{setOutputUserStatus("")}, 1000);
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
    const forceLogoutUser = async (id) => {
        clearTimeout(promotionRef)
        setOutputUser(null)
        setQuery("")
        setOutputUserStatus("...")
        let data = await fetch("/api/admin/userUpdates", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: id,
                status: true
            })
        }).then(res => res.json());
        // console.log("Data:")
        // console.log(data)
        if(data.success) {
            setOutputUserStatus(`Forced ${outputUser.username} to logout`)
            promotionRef = setTimeout(()=>{setOutputUserStatus("")}, 1000)
        } else {
            setOutputUserStatus(`Failed to forcefully logout ${outputUser.username}, ecountered error: ${data.error}`)
            promotionRef = setTimeout(()=>{setOutputUserStatus("")}, 1000)
        }
    }

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
            setOutputUserStatus("Failed to change user type, ecountered error: " + data.error)
            promotionRef = setTimeout(()=>{setOutputUserStatus("")}, 1000)
        }
    }

    return (
        <div className="mt-8 mb-8 flex flex-col w-5/6 md:w-3/4 xl:w-3/5 text-center bg-gray-100 dark:bg-gray-900 p-8 rounded-lg shadow-md">
          <p className="text-3xl lg:text-4xl text-gray-700 dark:text-white font-bold">Modify a user</p>
          <label className="text-gray-500 dark:text-gray-300 text-xl mb-4">Username:</label>
          <input value={query} onChange={(e)=>{
              setQuery(e.target.value)
              checkForUser(e.target.value)
              }} className="bg-transparent border-b-4 border-gray-500 dark:border-gray-300 px-4 py-2 focus:ring-none outline-none text-lg dark:text-white" type="text" />
          <p className="text-center text-xl font-bold dark:text-gray-300 mt-4">
              {outputUserStatus}
          </p>
          {outputUser ? <div className="text-center text-gray-700 dark:text-white">
              <Link className="text-2xl font-bold mt-4" href={"/profile/"+outputUser.link}>
                  {outputUser.username}
              </Link>
              <p className="text-xl mt-2">
                  {outputUser.email}
              </p>
              <p className="text-xl mt-2">
                  <span className="text-gray-500 dark:text-gray-400">Type:</span> {outputUser.type}
              </p>
              <p className="text-xl mt-2">
                  <span className="text-gray-500 dark:text-gray-400">Total Views:</span> {outputUser.views}
              </p>
              <div className="flex flex-col mt-4">
                  {outputUser.type != "administrator" ? <button onClick={()=>changeUserType(outputUser.user_id, nextPosition)} className="bg-gray-500 dark:bg-blue-600 cursor-pointer hover:scale-105 transition duration-300 ease-in-out w-min min-w-max mx-auto mt-2 rounded text-white px-6 py-3 text-xl">
                      Promote to <span className="text-blue-600 dark:text-blue-300">{nextPosition}</span>
                  </button> : <></>}
                  {/* Administrators can not demote other admins!!!! */}
                  {(outputUser.type != "inner" && outputUser.type != "administrator") ? <button onClick={()=>changeUserType(outputUser.user_id, previousPosition)} className="bg-gray-500 dark:bg-blue-600 cursor-pointer hover:scale-105 transition duration-300 ease-in-out w-min min-w-max mx-auto mt-2 rounded text-white px-6 py-3 text-xl">
                      Demote to <span className="text-red-500 dark:text-red-300">{previousPosition}</span>
                  </button> : <></>}
                  {outputUser.type !== "administrator" ? <button onClick={()=>impersonateUser(outputUser.user_id)} className="bg-gray-500 dark:bg-blue-600 group flex cursor-pointer hover:scale-105 transition duration-300 ease-in-out w-min min-w-max mx-auto mt-2 rounded text-white px-6 py-3 text-xl">
                          Impersonate <FontAwesomeIcon className="my-auto ml-2 text-gray-700 group-hover:text-white transition duration-300 ease-in-out" icon={faMask}></FontAwesomeIcon>
                      </button>: <></>}

                  {outputUser.type !== "administrator" ? <button onClick={()=>forceLogoutUser(outputUser.user_id)} className="bg-gray-500 dark:bg-blue-600 group flex cursor-pointer hover:scale-105 transition duration-300 ease-in-out w-min min-w-max mx-auto mt-2 rounded text-white px-6 py-3 text-xl">
                          Force to Log Out <FontAwesomeIcon className="my-auto ml-2 text-gray-700 group-hover:text-white transition duration-300 ease-in-out" icon={faRightFromBracket}></FontAwesomeIcon>
                      </button>: <></>}
              </div>
          </div> : <></>}

        </div>
      )
    }