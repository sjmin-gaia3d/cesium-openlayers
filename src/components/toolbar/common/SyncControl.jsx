import useSyncMap from '../../../hooks/sync/useSyncMap';
import useSyncObject from '../../../hooks/sync/useSyncObject';

const SyncControl = () => {

  const { isSyncActive, toggleSync } = useSyncMap(); // isSyncActive 값을 useSyncMap에 전달
  useSyncObject()
  return (
    <div>
      <button onClick={toggleSync}>
        {isSyncActive ? "Sync Off" : "Sync On"}
      </button>
    </div>
  );
};

export default SyncControl;
