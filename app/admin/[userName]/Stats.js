"use client"

export default function Stats({users, views, sessions, opportunities}) {
    return (
        <div className="flex flex-row justify-between w-1/2 mx-auto mt-6">
          <span>
            <p className="text-gray-500">
              Total Users: <span className="dark:text-white font-bold">{info ? info.users : 0}</span>
            </p>
          </span>
          <span>
            <p className="text-gray-500">
              Active Sessions: <span className="dark:text-white font-bold">{info ? info.sessions : 0}</span>
            </p>
          </span>
          <span>
            <p className="text-gray-500">
              Total Views on Platform: <span className="dark:text-white font-bold">{info ? info.views : 0}</span>
            </p>
          </span>
          <span>
            <p className="text-gray-500">
              Total Opportunities: <span className="dark:text-white font-bold">{info ? info.opportunities : 0}</span>
            </p>
          </span>
        </div>)
}