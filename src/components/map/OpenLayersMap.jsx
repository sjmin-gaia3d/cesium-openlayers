import { useRef } from "react";
import useInitOlMap from "../../hooks/init/useInitOlMap";
import useMapStore from "../../store/useMapStore";
import { useShallow } from "zustand/shallow";
import useOpenLayersHandler from "../../hooks/objects/useOpenLayersHandler";

const OpenLayersMap = () => {
    const mapRef = useRef(null);
    useInitOlMap(mapRef);

    const { olMap } = useMapStore(
        useShallow((state) => ({ olMap: state.olMap }))
    );

    const {
        handleAddPoint,
        handleAddLineString,
        handleAddPolygon,
        handleRemovePoint,
        handleRemoveLineString,
        handleRemovePolygon,
    } = useOpenLayersHandler(olMap);
    
    return (
        <div ref={mapRef} style={{ width: "100%", height: "100vh" }}>
            <button onClick={handleAddPoint}>Add Default Point</button>
            <button onClick={handleAddLineString}>Add Default LineString</button>
            <button onClick={handleAddPolygon}>Add Default Polygon</button>
            <button onClick={handleRemovePoint}>Remove Default Point</button>
            <button onClick={handleRemoveLineString}>Remove Default LineString</button>
            <button onClick={handleRemovePolygon}>Remove Default Polygon</button>
        </div>
    );
};

export default OpenLayersMap;
