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
import { Point, Polygon } from 'ol/geom';
import { Feature } from 'ol';

// map object -> selectedObject

// OpenLayers Feature -> selectedObject
export const convertFeatureToStoreSelectedObject = (feature) => {
    if (!feature) return null;
    console.log("utils",feature)
    const geometry = feature.getGeometry();

    return {
        id: feature.getId() || null,
        from: FROM_TYPES.OPEN_LAYERS,
        type: geometry?.getType() || null,
        style: feature.getStyle() || null,
        coordinates: olToWGS84(geometry.getCoordinates()),
        meta: createMetaData()
    };
};

// Cesium Entity -> selectedObject
export const convertEntityToStoreSelectedObject = (entity) => {
    if (!entity) return null;

    let type = null;
    let coordinates = [];

    if (entity.point) {
        type = 'Point';
        coordinates = cesiumToWGS84([entity.position?.getValue(Cesium.JulianDate.now())])[0];
    } else if (entity.polyline) {
        type = 'LineString';
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
        type,
        style: {
            color: entity.point?.color?.getValue(Cesium.JulianDate.now()),
            pixelSize: entity.point?.pixelSize?.getValue(Cesium.JulianDate.now()),
        },
        coordinates,
        meta: createMetaData()
    };
};

// select object -> map object


// selectedObject -> OpenLayers Feature
export const convertStoreSelectedObjectToFeature = (selectedObject) => {
    if (!selectedObject) return null;

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
                feature.setId('cesium-'+id)
                // 스타일 적용
                if (style) {
                    const { color, pixelSize } = style;
                    // feature.setStyle(new Style({
                    //     image: new Circle({
                    //         radius: pixelSize || 5,
                    //         fill: new Fill({
                    //             color: `rgba(${color.red * 255}, ${color.green * 255}, ${color.blue * 255}, ${color.alpha})`,
                    //         }),
                    //     }),
                    // }));
                }

                return feature;
            }
        case "Polygon": {
            const { coordinates, id, style, meta } = selectedObject;

            // 좌표 변환: WGS84 -> EPSG:3857
            const transformedCoordinates = wgs84ToOl(coordinates);

            // 지오메트리 생성
            const geometry = new Polygon(transformedCoordinates);

            // Feature 생성
            const feature = new Feature({
                geometry,
                meta, // 메타데이터 포함
            });
            feature.setId('cesium-'+id)
            // 스타일 적용
            if (style) {
                const { color, pixelSize } = style;
                // feature.setStyle(new Style({
                //     image: new Circle({
                //         radius: pixelSize || 5,
                //         fill: new Fill({
                //             color: `rgba(${color.red * 255}, ${color.green * 255}, ${color.blue * 255}, ${color.alpha})`,
                //         }),
                //     }),
                // }));
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
    switch (selectedObject.type) {
        case "Point":
            {
                const { coordinates, id, style, meta } = selectedObject;

                // 좌표 변환: WGS84 -> EPSG:3857
                const transformedCoordinates = wgs84ToCesium(coordinates);

                // 지오메트리 생성
                const entity = new Cesium.Entity({
                    position: transformedCoordinates,
                    point: { pixelSize: 10, color: Cesium.Color.RED },
                    meta: meta,
                    id: id
                });
                return entity;
            }
        default:
            break;
    }
}