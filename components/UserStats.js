// components/UserStats.js
// This code is the UserStats component that displays user statistics such as profile views, active sessions, and connection status. The component receives the number of views, active sessions, connection status, and an editable flag as props. It returns a div element that contains the statistics with appropriate formatting and styling. The connection status is only displayed if the editable flag is set to false.
import React from 'react';

const UserStats = ({ views, activeSessions, connectionStatus, editable }) => {
  return (
    <div className="space-y-4 shadow-none text-center text-sm md:text-lg">
      <p>Profile Views: <span className="font-bold">{views}</span></p>
      <p>Active Sessions: <span className="font-bold">{activeSessions}</span></p>
      {!editable ? (
      <p>Connection Status: <span className="font-bold">{connectionStatus}</span></p>
      ) : null}
    </div>
  );
};

export default UserStats;
