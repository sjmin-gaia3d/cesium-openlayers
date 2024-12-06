import { useEffect, useRef } from "react";
import useInitOlMap from "../../hooks/init/useInitOlMap";
import { useSyncMap } from "../../hooks/sync/useSyncMap";
import { useSyncZoom } from "../../hooks/sync/useSyncZoom";
import useAdjustZoomRange from "../../hooks/zoom/useAdjustZoomRange";
import { LineString, Point, Polygon } from "ol/geom";
import { Feature } from "ol";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import useMapStore from "../../store/useMapStore";
import { useShallow } from "zustand/shallow";
const OpenLayersMap = () => {
    const mapRef = useRef(null);
    useInitOlMap(mapRef);

    const { olMap } = useMapStore(
        useShallow((state) => ({ olMap: state.olMap}))
      );

    // useSyncZoom({ olMap });
    // useAdjustZoomRange({ olMap });

    useEffect(() => {
        if (olMap) {
            
            // 점 생성
            const point = new Point(fromLonLat([127.024612, 37.5326]));
            const pointFeature = new Feature({ geometry: point });

            // 소스 및 레이어 추가
            const vectorSource = new VectorSource({ features: [pointFeature] });
            const vectorLayer = new VectorLayer({ source: vectorSource });
            olMap.addLayer(vectorLayer);


            // 선 생성
            const line = new LineString([
                fromLonLat([127.024612, 37.5326]),
                fromLonLat([126.978388, 37.566536]),
            ]);
            const lineFeature = new Feature({ geometry: line });

            // 소스 및 레이어 추가
            vectorSource.addFeature(lineFeature); // 기존 소스에 추가F

            const polygon = new Polygon([
                [
                  fromLonLat([127.024612, 37.5326]),
                  fromLonLat([126.978388, 37.566536]),
                  fromLonLat([127.035278, 37.582839]),
                  fromLonLat([127.024612, 37.5326]), // 닫힌 경로
                ],
              ]);
              const polygonFeature = new Feature({ geometry: polygon });
              
              // 소스 및 레이어 추가
              vectorSource.addFeature(polygonFeature);

        }
    }, [olMap])
    return (
        <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
    );
};

export default OpenLayersMap;
