import { useEffect, useState } from 'react'
import * as Cesium from "cesium";
import useMapStore from '../../store/useMapStore';
import { useShallow } from 'zustand/shallow';

const useLoadBuildingTileset = () => {
  const { cesiumViewer } = useMapStore(
    useShallow((state) => ({ cesiumViewer: state.cesiumViewer}))
  );
    const [osmBuildings, setOsmBuildings] = useState(null);

    useEffect(() => {
        const loadBuildingTileset = async () => {
          if (!cesiumViewer) return;
          const buildingTileset = await Cesium.createOsmBuildingsAsync();
          buildingTileset.show = true; // 초기 상태: 보이기
          setOsmBuildings(buildingTileset);
          cesiumViewer.scene.primitives.add(buildingTileset);
        };
        loadBuildingTileset();
      }, [cesiumViewer]);

  return { osmBuildings }
}

export default useLoadBuildingTileset