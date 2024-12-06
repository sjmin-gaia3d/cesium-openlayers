import { useState } from 'react';
import { useSyncMap } from '../../../hooks/sync/useSyncMap';

const SyncControl = () => {
  const [isSyncActive, setIsSyncActive] = useState(false); // useState로 상태 관리

  const toggleSync = () => {
    setIsSyncActive((prev) => !prev); // 상태 업데이트
    console.log(`Sync is now ${!isSyncActive ? 'active' : 'inactive'}`);
  };

  useSyncMap(isSyncActive); // isSyncActive 값을 useSyncMap에 전달

  return (
    <div>
      <button onClick={toggleSync}>
        {isSyncActive ? "Sync Off" : "Sync On"}
      </button>
    </div>
  );
};

export default SyncControl;
