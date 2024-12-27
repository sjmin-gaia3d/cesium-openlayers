import * as Cesium from "cesium";
import { v4 as uuidv4 } from 'uuid';

const createPoint = (position, id = uuidv4()) => {
    return new Cesium.Entity({
        id,
        position,
        point: {
            pixelSize: 10,
            color: Cesium.Color.RED,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
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
            clampToGround: true,
        },
    })
};

const createPolygon = (hierarchy, id = uuidv4()) => {
    return new Cesium.Entity({
        id,
        polygon: {
            hierarchy,
            material: Cesium.Color.GREEN.withAlpha(0.5),
            classificationType: Cesium.ClassificationType.TERRAIN,
        },
    })
};

const createVertexEntities = (positions) => {
    return positions.map((position) => createPoint(position));
}

const updatePolylineVertices = (polylineEntity, vertexEntities) => {
    const positions = vertexEntities.map((entity) => entity.position.getValue(Cesium.JulianDate.now()));
    polylineEntity.polyline.positions = positions;
};

const updatePolygonVertices = (polygonEntity, vertexEntities) => {
    const hierarchy = vertexEntities.map((entity) => entity.position.getValue(Cesium.JulianDate.now()));
    polygonEntity.polygon.hierarchy = new Cesium.PolygonHierarchy(hierarchy);
};

const cesiumEntityUtils = {
    createPoint,
    createPolyline,
    createPolygon,
    createVertexEntities,
    updatePolylineVertices,
    updatePolygonVertices
};

export default cesiumEntityUtils;