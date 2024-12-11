import { fromLonLat, toLonLat } from "ol/proj";
import * as Cesium from "cesium";

export const normalizeAngle = (angle) => ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

export const cesiumToOlRotation = (cesiumHeading) => {
    const normalizedCesiumHeading = normalizeAngle(cesiumHeading);
    return -((normalizedCesiumHeading + Math.PI) % (2 * Math.PI) - Math.PI);
};

export const olToCesiumRotation = (olRotation) => {
    const normalizedOlRotation = normalizeAngle(olRotation);
    return normalizeAngle(-normalizedOlRotation);
};

export const olToCesiumCoordinates = (olCoordinates) => {
    // OpenLayers 좌표 → Cesium 좌표 변환
    return olCoordinates.map((coord) => {
        const [lon, lat] = toLonLat(coord);
        return [lon, lat];
    });
};

export const cesiumToOlCoordinates = (cesiumCoordinates) => {
    // Cesium 좌표 → OpenLayers 좌표 변환
    return cesiumCoordinates.map((cartesian) => {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        return fromLonLat([Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude)]);
    });
};