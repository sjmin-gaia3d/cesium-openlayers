import React, { useEffect, useState } from 'react'
import * as Cesium from "cesium";

const useLoadBuildingTileset = (viewer) => {
    const [osmBuildings, setOsmBuildings] = useState(null);

    useEffect(() => {
        const loadBuildingTileset = async () => {
          if (!viewer) return;
          const buildingTileset = await Cesium.createOsmBuildingsAsync();
          buildingTileset.show = true; // 초기 상태: 보이기
          setOsmBuildings(buildingTileset);
          viewer.scene.primitives.add(buildingTileset);
        };
        loadBuildingTileset();
      }, [viewer]);

  return { osmBuildings }
}

export default useLoadBuildingTileset