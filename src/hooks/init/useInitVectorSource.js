import { useEffect } from 'react';
import { Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import useVectorSourceStore from '../../store/useVectorSourceStore';
import useMapStore from '../../store/useMapStore';
import { useShallow } from 'zustand/shallow';

const useInitVectorSource = () => {
    const { olMap } = useMapStore(
        useShallow(
            (state) => ({ olMap: state.olMap })
        )
    );

    const setVectorSource = useVectorSourceStore(
        useShallow(
            (state) => state.setVectorSource
        )
    );

    useEffect(() => {
        if (!olMap) return;

        // 1. 벡터 소스 생성
        const vectorSource = new VectorSource();
        setVectorSource(vectorSource);

        // 2. 벡터 레이어 생성 및 추가
        const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: new Style({
                fill: new Fill({ color: 'rgba(255, 255, 255, 0.2)' }),
                stroke: new Stroke({ color: '#ffcc33', width: 2 }),
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({ color: '#ffcc33' }),
                }),
            }),
        });

        olMap.addLayer(vectorLayer);

        // Clean up on unmount
        return () => {
            olMap.removeLayer(vectorLayer);
        };
    }, [olMap, setVectorSource]);
};

export default useInitVectorSource;
