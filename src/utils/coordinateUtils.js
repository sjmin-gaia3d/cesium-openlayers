import { fromLonLat, toLonLat } from "ol/proj";
import * as Cesium from 'cesium';

export const olToWGS84 = (olCoordinates) => {
    if (!Array.isArray(olCoordinates)) {
        console.error("Invalid input: olCoordinates must be an array.");
        return [];
    }

    // 단일 좌표 [x, y] 처리
    if (typeof olCoordinates[0] === "number") {
        const [lon, lat] = toLonLat(olCoordinates);
        return [lon, lat, 0];
    }

    // LineString [[x1, y1], [x2, y2], ...] 처리
    if (Array.isArray(olCoordinates[0]) && typeof olCoordinates[0][0] === "number") {
        return olCoordinates.map((coord) => {
            const [lon, lat] = toLonLat(coord);
            return [lon, lat, 0];
        });
    }

    // Polygon [[[x1, y1], [x2, y2], ...], ...] 처리
    if (
        Array.isArray(olCoordinates[0]) &&
        Array.isArray(olCoordinates[0][0]) &&
        typeof olCoordinates[0][0][0] === "number"
    ) {
        return olCoordinates.map((ring) =>
            ring.map((coord) => {
                const [lon, lat] = toLonLat(coord);
                return [lon, lat, 0];
            })
        );
    }

    console.error("Unsupported coordinate structure:", olCoordinates);
    return [];
};

export const wgs84ToOl = (coordinates) => {
    if (!Array.isArray(coordinates)) {
        console.error("Invalid input: coordinates must be an array.");
        return [];
    }

    // 단일 좌표 [lon, lat] 처리
    if (typeof coordinates[0] === "number") {
        return fromLonLat(coordinates);
    }

    // LineString [[lon1, lat1], [lon2, lat2], ...] 처리
    if (Array.isArray(coordinates[0]) && typeof coordinates[0][0] === "number") {
        return coordinates.map(([lon, lat]) => fromLonLat([lon, lat]));
    }

    // Polygon [[[lon1, lat1], [lon2, lat2], ...], ...] 처리
    if (
        Array.isArray(coordinates[0]) &&
        Array.isArray(coordinates[0][0]) &&
        typeof coordinates[0][0][0] === "number"
    ) {
        return coordinates.map((ring) =>
            ring.map(([lon, lat]) => fromLonLat([lon, lat]))
        );
    }

    console.error("Unsupported coordinate structure:", coordinates);
    return [];
};


export const cesiumToWGS84 = (cesiumCoordinates) =>
    cesiumCoordinates.map((cartesian) => {
        const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        return [
            Cesium.Math.toDegrees(cartographic.longitude),
            Cesium.Math.toDegrees(cartographic.latitude),
            cartographic.height || 0,
        ];
    });


export const wgs84ToCesium = (coordinates) => {
    if (!Array.isArray(coordinates)) {
        console.error("Invalid input: coordinates must be an array.");
        return [];
    }

    // 단일 좌표 [lon, lat, height] 처리
    if (typeof coordinates[0] === "number") {
        const [lon, lat, height] = coordinates;
        return Cesium.Cartesian3.fromDegrees(lon, lat, height || 0);
    }

    // Polyline [[lon1, lat1, height1], [lon2, lat2, height2], ...] 처리
    if (Array.isArray(coordinates[0]) && typeof coordinates[0][0] === "number") {
        return coordinates.map(([lon, lat, height]) =>
            Cesium.Cartesian3.fromDegrees(lon, lat, height || 0)
        );
    }

    // Polygon [[[lon1, lat1, height1], [lon2, lat2, height2], ...], ...] 처리
    if (
        Array.isArray(coordinates[0]) &&
        Array.isArray(coordinates[0][0]) &&
        typeof coordinates[0][0][0] === "number"
    ) {
        return coordinates.map((ring) =>
            ring.map(([lon, lat, height]) =>
                Cesium.Cartesian3.fromDegrees(lon, lat, height || 0)
            )
        );
    }

    console.error("Unsupported coordinate structure:", coordinates);
    return [];
};