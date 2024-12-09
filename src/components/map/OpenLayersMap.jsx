import { useRef } from 'react';
import OpenLayersInteraction from "../toolbar/openlayers/OpenLayersInteraction";
import useInitOlMap from '../../hooks/init/useInitOlMap';
import useInitVectorSource from '../../hooks/init/useInitVectorSource';

const OpenLayersMap = () => {
    const mapRef = useRef(null);
    useInitOlMap(mapRef);
    useInitVectorSource();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <OpenLayersInteraction /> {/* 툴바 컴포넌트 */}
            <div ref={mapRef} style={{ flex: 1, width: '100%' }}></div>
        </div>
    );
};

export default OpenLayersMap;