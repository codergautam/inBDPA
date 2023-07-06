import React from 'react';

const UserStats = ({ views, activeSessions, connectionStatus }) => {
  return (
    <div className="space-y-4">
      <p>Profile Views: <span className="font-bold">{views}</span></p>
      <p>Active Sessions: <span className="font-bold">{activeSessions}</span></p>
      <p>Connection Status: <span className="font-bold">{connectionStatus}</span></p>
    </div>
  );
};

export default UserStats;
