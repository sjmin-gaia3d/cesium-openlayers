import React, { useEffect, useRef } from "react";
import useInitOlMap from "../../hooks/init/useInitOlMap";
import { useSyncMap } from "../../hooks/sync/useSyncMap";
import { useSyncZoom } from "../../hooks/sync/useSyncZoom";
import useAdjustZoomRange from "../../hooks/zoom/useAdjustZoomRange";
const OpenLayersMap = () => {
    const mapRef = useRef(null);
    const { olMap } = useInitOlMap(mapRef);

    useSyncMap({ olMap });
    // useSyncZoom({ olMap });
    // useAdjustZoomRange({ olMap });
    return (
        <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
    );
};

export default OpenLayersMap;
