import { Feature } from "ol";
import { LineString, Point, Polygon } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";

// 레이어 ID 상수
const LAYER_IDS = {
    POINTS: 'points-layer',
    LINES: 'lines-layer',
    POLYGONS: 'polygons-layer',
};

// 레이어를 가져오거나 생성
const getOrCreateLayer = (olMap, layerId) => {
    if (!olMap) {
        throw new Error("OpenLayers map 객체가 유효하지 않습니다.");
    }

    let layer = olMap.getLayers().getArray().find(l => l.get('id') === layerId);
    if (!layer) {
        layer = new VectorLayer({ source: new VectorSource() });
        layer.set('id', layerId);
        olMap.addLayer(layer);
    }
    return layer;
};

// Feature 추가 로직
const addFeatureToLayer = (olMap, geometry, id, layerId) => {
    const layer = getOrCreateLayer(olMap, layerId);
    const source = layer.getSource();

    if (source.getFeatureById(id)) {
        console.warn(`Feature ID ${id}가 이미 존재합니다.`);
        return;
    }

    const feature = new Feature({ geometry });
    feature.setId(id);
    source.addFeature(feature);

    console.log(`Feature ID ${id}가 레이어 ${layerId}에 추가되었습니다.`);
};

// Feature 삭제 로직
const removeFeatureFromLayer = (olMap, id, layerId) => {
    const layer = olMap.getLayers().getArray().find(l => l.get('id') === layerId);
    if (!layer) {
        console.warn(`Layer ID ${layerId}를 찾을 수 없습니다.`);
        return;
    }

    const source = layer.getSource();
    const feature = source.getFeatureById(id);
    if (!feature) {
        console.warn(`Feature ID ${id}를 찾을 수 없습니다.`);
        return;
    }

    source.removeFeature(feature);
    console.log(`Feature ID ${id}가 레이어 ${layerId}에서 삭제되었습니다.`);
};

// 점 추가 및 삭제
export const addPoint = (olMap, point, id) => {
    const geometry = new Point(fromLonLat([point.lon, point.lat]));
    addFeatureToLayer(olMap, geometry, id, LAYER_IDS.POINTS);
};

export const removePoint = (olMap, id) => {
    removeFeatureFromLayer(olMap, id, LAYER_IDS.POINTS);
};

// 선 추가 및 삭제
export const addLineString = (olMap, startPoint, endPoint, id) => {
    const geometry = new LineString([
        fromLonLat([startPoint.lon, startPoint.lat]),
        fromLonLat([endPoint.lon, endPoint.lat]),
    ]);
    addFeatureToLayer(olMap, geometry, id, LAYER_IDS.LINES);
};

export const removeLineString = (olMap, id) => {
    removeFeatureFromLayer(olMap, id, LAYER_IDS.LINES);
};

// 폴리곤 추가 및 삭제
export const addPolygon = (olMap, coordinates, id) => {
    const transformedCoordinates = coordinates.map(coord => coord.map(point => fromLonLat(point)));
    const geometry = new Polygon(transformedCoordinates);
    addFeatureToLayer(olMap, geometry, id, LAYER_IDS.POLYGONS);
};

export const removePolygon = (olMap, id) => {
    removeFeatureFromLayer(olMap, id, LAYER_IDS.POLYGONS);
};
