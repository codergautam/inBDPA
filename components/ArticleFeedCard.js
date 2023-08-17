import Link from "next/link"
import msToTime from "@/utils/msToTime"

export default function ArticleFeedCard({ item }) {
  return (
    <Link href={`/article/${item.article_id}`} passHref>
      <div className="p-6 flex flex-col items-start rounded justify-start w-full break-words">
        <p>article</p>
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
        <div className="flex flex-row gap-2 mb-2">
          <span className="inline-flex bg-gray-300 rounded-full px-3 py-1 text-md font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {`Posted ${msToTime(Date.now() - item.createdAt)} ago`}
          </span>
          <span className="inline-flex bg-gray-300 rounded-full  px-3 py-1 text-md font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            {`${item.views} views`}
          </span>
          {item.activeSessions ? (
            <span className="inline-flex bg-gray-300 rounded-full px-3 py-1 text-md font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              {`${item.activeSessions} active viewers`}
            </span>
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-row gap-2">
          {item.keywords.map((keyword, index) => (
            <div
              key={index}
              className="bg-gray-800 text-white  rounded-full p-2 flex items-center space-x-1 mb-2"
            >
              <span className="text-sm">{keyword}</span>
              </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
