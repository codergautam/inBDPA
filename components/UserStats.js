import React from 'react';

const UserStats = ({ views, activeSessions, connectionStatus, editable }) => {
  return (
    <div className="space-y-4 shadow-none">
      <p>Profile Views: <span className="font-bold">{views}</span></p>
      <p>Active Sessions: <span className="font-bold">{activeSessions}</span></p>
      {!editable ? (
      <p>Connection Status: <span className="font-bold">{connectionStatus}</span></p>
      ) : null}
    </div>
  );
};

export default UserStats;
