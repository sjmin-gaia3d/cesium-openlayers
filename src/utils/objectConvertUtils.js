import * as Cesium from 'cesium';

// 공통 메타 데이터 생성
const createMetaData = () => ({
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
});
const FROM_TYPES = {
    CESIUM: 'Cesium',
    OPEN_LAYERS: 'OpenLayers'
}
import { olToWGS84, cesiumToWGS84, wgs84ToOl, wgs84ToCesium } from './coordinateUtils';
import { LineString, Point, Polygon } from 'ol/geom';
import { Feature } from 'ol';

// OpenLayers Feature -> Cesium Entity 변환 함수
export const featureToEntity = (feature) => {
    const geometry = feature.getGeometry();
    const type = geometry.getType(); // Geometry 타입 (Point, LineString, Polygon 등)

    let entity;
    switch (type) {
        case 'Point':
            {
                const coordinates = geometry.getCoordinates(); // [lon, lat]
                entity = new Cesium.Entity({
                    position: Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1]),
                    point: {
                        pixelSize: 10,
                        color: Cesium.Color.BLUE,
                    },
                });
                break;
            }

        case 'LineString':
            {
                const lineCoordinates = geometry.getCoordinates(); // [[lon1, lat1], [lon2, lat2], ...]
                entity = new Cesium.Entity({
                    polyline: {
                        positions: Cesium.Cartesian3.fromDegreesArray(
                            lineCoordinates.flat()
                        ),
                        width: 2,
                        material: Cesium.Color.RED,
                    },
                });
                break;
            }

        case 'Polygon':
            {
                const polygonCoordinates = geometry.getCoordinates()[0]; // 외곽선 좌표 [[lon1, lat1], ...]
                entity = new Cesium.Entity({
                    polygon: {
                        hierarchy: new Cesium.PolygonHierarchy(
                            Cesium.Cartesian3.fromDegreesArray(polygonCoordinates.flat())
                        ),
                        material: Cesium.Color.YELLOW.withAlpha(0.5),
                    },
                });
                break;
            }

        default:
            console.error('Unsupported geometry type:', type);
    }

    return entity;
}


// Cesium Entity -> OpenLayers Feature 변환 함수
export const entityToFeature = (entity) => {
    if (!entity || !entity.position) {
        console.error('Invalid entity');
        return;
    }

    // 현재 시간 기준으로 위치 가져오기
    const position = entity.position.getValue(Cesium.JulianDate.now());
    if (!position) return;

    const cartographic = Cesium.Cartographic.fromCartesian(position);
    const lon = Cesium.Math.toDegrees(cartographic.longitude);
    const lat = Cesium.Math.toDegrees(cartographic.latitude);

    // OpenLayers Feature 생성
    const olGeometry = new Point([lon, lat]);
    const feature = new Feature({
        geometry: olGeometry,
    });

    // 추가 속성 매핑 (Entity의 name 또는 속성 데이터를 Feature에 추가)
    if (entity.name) {
        feature.set('name', entity.name);
    }
    return feature;
}


// map object -> selectedObject

// OpenLayers Feature -> selectedObject
export const convertFeatureToStoreSelectedObject = (feature, activate) => {
    if (!feature) return null;
    console.log("utils", feature)
    const geometry = feature.getGeometry();

    return {
        id: feature.getId() || null,
        from: FROM_TYPES.OPEN_LAYERS,
        type: geometry?.getType() || null,
        activate: activate,
        coordinates: olToWGS84(geometry.getCoordinates()),
        meta: createMetaData()
    };
};

// Cesium Entity -> selectedObject
export const convertEntityToStoreSelectedObject = (entity, activate) => {
    if (!entity) return null;

    let type = null;
    let coordinates = [];

    if (entity.point) {
        type = 'Point';
        coordinates = cesiumToWGS84([entity.position?.getValue(Cesium.JulianDate.now())])[0];
    } else if (entity.polyline) {
        type = 'PolyLine';
        coordinates = cesiumToWGS84(entity.polyline.positions?.getValue(Cesium.JulianDate.now()) || []);
    } else if (entity.polygon) {
        type = 'Polygon';
        coordinates = cesiumToWGS84(
            entity.polygon.hierarchy?.getValue(Cesium.JulianDate.now())?.positions || []
        );
    }

    return {
        id: entity.id || null,
        from: FROM_TYPES.CESIUM,
        type: type,
        activate: activate,
        style: {
            color: entity.point?.color?.getValue(Cesium.JulianDate.now()),
            pixelSize: entity.point?.pixelSize?.getValue(Cesium.JulianDate.now()),
        },
        coordinates: coordinates,
        meta: createMetaData()
    };
};

// select object -> map object

// selectedObject -> OpenLayers Feature
export const convertStoreSelectedObjectToFeature = (selectedObject) => {
    if (!selectedObject) return null;
    console.log("selectedObject.type: ", selectedObject.type);

    switch (selectedObject.type) {
        case "Point":
            {
                const { coordinates, id, style, meta } = selectedObject;

                // 좌표 변환: WGS84 -> EPSG:3857
                const transformedCoordinates = wgs84ToOl(coordinates);
                // 지오메트리 생성
                const geometry = new Point(transformedCoordinates);

                // Feature 생성
                const feature = new Feature({
                    geometry,
                    meta, // 메타데이터 포함
                });
                feature.setId(id)
                // 스타일 적용
                if (style) {
                    const { color, pixelSize } = style;
                }

                return feature;
            }
        case "PolyLine":
            {
                const { coordinates, id, style, meta } = selectedObject;

                // 좌표 변환: WGS84 -> EPSG:3857
                console.log("Line coordinates: ", coordinates)
                const transformedCoordinates = wgs84ToOl(coordinates);
                console.log("transformedCoordinates: ", transformedCoordinates)
                // 지오메트리 생성
                const geometry = new LineString(transformedCoordinates);

                // Feature 생성
                const feature = new Feature({
                    geometry,
                    meta, // 메타데이터 포함
                });
                feature.setId(id)
                // 스타일 적용
                if (style) {
                    const { color, pixelSize } = style;
                }
                return feature;
            }
        case "Polygon": {
            const { coordinates, id, style, meta } = selectedObject;

            // 좌표 변환: WGS84 -> EPSG:3857
            const transformedCoordinates = coordinates.map((ring) => wgs84ToOl(ring));
            console.log("polygon transformedCoordinates:", transformedCoordinates);
            // 지오메트리 생성
            const geometry = new Polygon([transformedCoordinates]); // [[[]]]] 구조가 필요

            // Feature 생성
            const feature = new Feature({
                geometry,
                meta, // 메타데이터 포함
            });
            feature.setId(id)
            // 스타일 적용
            if (style) {
                const { color, pixelSize } = style;
            }
            console.log("Polygon add!")
            return feature;
        }
        default:
            console.warn(`Unsupported type: ${selectedObject.type}`);
            return null;
    }
};

// selectedObject -> Cesium Entity
export const convertStoreSelectedObjectToEntity = (selectedObject) => {
    if (!selectedObject) return null;
    console.log("selectedObject.type: ", selectedObject.type)
    switch (selectedObject.type) {
        case "Point":
            {
                const { coordinates, id, style, meta } = selectedObject;

                // 좌표 변환: WGS84 -> EPSG:3857
                const transformedCoordinates = wgs84ToCesium(coordinates);
                console.log("Point coordinates:", transformedCoordinates);
                // 지오메트리 생성
                const entity = new Cesium.Entity({
                    position: transformedCoordinates,
                    point: { pixelSize: 10, color: Cesium.Color.RED },
                    meta: meta,
                    id: id
                });
                return entity;
            }
        case "LineString":
            {
                const { coordinates, id, style, meta } = selectedObject;

                // 좌표 변환: WGS84 -> EPSG:3857
                const transformedCoordinates = wgs84ToCesium(coordinates);
                console.log("LineString coordinates:", transformedCoordinates);

                // Entity 생성
                const entity = new Cesium.Entity({
                    polyline: {
                        positions: transformedCoordinates,
                        width: 5,
                        material: Cesium.Color.BLUE,
                    },
                    id,
                    meta,
                });
                return entity;
            }
        case "Polygon":
            {
                const { coordinates, id, style, meta } = selectedObject;

                // 좌표 변환: WGS84 -> EPSG:3857
                const transformedCoordinates = wgs84ToCesium(coordinates[0]); // 하드코딩
                console.log("polygon coordinates:", transformedCoordinates);
                // Polygon Hierarchy 생성
                const hierarchy = new Cesium.PolygonHierarchy(transformedCoordinates, []);

                // Entity 생성
                const entity = new Cesium.Entity({
                    polygon: {
                        hierarchy: hierarchy,
                        material: Cesium.Color.GREEN.withAlpha(0.5),
                    },
                    id,
                    meta,
                });
                return entity;
            }
        default:
            console.warn(`Unsupported type: ${selectedObject.type}`);
            return null;
    }
}