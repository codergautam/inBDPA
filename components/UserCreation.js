"use client"

import { set } from "mongoose";
import { useState, useRef, useEffect } from "react"

export default function UserCreation(){
    let types = [
        "inner",
        "staff",
        "admin"
    ]
    const [type, setType] = useState(types[0])
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [showingForm, setShowingForm] = useState(false);

    //Status
    const [showStatus, setShowStatus] = useState(false);
    const [status, setStatus] = useState(false);
    const [error, setError] = useState(false);

    let creationRef = useRef();

    useEffect(()=> {
        return () => clearTimeout(creationRef.current)
    })

    const handleSubmit = async () => {
        clearTimeout(creationRef.current)
        setStatus("")
        let obj = {
            username,
            email,
            password,
            type: type,
            changeUser: false
        }
        console.log(obj)
        let res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(obj),
            credentials: "include"
        }).then((res)=>res.json())
        console.log("Response from Form:")
        console.log(res)
        setShowingForm(false);
        setUsername("");
        setPassword("");
        setType(types[0]);
        setEmail("");
        setShowStatus(true)
        if(res.success) {
            setError(false)
            setStatus(`Successfully created user. Username: ${obj.username}, Email: ${obj.email}, Password: ${obj.password}, Type: ${obj.type}`);

        } else {
            setStatus(`Error: ${res.error}`)
            setError(true);
        }
        creationRef.current = setTimeout(()=>{
            setShowStatus(false);
            setError(false);
            setStatus("")
        }, 5000)
    }

    return (<>
        {showStatus ?
        <p className={`mt-4 text-base text-center w-1/3 mx-auto ${error ? "text-red-500" : "text-green-500"}`}>
            {status}
        </p> :
        <></>}
            <p onClick={()=>setShowingForm(!showingForm)} className={`mt-4 mx-auto ${showingForm ? "text-red-500" : ""} cursor-pointer text-base font-bold mb-2`}>
                Click this to {!showingForm ? "make a user" : "close the form"}
            </p>
            {showingForm ? <div className="px-6 py-4 bg-gray-900 text-center w-1/4 mx-auto rounded">
            <p className="text-white text-3xl font-bold mb-4">
                Create a New User
            </p>
            <div>
            <label className="text-white text-lg mb-2">Username:</label>
            <input onChange={(e) => setUsername(e.target.value)} className="w-full mx-2 rounded bg-gray-700 px-4 py-2 mb-4" placeholder="Username..." type="text" />
            <label className="text-white text-lg mb-2">Email:</label>
            <input onChange={(e) => setEmail(e.target.value)} className="w-full mx-2 rounded bg-gray-700 px-4 py-2 mb-4" placeholder="Email..." type="text" />
            <label className="text-white text-lg mb-2">Password:</label>
            <input onChange={(e) => setPassword(e.target.value)} className="w-full mx-2 rounded bg-gray-700 px-4 py-2 mb-4" placeholder="Password..." type="password" />
            <label className="text-white text-lg mb-2">Type of User:</label> <br />
            <select onChange={(e) => setType(e.target.value)} className="text-white bg-gray-700 rounded px-4 py-2 mt-2 w-1/2 mx-auto" value={type} name="type" id="">
                {types.map((type, i) => (
                    <option value={type == "admin" ? "administrator" : type} key={i}>{type}</option>
                ))}
            </select> <br />
            <button onClick={handleSubmit} className="rounded bg-gray-700 px-4 py-2 text-white mt-4">
                Submit
            </button></div></div>
 : <></>}
    </>
    )
}