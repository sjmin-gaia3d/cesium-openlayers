import React, { useEffect, useRef, useState } from "react";
import * as Cesium from "cesium";
import useInitCesiumViewer from "../../hooks/init/useInitCesiumViewer";
import useLoadTerrain from "../../hooks/useLoadTerrain";
import useCesiumLayerControls from "../../hooks/layers/useCesiumLayerControls";
import { useSyncMap } from "../../hooks/sync/useSyncMap";
import { useSyncZoom } from "../../hooks/sync/useSyncZoom";
import { useShallow } from "zustand/shallow";
import useMapStore from "../../store/useMapStore";

const CesiumMap = () => {
  const viewContainerRef = useRef(null);
  useInitCesiumViewer(viewContainerRef);

  const { cesiumViewer } = useMapStore(
    useShallow((state) => ({ cesiumViewer: state.cesiumViewer}))
  );
  const { toggleOSMLayer, toggleGoogleTileset, resetToDefault } = useCesiumLayerControls(cesiumViewer);

  useLoadTerrain(cesiumViewer);

  useSyncMap({ cesiumViewer });
  //   useSyncZoom({ cesiumViewer });
  useEffect(() => {
    if (cesiumViewer) {
      cesiumViewer.flyTo(
        cesiumViewer.entities.add({
          position: Cesium.Cartesian3.fromDegrees(127.024612, 37.5326),
          point: {
            pixelSize: 10,
            color: Cesium.Color.RED,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 지형에 붙이기
          },
        })
      )
      cesiumViewer.entities.add({
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray([
            127.024612, 37.5326,
            126.978388, 37.566536,
          ]),
          width: 3,
          material: Cesium.Color.BLUE,
          clampToGround: true, // 지형에 붙이기
        },
      });

      cesiumViewer.entities.add({
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray([
            127.024612, 37.5326,
            126.978388, 37.566536,
            127.035278, 37.582839,
          ]),
          material: Cesium.Color.GREEN.withAlpha(0.5),
          classificationType: Cesium.ClassificationType.TERRAIN, // 지형에 붙이기
        },
      });

    }
  }, [cesiumViewer])

  return (
    <div ref={viewContainerRef} style={{ position: "relative", width: "100%", height: "100vh" }}>
    </div>
  );
};

export default CesiumMap;
