import { useEffect } from 'react'
import * as Cesium from "cesium";
import useMapStore from '../store/useMapStore';
import { useShallow } from 'zustand/shallow';
const useLoadTerrain = () => {
  const { cesiumViewer } = useMapStore(
    useShallow((state) => ({ cesiumViewer: state.cesiumViewer}))
  );
    useEffect(() => {
        if (!cesiumViewer) return;
    
        const loadTerrain = async () => {
          const terrainProvider = await Cesium.createWorldTerrainAsync();
          cesiumViewer.terrainProvider = terrainProvider;
        };
        loadTerrain();
      }, [cesiumViewer]);
}

export default useLoadTerrain