import { useCallback } from "react";
import * as OpenLayersFeatureUtils from "../../utils/openlayersFeatureUtils";

const defaultCoordinates = {
    point: { lon: 127.024612, lat: 37.5326 },
    line: {
        startPoint: { lon: 127.024612, lat: 37.5326 },
        endPoint: { lon: 126.978388, lat: 37.566536 },
    },
    polygon: [
        [
            [127.024612, 37.5326],
            [126.978388, 37.566536],
            [127.035278, 37.582839],
            [127.024612, 37.5326],
        ],
    ],
};

export const useHandlers = (olMap) => {
    if (!olMap) {
        console.warn("OpenLayers map 객체가 유효하지 않습니다.");
    }

    const handleAddPoint = useCallback(() => {
        OpenLayersFeatureUtils.addPoint(olMap, defaultCoordinates.point, 'point');
    }, [olMap]);

    const handleAddLineString = useCallback(() => {
        const { startPoint, endPoint } = defaultCoordinates.line;
        OpenLayersFeatureUtils.addLineString(olMap, startPoint, endPoint, 'lineString');
    }, [olMap]);

    const handleAddPolygon = useCallback(() => {
        OpenLayersFeatureUtils.addPolygon(olMap, defaultCoordinates.polygon, 'polygon');
    }, [olMap]);

    const handleRemovePoint = useCallback(() => {
        OpenLayersFeatureUtils.removePoint(olMap, 'point');
    }, [olMap]);

    const handleRemoveLineString = useCallback(() => {
        OpenLayersFeatureUtils.removeLineString(olMap, 'lineString');
    }, [olMap]);

    const handleRemovePolygon = useCallback(() => {
        OpenLayersFeatureUtils.removePolygon(olMap, 'polygon');
    }, [olMap]);

    return {
        handleAddPoint,
        handleAddLineString,
        handleAddPolygon,
        handleRemovePoint,
        handleRemoveLineString,
        handleRemovePolygon,
    };
};
