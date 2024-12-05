import React, { useEffect } from 'react'
import * as Cesium from "cesium";
const useLoadTerrain = (viewer) => {
    useEffect(() => {
        if (!viewer) return;
    
        const loadTerrain = async () => {
          const terrainProvider = await Cesium.createWorldTerrainAsync();
          viewer.terrainProvider = terrainProvider;
        };
        loadTerrain();
      }, [viewer]);
}

export default useLoadTerrain