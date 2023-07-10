import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import "@/public/globals.css"

const App = ({ Component, pageProps }) => {
  const router = useRouter();

  // State to keep track of the previous page
  // Initialize it with the current path
  const [prevPath, setPrevPath] = useState(router.asPath);

  useEffect(() => {
    // Function to handle when a route change starts
    const handleRouteChangeStart = (url) => {
      console.log("Moving from page: ", prevPath);
      console.log("Moving to page: ", url);
    };

    // Function to handle when a route change completes
    const handleRouteChangeComplete = (url) => {
      setPrevPath(url);  // Set the current path as the new previous path
    };

    // Add the event listeners to the router
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    // Remove the event listeners when the component unmounts
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [prevPath]);  // Rerun the effect when prevPath changes

  return <Component {...pageProps} />;
};

export default App;
