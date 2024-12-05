import React, { createContext, useState, useContext } from 'react';

// Context 생성
export const SyncContext = createContext(null);

// Provider 컴포넌트
export const SyncContextProvider = ({ children }) => {
  
  const [isSyncActive, setIsSyncActive] = useState(false);

  const [centerCoordinates, setCenterCoordinates] = useState({
    lon: 127.3845475,
    lat: 36.3504119,
  });

  const [rotation, setRotation] = useState(0);

  const [zoomLevel, setZoomLevel] = useState(10)

  const toggleSync = () => setIsSyncActive((prev) => !prev); // 활성/비활성 토글

  return (
    <SyncContext.Provider
      value={{
        centerCoordinates, setCenterCoordinates,
        rotation, setRotation,
        zoomLevel, setZoomLevel,
        isSyncActive,
        toggleSync
      }}>
      {children}
    </SyncContext.Provider>
  );
};

// Context를 사용할 수 있도록 하는 커스텀 Hook
export const useSyncContext = () => useContext(SyncContext);