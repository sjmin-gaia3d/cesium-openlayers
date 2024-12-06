import { useEffect, useState } from 'react'
import * as Cesium from "cesium";
import useMapStore from '../../store/useMapStore';
import { useShallow } from 'zustand/shallow';

const OSM_TILE_URL = import.meta.env.VITE_OSM_TILE_URL;

const useLoadOsmLayer = () => {
    const { cesiumViewer } = useMapStore(
        useShallow((state) => ({ cesiumViewer: state.cesiumViewer}))
      );
    const [osmLayer, setOsmLayer] = useState(null);

    useEffect(() => {
        if (!cesiumViewer) return;
        const loadOsmLayer = () => {
            const layer = new Cesium.ImageryLayer(
                new Cesium.OpenStreetMapImageryProvider({ url: OSM_TILE_URL }),
                { show: false }
            );
            cesiumViewer.imageryLayers.add(layer);
            setOsmLayer(layer)
        };
        loadOsmLayer();
    }, [cesiumViewer]);

    return { osmLayer }
}

export default useLoadOsmLayer