import { useEffect } from "react";
import * as Cesium from "cesium";
import { useSyncContext } from "../../context/SyncContext";

export const useSyncZoom = ({ olMap, cesiumViewer }) => {
  const { zoomLevel, setZoomLevel } = useSyncContext();

  // OpenLayers 줌 동기화
  useEffect(() => {
    if (!olMap) return;

    const view = olMap.getView();

    const handleZoomChange = () => {
      const zoom = view.getZoom();
      if (zoom !== zoomLevel) {
        setZoomLevel(zoom);
      }
    };

    view.on("change:resolution", handleZoomChange);

    return () => {
      view.un("change:resolution", handleZoomChange);
    };
  }, [olMap, zoomLevel, setZoomLevel]);

  // Cesium 줌 동기화
  useEffect(() => {
    if (!cesiumViewer) return;

    const handleZoomChange = () => {
      const cameraHeight = cesiumViewer.scene.camera.positionCartographic.height;
      const cesiumZoom = Math.round(Math.log2(6378137 / cameraHeight)) - 1; // -1로 OpenLayers에 맞춤
      if (cesiumZoom !== zoomLevel) {
        setZoomLevel(cesiumZoom);
      }
    };

    cesiumViewer.camera.changed.addEventListener(handleZoomChange);

    return () => {
      cesiumViewer.camera.changed.removeEventListener(handleZoomChange);
    };
  }, [cesiumViewer, zoomLevel, setZoomLevel]);

  // 줌 레벨 변경 시 맵 동기화
  useEffect(() => {

  }, [zoomLevel, olMap, cesiumViewer]);
};
