import { useState, useEffect } from 'react'
import * as Cesium from "cesium";

const useInitCesiumViewer = (viewContainerRef) => {
    const [cesiumViewer, setCesiumViewer] = useState(null);

    useEffect(() => {
        if (!viewContainerRef.current) return;

        const viewerOption = {
            terrainProvider: new Cesium.EllipsoidTerrainProvider(),
            homeButton: false,
            baseLayerPicker: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            geocoder: false,
        };
        const viewerInstance = new Cesium.Viewer(viewContainerRef.current, viewerOption);
        setCesiumViewer(viewerInstance);

        viewerInstance.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(127.3845475, 36.3504119, 450),
            orientation: {
            },
            duration: 0,
          }
        );

        return () => {
            if (viewerInstance && !viewerInstance.isDestroyed()) viewerInstance.destroy();
        };
    }, [viewContainerRef]);

    return { cesiumViewer }
}

export default useInitCesiumViewer