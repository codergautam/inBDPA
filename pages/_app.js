// pages/_app.js
// // This code is the entry point for the Next.js application and serves as a wrapper component for all pages. It imports the necessary dependencies and components, sets up state and event listeners, and handles route changes. The "parseUrl" function is used to parse the URL and determine the page name and id. The "App" component renders a loading screen while the page is loading and the actual page content once it is loaded.
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
  if(!["home", "admin","profile","opportunity","article"].includes(dir)) {
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
      // console.log(`Date: ${Date.now()}`)
      let data = await fetch("/api/admin/userUpdates").then(res => res.json())
      // console.log("Data for Forced Logout: ", data)
      let minutes = 1
      let d = (new Date(data.forceLogout))
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

  if(first) url = prevPath;

  //Dont change if going to same page
  if(!first && (url == prevPath)) return;

  if(!first && sessionIdRef.current) {
    // End old session
    let endSessionRes = await fetch('/api/endSession', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
      })
    });
    let endSessionData = await endSessionRes.json();

    // Clear the sessionId ref here to make sure it's null for the next route
    sessionIdRef.current = null;
  }
  if(typeof url == "undefined" || !parseUrl(url)) return;

  // Make new session
  let makeSessionRes = await fetch('/api/makeSession', {
    method: 'POST',
    body: JSON.stringify({
      view: parseUrl(url)[0],
      viewed_id: parseUrl(url)[1],
      user_id: pageProps.user ? pageProps.user.id : null,
    })
  });
  let makeSessionData = await makeSessionRes.json();
  if (makeSessionData.session_id) {
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
      {/* <div className="dark"> */}
      {/* <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800"> */}
        <div className="w-full">
        {/* <Navbar user={pageProps.user} queryText={router.query.query} /> */}
        <Navbar user={pageProps.user} />
      </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
          {/* <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div> */}
        </div>
      {/* </div> */}
      </div>
    )
    }
  return (
    <div className="dark">
    <Component {...pageProps} />
    </div>

  );
};

export default App;
