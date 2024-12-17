import * as Cesium from "cesium";
import { v4 as uuidv4 } from 'uuid'; // UUID 라이브러리 사용

const createPoint = (position, id = uuidv4()) => {
    return new Cesium.Entity({
        id,
        position,
        point: {
            pixelSize: 10,
            color: Cesium.Color.RED,
        },
    })
};

const createPolyline = (positions, id = uuidv4()) => {
    return new Cesium.Entity({
        id,
        polyline: {
            positions,
            width: 5,
            material: Cesium.Color.BLUE,
        },
    })
};

const createPolygon = (hierarchy, id = uuidv4()) => {
    return new Cesium.Entity({
        id,
        polygon: {
            hierarchy,
            material: Cesium.Color.GREEN.withAlpha(0.5),
        },
    })
};

const cesiumEntityUtils = {
    createPoint,
    createPolyline,
    createPolygon,
};

export default cesiumEntityUtils;