import React, { useState } from 'react'
import { SyncContextProvider } from './context/SyncContext'
import OpenLayersMap from './components/map/OpenLayersMap'
import CesiumMap from './components/map/CesiumMap'
import SyncControl from './components/toolbar/SyncControl'

const App = () => {

  return (
    <SyncContextProvider>
      <SyncControl />
      <div style={{ display: "flex", width: "100%", height: "100vh" }}>
        <OpenLayersMap />
        <CesiumMap />
      </div>
    </SyncContextProvider>
  )
}

export default App