import { useCallback, useEffect, useState } from "react";
import useMapStore from "../../store/useMapStore.js";
import { useShallow } from "zustand/shallow";
import { fromLonLat, toLonLat } from "ol/proj.js";
import * as Cesium from "cesium";

const UseSyncMaps = () => {
    const [ isSyncActive, setIsSyncActive ] = useState( false ); // useState로 상태 관리

    const toggleSync = () => {
        setIsSyncActive( ( prev ) => !prev ); // 상태 업데이트
    };

    const { cesiumViewer, olMap, centerCoordinates, setCenterCoordinates, rotation, setRotation } = useMapStore(
        useShallow( ( state ) => ({
            cesiumViewer: state.cesiumViewer,
            olMap: state.olMap,
            centerCoordinates: state.centerCoordinates, setCenterCoordinates: state.setCenterCoordinates,
            rotation: state.rotation, setRotation: state.setRotation,
        }) )
    );

    // OpenLayers에서 중심 좌표 가져오기
    const getOlMapCenter =  () => {
        if ( !olMap ) return;
        const center = olMap.getView().getCenter();
        if ( !center ) return;
        const [ lon, lat ] = toLonLat( center );
        return { lon, lat };
    }

    // Cesium에서 중심 좌표 가져오기
    const getCesiumCenter = useCallback(() => {
        if (!cesiumViewer) return null;

        const scene = cesiumViewer.scene;
        const camera = scene.camera;

        const ray = camera.getPickRay(new Cesium.Cartesian2(
            scene.canvas.clientWidth / 2,
            scene.canvas.clientHeight / 2
        ));
        const intersection = scene.globe.pick(ray, scene);

        if (!intersection) return null;
        const cartographic = Cesium.Cartographic.fromCartesian(intersection);
        const lon = Cesium.Math.toDegrees(cartographic.longitude);
        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        return { lon, lat };
    },[cesiumViewer])

    useEffect( () => {
        if (!olMap || !isSyncActive) return;
        const updateCesiumFromOpenLayers = () => {
            // console.log("From OpenLayers")
            const openLayersCenter = getOlMapCenter()
            const camera = cesiumViewer.scene.camera;
            const cartographic = camera.positionCartographic;

            const newCenter = Cesium.Cartesian3.fromDegrees(openLayersCenter.lon, openLayersCenter.lat, cartographic.height)

            camera.setView({
                destination: newCenter,
                orientation: {
                    heading: camera.rotation,
                    pitch: camera.pitch,
                    roll: camera.roll,
                },
            });
        }
        olMap.getView().on('change:center', updateCesiumFromOpenLayers);

        return () => {
            olMap.getView().un('change:center', updateCesiumFromOpenLayers);
        };
    }, [getOlMapCenter, olMap, isSyncActive] );



    useEffect(() => {
        if (!cesiumViewer || !isSyncActive) return;
        const updateOpenLayersFromCesium = () => {
            console.log("FromCesium")
            const cesiumCenter = getCesiumCenter();
            const newCenter = fromLonLat([cesiumCenter.lon, cesiumCenter.lat])
            olMap.getView().setCenter(newCenter)
        }
        cesiumViewer.scene.camera.changed.addEventListener(updateOpenLayersFromCesium);

        return () => {
            cesiumViewer.scene.camera.changed.removeEventListener(updateOpenLayersFromCesium);
        };
    }, [cesiumViewer, getCesiumCenter, isSyncActive]);


    return { isSyncActive, toggleSync }
};

export default UseSyncMaps;