import React from 'react'
import { useSyncContext } from '../../context/SyncContext';

const SyncControl = () => {
    const { isSyncActive, toggleSync } = useSyncContext();
  return (
    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}>
    <button onClick={toggleSync}>
      {isSyncActive ? "Sync Off" : "Sync On"}
    </button>
  </div>
  )
}

export default SyncControl