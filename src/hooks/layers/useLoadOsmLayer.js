import React, { useEffect, useState } from 'react'
import * as Cesium from "cesium";

const OSM_TILE_URL = import.meta.env.VITE_OSM_TILE_URL;

const useLoadOsmLayer = (viewer) => {
    const [osmLayer, setOsmLayer] = useState(null);

    useEffect(() => {
        if (!viewer) return;
        const loadOsmLayer = () => {
            const layer = new Cesium.ImageryLayer(
                new Cesium.OpenStreetMapImageryProvider({ url: OSM_TILE_URL }),
                { show: false }
            );
            viewer.imageryLayers.add(layer);
            setOsmLayer(layer)
        };
        loadOsmLayer();
    }, [viewer]);

    return { osmLayer }
}

export default useLoadOsmLayer