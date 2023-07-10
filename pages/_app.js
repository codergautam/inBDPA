// Import global CSS styles
import "@/public/globals.css"

// Import necessary modules
import { useRouter } from "next/router";
import { useEffect } from "react";

// Define the App component
const App = ({ Component, pageProps }) => {
  // Get the router object
  const router = useRouter();

  // Add an event listener to the router to log when a route change starts
  useEffect(() => {
    // Define the function to be executed when a route change starts
    const exitingFunction = async () => {
      console.log("exiting...");
    };

    // Add the function as an event listener to the router
    router.events.on("routeChangeStart", exitingFunction);

    // Add the function as an event listener to the window's beforeunload event
    window.onbeforeunload = exitingFunction;

    // Remove the event listener from the router when the component unmounts
    return () => {
      console.log("unmounting component...");
      router.events.off("routeChangeStart", exitingFunction);
    };
  }, []);

  // Render the component with its props
  return <Component {...pageProps} />;
};

// Export the App component as the default export
export default App;