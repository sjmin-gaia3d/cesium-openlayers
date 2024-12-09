import { useRef } from "react";
import useInitCesiumViewer from "../../hooks/init/useInitCesiumViewer";
import useLoadTerrain from "../../hooks/useLoadTerrain";
import useCesiumLayerControls from "../../hooks/layers/useCesiumLayerControls";
import { useShallow } from "zustand/shallow";
import useMapStore from "../../store/useMapStore";
import CesiumInteraction from "../toolbar/cesium/CesiumInteraction";
import useInitDataSource from "../../hooks/init/useInitDataSource";

const CesiumMap = () => {
  const viewContainerRef = useRef(null);
  useInitCesiumViewer(viewContainerRef);
  const { toggleOSMLayer, toggleGoogleTileset, resetToDefault } = useCesiumLayerControls();
  useLoadTerrain();
  const dataSources = "dataSource";
  useInitDataSource(dataSources)

  return (
    <div style={{ display: "flex", flexDirection: "column"}}>
      <CesiumInteraction />
      <div ref={viewContainerRef} style={{ flex: 1, width: '100%' }}></div>
    </div>
  );
};

export default CesiumMap;
