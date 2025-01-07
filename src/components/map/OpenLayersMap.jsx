import { useRef } from 'react';
import OpenLayersInteraction from "../toolbar/openlayers/OpenLayersInteraction";
import useInitOlMap from '../../hooks/init/useInitOlMap';
import useInitVectorSource from '../../hooks/init/useInitVectorSource';
import OpenLayersMarkerAnimationEditor from "../toolbar/openlayers/OpenLayersMarkerAnimationEditor.jsx";

const OpenLayersMap = () => {
    const mapRef = useRef(null);
    useInitOlMap(mapRef);
    useInitVectorSource();
    return (
        <div style={{ flex: 1 }}>
            <OpenLayersInteraction /> {/* 툴바 컴포넌트 */}
            <OpenLayersMarkerAnimationEditor />
            <div ref={mapRef} style={{ height: '80vh' }}></div>
        </div>
    );
};

export default OpenLayersMap;