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
    <div style={{ flex:1 }}>
      <CesiumInteraction />
      <div ref={viewContainerRef} style={{ height: '80vh' }}></div>
    </div>
  );
};

export default CesiumMap;
