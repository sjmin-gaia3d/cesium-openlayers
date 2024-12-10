import { useSyncMap } from '../../../hooks/sync/useSyncMap';

const SyncControl = () => {

  const { isSyncActive, toggleSync } = useSyncMap(); // isSyncActive 값을 useSyncMap에 전달

  return (
    <div>
      <button onClick={toggleSync}>
        {isSyncActive ? "Sync Off" : "Sync On"}
      </button>
    </div>
  );
};

export default SyncControl;
