import React, { useEffect, useState } from 'react'
import * as Cesium from "cesium";

const useLoadGoogle3DTileset = (viewer) => {
    const [google3DTileset, setGoogle3DTileset] = useState(null);
    useEffect(() => {
        if (!viewer) return;
        const loadGoogle3DTileset = async () => {
            const tileset = await Cesium.createGooglePhotorealistic3DTileset();
            tileset.show = false; // 초기에는 보이지 않도록 설정
            viewer.scene.primitives.add(tileset);
            setGoogle3DTileset(tileset);
        }
        loadGoogle3DTileset();

    }, [viewer])
    return { google3DTileset }
}

export default useLoadGoogle3DTileset