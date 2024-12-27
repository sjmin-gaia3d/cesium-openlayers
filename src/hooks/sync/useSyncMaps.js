import { useCallback, useEffect, useState } from "react";
import useMapStore from "../../store/useMapStore.js";
import { useShallow } from "zustand/shallow";
import { fromLonLat, toLonLat } from "ol/proj.js";
import * as Cesium from "cesium";

const UseSyncMaps = () => {
    const [isSyncActive, setIsSyncActive] = useState(false); // 상태 관리
    const [cesiumPointEntity, setCesiumPointEntity] = useState(null); // 중심 좌표 포인트 관리

    const toggleSync = () => {
        setIsSyncActive((prev) => !prev);
    };

    const { cesiumViewer, olMap } = useMapStore(
        useShallow((state) => ({
            cesiumViewer: state.cesiumViewer,
            olMap: state.olMap,
        }))
    );

    let isUpdatingFromCesium = false; // Cesium에서 업데이트 중인지 추적
    let isUpdatingFromOpenLayers = false; // OpenLayers에서 업데이트 중인지 추적

    // OpenLayers 중심 좌표 가져오기
    const getOlMapCenter = useCallback(() => {
        if (!olMap) return null;
        const center = olMap.getView().getCenter();
        if (!center) return null;
        const [lon, lat] = toLonLat(center);
        return { lon, lat };
    }, [olMap]);

    // OpenLayers 회전 값 가져오기
    const getOlMapRotation = useCallback(() => {
        if (!olMap) return 0;
        const rotation = olMap.getView().getRotation() || 0;
        return rotation; // OpenLayers는 라디안 사용
    }, [olMap]);

    // Cesium 중심 좌표 가져오기
    const getCesiumCenter = useCallback(() => {
        if (!cesiumViewer) return null;

        const scene = cesiumViewer.scene;
        const camera = scene.camera;

        const ray = camera.getPickRay(
            new Cesium.Cartesian2(
                scene.canvas.clientWidth / 2,
                scene.canvas.clientHeight / 2
            )
        );
        const intersection = scene.globe.pick(ray, scene);

        if (!intersection) return null;
        const cartographic = Cesium.Cartographic.fromCartesian(intersection);
        const lon = Cesium.Math.toDegrees(cartographic.longitude);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        return { lon, lat };
    }, [cesiumViewer]);

    // Cesium 중심 좌표 포인트 관리 (값 변경)
    const updateCesiumPoint = useCallback(
        (coordinates) => {
            if (!cesiumViewer || !coordinates) return;

            const { lon, lat } = coordinates;

            if (!cesiumPointEntity) {
                // 처음 생성 시 엔티티 추가
                const pointEntity = cesiumViewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(lon, lat),
                    point: {
                        pixelSize: 10, // 포인트 크기
                        color: Cesium.Color.RED.withAlpha(0.8), // 포인트 색상
                        outlineColor: Cesium.Color.WHITE, // 외곽선 색상
                        outlineWidth: 2, // 외곽선 두께
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    },
                });
                setCesiumPointEntity(pointEntity);
            } else {
                // 기존 포인트의 위치만 변경
                cesiumPointEntity.position = Cesium.Cartesian3.fromDegrees(lon, lat);
            }
        },
        [cesiumViewer, cesiumPointEntity]
    );

    // OpenLayers → Cesium 업데이트
    useEffect(() => {
        if (!olMap || !cesiumViewer || !isSyncActive) return;

        const updateCesiumFromOpenLayers = () => {
            if (isUpdatingFromCesium) return;
            isUpdatingFromOpenLayers = true;

            const openLayersCenter = getOlMapCenter();
            const openLayersRotation = getOlMapRotation();

            if (!openLayersCenter) return;

            const camera = cesiumViewer.scene.camera;
            const cartographic = camera.positionCartographic;

            const newCenter = Cesium.Cartesian3.fromDegrees(
                openLayersCenter.lon,
                openLayersCenter.lat,
                cartographic.height
            );

            camera.setView({
                destination: newCenter,
                orientation: {
                    heading: openLayersRotation, // OpenLayers의 회전 값을 Cesium에 반영
                    pitch: camera.pitch,
                    roll: camera.roll,
                },
            });

            // 중심 좌표에 포인트 표시
            updateCesiumPoint(openLayersCenter);

            isUpdatingFromOpenLayers = false;
        };

        olMap.getView().on("change:center", updateCesiumFromOpenLayers);
        olMap.getView().on("change:rotation", updateCesiumFromOpenLayers);

        return () => {
            olMap.getView().un("change:center", updateCesiumFromOpenLayers);
            olMap.getView().un("change:rotation", updateCesiumFromOpenLayers);
        };
    }, [olMap, cesiumViewer, getOlMapCenter, getOlMapRotation, updateCesiumPoint, isSyncActive]);

    const getCesiumRotation = useCallback(() => {
        if (!cesiumViewer) return 0; // CesiumViewer가 없을 경우 0 반환
        const camera = cesiumViewer.scene.camera;
        return camera.heading; // Cesium 카메라의 heading 반환 (라디안 단위)
    }, [cesiumViewer]);

    // Cesium → OpenLayers 업데이트
    useEffect(() => {
        if (!cesiumViewer || !olMap || !isSyncActive) return;

        const updateOpenLayersFromCesium = () => {
            if (isUpdatingFromOpenLayers) return;
            isUpdatingFromCesium = true;

            const cesiumCenter = getCesiumCenter();
            const cesiumRotation = getCesiumRotation();

            if (!cesiumCenter) return;

            const newCenter = fromLonLat([cesiumCenter.lon, cesiumCenter.lat]);
            olMap.getView().setCenter(newCenter);
            olMap.getView().setRotation(cesiumRotation); // Cesium의 회전 값을 OpenLayers에 반영

            // 중심 좌표에 포인트 표시
            updateCesiumPoint(cesiumCenter);

            isUpdatingFromCesium = false;
        };

        cesiumViewer.scene.preRender.addEventListener(
            updateOpenLayersFromCesium
        );

        return () => {
            cesiumViewer.scene.preRender.removeEventListener(
                updateOpenLayersFromCesium
            );
        };
    }, [cesiumViewer, olMap, getCesiumCenter, getCesiumRotation, updateCesiumPoint, isSyncActive]);

    return { isSyncActive, toggleSync };
};

export default UseSyncMaps;
