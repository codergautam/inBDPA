// components/OpportunityFeedCard.js
// This file contains the code for the OpportunityFeedCard component.
//
// The component takes in an "item" prop and displays an opportunity card with the relevant information.
//
// The component is wrapped in a Link component from Next.js, which allows the card to link to the opportunity details page.
//
// The card includes the opportunity title, content, and additional information such as the time since it was posted, the number of views, and the number of active viewers if applicable.
//
// The component uses the msToTime utility function to convert the creation time of the opportunity into a readable format.
//
// The card is styled using Tailwind CSS classes to achieve the desired layout and appearance.
import Link from "next/link"
import msToTime from "@/utils/msToTime"

export default function OpportunityFeedCard({ item }) {
  return (
    <Link href={`/opportunity/${item.opportunity_id}`} passHref>
      <div className="p-6 flex flex-col items-start rounded justify-start hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300 ease-in-out w-full break-words">
        <h2 className="text-xl font-semibold mb-1 w-full break-words">
          {item.title.length > 50
            ? item.title.substring(0, 50) + "..."
            : item.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2 mr-8 break-words w-full">
          {item.content.length > 200
            ? item.content.substring(0, 200) + "..."
            : item.content}
        </p>
        <div className="flex flex-row gap-2">
          <span className="inline-flex bg-gray-300 border rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {`Posted ${msToTime(Date.now() - item.createdAt)} ago`}
          </span>
          <span className="inline-flex bg-gray-300 border rounded-full  px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {`${item.views} views`}
          </span>
          {item.activeSessions ? (
            <span className="inline-flex bg-gray-300 border rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {`${item.activeSessions} active viewers`}
            </span>
          ) : (
            <></>
          )}
        </div>
      </div>
    </Link>
  );
}
