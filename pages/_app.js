import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import "@/public/globals.css"
import '@fortawesome/fontawesome-svg-core/styles.css'
import Navbar from "@/components/navbar";

function parseUrl(url) {
  // Convert URL to a common format
  url = url.replace(/\/$/, "")+"/";
  // If dir is / , its 'home'
  // If dir is /admin, its 'admin'
  // If dir is /profile, its 'profile'
  // If dir is /opportunity, its 'opportunity'
  // etc..
  // Use the first part of the path as the page name
  let dir = url.split("/")[1];
  if (dir === "") {
    dir = "home";
  }
  if(!["home", "admin","profile","opportunity"].includes(dir)) {
    return null;
  }


  // Get second part of the path as the id (if it exists)
  let id = url.split("/")[2];
  if (id === undefined) {
    id = null;
  }

  return [dir, id];
}

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const forcedLogoutRef = useRef()


  useEffect(() => {
    const checkStuff = async () => {
      console.log("hello")
      // console.log(`Date: ${Date.now()}`)
      let data = await fetch("/api/admin/userUpdates").then(res => res.json())
      // console.log("Data for Forced Logout: ", data)
      let minutes = 1
      let d = (new Date(data.forceLogout))
      console.log("pure: ", data.forceLogout)
      console.log("Date for Logout: ", d)
      console.log(`${minutes} Minute(s): `, (Math.pow(10, 3) * 60 * minutes))
      console.log("Difference: ", (new Date()).getTime() - d.getTime())
      if(data.imp && data.leave) {
        alert("This user has been forced to logout, you're now returning to admin")
        router.reload()
        return;
      }
      if((new Date()).getTime() - (new Date(data.forceLogout)).getTime() < (Math.pow(10, 3) * 60 * minutes)){
        await fetch("/api/admin/userUpdates", {
          method: "POST",
          headers: {
            "Content-Type" : "application/json"
          }
        }).then(res => res.json())
        alert("You were forced to log out by an admin")
        router.push("/api/auth/logout")
      } else if(data.shouldRefresh) {
          alert("Your user type has been updated by an admin")
          router.reload()
          return;
      }
    }
    checkStuff()
    forcedLogoutRef.current = setInterval(checkStuff, 5000)
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);
    return () => {
      if(typeof forceLogoutRef !== "undefined" && typeof forceLogoutRef.current !== "undefined" && forceLogoutRef.current) clearTimeout(forceLogoutRef.current)
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, []);

  // State to keep track of the previous page
  const [prevPath, setPrevPath] = useState(router.asPath);
// Create a ref for the sessionId
const sessionIdRef = useRef(null);

const handleRouteChangeStart = async (url, first=false) => {
  if(typeof first !== "boolean") first = false;
  console.log("Changing..", url, first);

  if(first) url = prevPath;

  //Dont change if going to same page
  if(!first && (url == prevPath)) return console.log("Going to same page");

  if(!first && sessionIdRef.current) {
    // End old session
    let endSessionRes = await fetch('/api/endSession', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
      })
    });
    let endSessionData = await endSessionRes.json();
    console.log("Ended session",endSessionData)

    // Clear the sessionId ref here to make sure it's null for the next route
    sessionIdRef.current = null;
  }
  if(typeof url == "undefined" || !parseUrl(url)) return console.log("Invalid url",url, prevPath);

  // Make new session
  let makeSessionRes = await fetch('/api/makeSession', {
    method: 'POST',
    body: JSON.stringify({
      view: parseUrl(url)[0],
      viewed_id: parseUrl(url)[1],
    })
  });
  let makeSessionData = await makeSessionRes.json();
  if (makeSessionData.session_id) {
    console.log("Setting session id", makeSessionData.session_id, "for url", url)
    sessionIdRef.current = makeSessionData.session_id;
  }
};

  const renewSession = async () => {
    if(!sessionIdRef.current) return;

    fetch('/api/renewSession', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
      })
    }).then(res => res.json()).then(data => {
      if(data.success) {
        console.log ("Renewed session", sessionIdRef.current);
      } else {
        console.log("Error renewing session", data);
      }
    }).catch(err => {
      console.log("Error renewing session", err);
    });
  };


  useEffect(() => {
    let renewInterval = setInterval(renewSession, 1000 * 5);
    return () => clearInterval(renewInterval);
  }, [sessionIdRef.current]);

  useEffect(() => {
    // Function to handle when a route change completes
    const handleRouteChangeComplete = (url) => {
      setPrevPath(url);  // Set the current path as the new previous path
    };

    // Add the event listeners to the router
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    window.onbeforeunload = () => {
      console.log("Going to end session", sessionIdRef.current);
      if(sessionIdRef.current) {
        // End old session
        let endSessionRes = fetch('/api/endSession', {
          method: 'POST',
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
          }),
          keepalive: true
        });
        endSessionRes.then(res => res.json()).then(data => {
          console.log(data);
        });
      }
      return;
    };

    // Remove the event listeners when the component unmounts
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [prevPath]);  // Rerun the effect when prevPath changes

  // Call handleRouteChangeStart when page loads
  useEffect(() => {
    handleRouteChangeStart(prevPath, true);
  }, []);
    // <>
    //   {loading ? (
    //     <h1>Loading...</h1>
    //   ) : (
    //     <Component {...pageProps} />
    //   )}
    // </>
    if(loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-800">
        <div className="w-full">
        {/* <Navbar user={pageProps.user} queryText={router.query.query} /> */}
        <Navbar user={pageProps.user} />
      </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </div>
    )
    }
  return (
    <Component {...pageProps} />

  );
};

export default App;
