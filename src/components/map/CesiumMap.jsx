import React, { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import useInitCesiumViewer from "../../hooks/init/useInitCesiumViewer";
import useLoadTerrain from "../../hooks/useLoadTerrain";
import useCesiumLayerControls from "../../hooks/layers/useCesiumLayerControls";
import { useSyncMap } from "../../hooks/sync/useSyncMap";
import { useSyncZoom } from "../../hooks/sync/useSyncZoom";

const CesiumMap = () => {
  const viewContainerRef = useRef(null);
  const { cesiumViewer } = useInitCesiumViewer(viewContainerRef);
  const { toggleOSMLayer, toggleGoogleTileset, resetToDefault } = useCesiumLayerControls(cesiumViewer);

  useLoadTerrain(cesiumViewer);

  useSyncMap({ cesiumViewer });
//   useSyncZoom({ cesiumViewer });

  return (
    <div ref={viewContainerRef} style={{ position: "relative", width: "100%", height: "100vh" }}>
    </div>
  );
};

export default CesiumMap;
