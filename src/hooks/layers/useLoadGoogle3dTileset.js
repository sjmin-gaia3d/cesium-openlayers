import { useEffect, useState } from 'react'
import * as Cesium from "cesium";
import useMapStore from '../../store/useMapStore';
import { useShallow } from 'zustand/shallow';

const useLoadGoogle3DTileset = () => {
    const { cesiumViewer } = useMapStore(
        useShallow((state) => ({ cesiumViewer: state.cesiumViewer}))
      );
    const [google3DTileset, setGoogle3DTileset] = useState(null);
    useEffect(() => {
        if (!cesiumViewer) return;
        const loadGoogle3DTileset = async () => {
            const tileset = await Cesium.createGooglePhotorealistic3DTileset();
            tileset.show = false; // 초기에는 보이지 않도록 설정
            cesiumViewer.scene.primitives.add(tileset);
            setGoogle3DTileset(tileset);
        }
        loadGoogle3DTileset();

    }, [cesiumViewer])
    return { google3DTileset }
}

export default useLoadGoogle3DTileset