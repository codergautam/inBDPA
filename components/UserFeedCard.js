// components/UserFeedCard.js
// This code is responsible for rendering a user feed card component. It imports necessary modules and components, such as Link from "next/link" and msToTime from "@/utils/msToTime". The UserFeedCard component takes in an item prop, which contains data for each user feed card.
//
// The component renders a Link component that links to the user's profile page. The user's profile picture, username, and a brief about section are displayed. If the user is not connected, a "Connect" button is shown. Clicking on the button triggers a connection/disconnection operation, which sends a POST request to the server. If the operation is successful, the user is redirected to the profile page. If the operation fails, an alert is shown.
//
// Below the profile information, the component displays when the user joined and the number of views they have.
//
// Overall, this code handles the rendering of a user feed card, including user profile information and interaction with the "Connect" button.
import Link from "next/link"
import msToTime from "@/utils/msToTime";
import { useRouter } from "next/router";

export default function UserFeedCard({ item }) {
  const router = useRouter();
  return (
    <Link href={`/profile/${item.link}`} passHref>
      <div className="p-6 flex rounded-lg flex-col items-start justify-start hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 ease-in-out">
        <img
          src={
            item.pfp === "gravatar"
              ? `https://www.gravatar.com/avatar/${item.hashedEmail}?d=identicon`
              : `/api/public/pfps/${item.pfp}`
          }
          alt={item.username}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div className="">
          <div className="flex align-baseline mb-2 items-center">
            <h2 className="text-lg font-semibold">{item.username}</h2>
            {!item.isConnected ? (
              <button
                className="bg-blue-500 ml-2 mb-auto hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                onClick={async (e) => {
                  e.preventDefault();
                  // Indicate that a connection/disconnection operation is happening
                  e.target.innerHTML = "Connecting...";
                  let data = await fetch("/api/toggleConnection", {
                    method: "POST",
                    body: JSON.stringify({
                      user_id: item.user_id,
                    }),
                  });
                  data = await data.json();
                  if (data.success) {
                    // setConnections(() => data.connections);
                    // setDepth(() => data.newDepth);
                    // Indicate that the operation is complete
                    router.push(`/profile/${item.link}`);
                  } else {
                    alert("Failed to connect");
                    e.target.innerHTML = "Connect";
                  }
                }}
              >
                Connect
              </button>
            ) : null}
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2 mr-8 break-all text-clip w-full">
            {item.sections.about.length > 200
              ? item.sections.about.substring(0, 200) + "..."
              : item.sections.about}
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <span className="inline-flex bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {`Joined ${msToTime(Date.now() - item.createdAt)} ago`}
          </span>
          <span className="inline-flex bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {`${item.views} views`}
          </span>
        </div>
      </div>
    </Link>
  );
}
