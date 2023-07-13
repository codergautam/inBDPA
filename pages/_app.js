import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import "@/public/globals.css"

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


  useEffect(() => {
    const start = () => {
      console.log("start");
      setLoading(true);
    };
    const end = () => {
      console.log("finished");
      setLoading(false);
    };
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, []);

  // State to keep track of the previous page
  // Initialize it with the current path
  const [prevPath, setPrevPath] = useState(router.asPath);
// Create a ref for the sessionId
const sessionIdRef = useRef(null);

const handleRouteChangeStart = async (url, first=false) => {
  console.log("Going to end session", sessionIdRef.current);
  if(typeof url == "undefined" || !parseUrl(url)) return;

  //Dont change if going to same page
  if(url == prevPath) return;

  if(!first && sessionIdRef.current) {
    // End old session
    let endSessionRes = await fetch('/api/endSession', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: sessionIdRef.current,
      })
    });
    let endSessionData = await endSessionRes.json();
    console.log(endSessionData);

    // Clear the sessionId ref here to make sure it's null for the next route
    sessionIdRef.current = null;
  }

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
    console.log("Setting session id", makeSessionData.session_id)
    sessionIdRef.current = makeSessionData.session_id;
  }
};

  const renewSession = async () => {
    if(!sessionIdRef.current) return;
  if(!typeof url || !parseUrl(url)) return;


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
    let renewInterval = setInterval(renewSession, 1000 * 20);
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
  return (
    <Component {...pageProps} />

  );
};

export default App;
