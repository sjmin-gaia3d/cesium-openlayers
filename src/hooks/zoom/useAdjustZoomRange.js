import React, { useEffect } from 'react'
import { MouseWheelZoom } from "ol/interaction";

const useAdjustZoomRange = ({ olMap, cesiumViewer, options }) => {
    const { olZoomDelta = 1000.0, cesiumZoomRate = 1.0, cesiumMinZoom = 100, cesiumMaxZoom = 50000000 } = options || {};

    useEffect(() => {
        if(!olMap) return;
        console.log(olZoomDelta)
        const view = olMap.getView();

        view.setMinZoom(0);
        view.setMaxZoom(1000);

        const interactions = olMap.getInteractions();        
        interactions.forEach((interaction) => {
            if (interaction instanceof MouseWheelZoom) {
                olMap.removeInteraction(interaction);
            }
        });

        olMap.addInteraction(new MouseWheelZoom({ zoomDelta: olZoomDelta }));
    }, [olMap, olZoomDelta]);
}

export default useAdjustZoomRange