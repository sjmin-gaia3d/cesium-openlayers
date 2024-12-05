import { useCallback, useEffect } from "react";
import { toLonLat, fromLonLat } from "ol/proj";
import * as Cesium from "cesium";
import { useSyncContext } from "../../context/SyncContext";

export const useSyncMap = ({ olMap, cesiumViewer }) => {
  const { isSyncActive, centerCoordinates, setCenterCoordinates, rotation, setRotation } = useSyncContext();

  const normalizeAngle = (angle) => ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  const cesiumToOlRotation = (cesiumHeading) => {
    const normalizedCesiumHeading = normalizeAngle(cesiumHeading);
    const openLayersRotation = -((normalizedCesiumHeading + Math.PI) % (2 * Math.PI) - Math.PI);
    console.log(
      `cesiumToOlRotation: CesiumHeading(${cesiumHeading}) -> OpenLayersRotation(${openLayersRotation})`
    );
    return openLayersRotation;
  };
  
  const olToCesiumRotation = (olRotation) => {
    const normalizedOlRotation = normalizeAngle(olRotation);
    const cesiumHeading = normalizeAngle(-normalizedOlRotation);
    console.log(
      `olToCesiumRotation: OlRotation(${olRotation}) -> CesiumHeading(${cesiumHeading})`
    );
    return cesiumHeading;
  };
  // 중심 좌표를 업데이트하는 공통 함수
  const updateCenter = useCallback(
    ({ lon, lat }) => {
      if (centerCoordinates.lon !== lon || centerCoordinates.lat !== lat) {
        setCenterCoordinates({ lon, lat });
      }
    }, [centerCoordinates]);

  // 회전값을 업데이트하는 공통 함수
  const updateRotation = useCallback(
    (newRotation, type) => {
      if (rotation !== newRotation) { // 값이 다를 경우에만 업데이트

        switch (type) {
          case "openLayers":
            // OpenLayers 값은 변환 후 Cesium 기준으로 저장
            const convertedRotation = olToCesiumRotation(newRotation);
            setRotation(convertedRotation);
            break;
          case "cesium":
            setRotation(newRotation);
            break;
        }
      }
    }, [rotation, olToCesiumRotation]);

  // OpenLayers에서 중심 좌표 가져오기
  const getOlMapCenter = useCallback(() => {
    if (!olMap) return;
    const center = olMap.getView().getCenter();
    if (center) {
      const [lon, lat] = toLonLat(center);
      return { lon, lat };
    }
    return;
  }, [olMap]);

  // Cesium에서 중심 좌표 가져오기
  const getCesiumCenter = useCallback(() => {
    if (!cesiumViewer) return;
    const camera = cesiumViewer.scene.camera;
    const cartographic = Cesium.Cartographic.fromCartesian(camera.position);
    const lon = Cesium.Math.toDegrees(cartographic.longitude);
    const lat = Cesium.Math.toDegrees(cartographic.latitude);
    return { lon, lat };
  }, [cesiumViewer]);

  // OpenLayers에서 회전값 가져오기
  const getOlMapRotation = useCallback(() => {
    if (!olMap) return 0;
    return olMap.getView().getRotation() || 0;
  }, [olMap]);

  // Cesium에서 회전값 가져오기
  const getCesiumRotation = useCallback(() => {
    if (!cesiumViewer) return 0;
    const camera = cesiumViewer.scene.camera;
    return camera.heading || 0;
  }, [cesiumViewer]);

  // OpenLayers 업데이트 핸들러
  const updateFromOlMap = useCallback(() => {
    const center = getOlMapCenter();
    const rotation = getOlMapRotation();
    if (center) updateCenter(center);
    if (rotation) updateRotation(rotation, "openLayers");
  }, [getOlMapCenter, updateCenter, getOlMapRotation, updateRotation]);

  // Cesium 업데이트 핸들러
  const updateFromCesium = useCallback(() => {
    const center = getCesiumCenter();
    const rotation = getCesiumRotation();
    if (center) updateCenter(center);
    if (rotation) updateRotation(rotation, "cesium");
  }, [getCesiumCenter, updateCenter, getCesiumRotation, updateRotation]);


  // 중심 좌표, 회전값을 OpenLayers로 동기화
  const syncToOlMap = useCallback(() => {
    if (!olMap) return;
    const view = olMap.getView();
    const newCenter = fromLonLat([centerCoordinates.lon, centerCoordinates.lat]);
    const newRotation = cesiumToOlRotation(rotation);
    view.setCenter(newCenter);
    view.setRotation(newRotation);

  }, [olMap, centerCoordinates, rotation, cesiumToOlRotation]);

  // 중심 좌표, 회전값을 Cesium으로 동기화
  const syncToCesium = useCallback(() => {
    if (!cesiumViewer) return;
    const camera = cesiumViewer.scene.camera;
    const cartographic = camera.positionCartographic;
    const newPosition = Cesium.Cartesian3.fromDegrees(
      centerCoordinates.lon,
      centerCoordinates.lat,
      cartographic.height
    );
    // const newHeading = rotation;

    camera.setView({
      destination: newPosition,
      orientation: {
        heading: rotation,
        pitch: camera.pitch,
        roll: camera.roll,
      },
    });
  }, [cesiumViewer, centerCoordinates, rotation]);

  // OpenLayers 이벤트 관리 함수
  const manageOlMapEvents = useCallback(
    (action, handler) => {
      if (!olMap || !handler) return;

      const view = olMap.getView();
      if (action === "add") {
        view.on("change:center", handler);
        view.on("change:rotation", handler);
      } else if (action === "remove") {
        view.un("change:center", handler);
        view.un("change:rotation", handler);
      }
    }, [olMap]);

  // Cesium 이벤트 관리 함수
  const manageCesiumEvents = useCallback(
    (action, handler) => {
      if (!cesiumViewer || !handler) return;

      const scene = cesiumViewer.scene;
      if (action === "add") {
        scene.postRender.addEventListener(handler);
      } else if (action === "remove") {
        scene.postRender.removeEventListener(handler);
      }
    }, [cesiumViewer]);

  // 이벤트 등록 및 해제
  useEffect(() => {

    // OpenLayers 이벤트 등록
    manageOlMapEvents("add", updateFromOlMap);
    // Cesium 이벤트 등록
    manageCesiumEvents("add", updateFromCesium);

    return () => {
      // OpenLayers 이벤트 해제
      manageOlMapEvents("remove", updateFromOlMap);
      // Cesium 이벤트 해제
      manageCesiumEvents("remove", updateFromCesium);
    };
  }, [manageOlMapEvents, manageCesiumEvents]);

  // map 동기화
  useEffect(() => {
    if (!isSyncActive) return; // 동기화가 비활성화 상태라면 동기화 수행하지 않음

    syncToOlMap();
    syncToCesium();
  }, [isSyncActive, centerCoordinates.lat, centerCoordinates.lon, rotation]);

  useEffect(() => {
    console.log(rotation);
  }, [rotation])
};
