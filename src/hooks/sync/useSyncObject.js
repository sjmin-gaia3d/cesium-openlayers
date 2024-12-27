import { useEffect } from 'react';
import useObjectStore from '../../store/useObjectStore';
import useVectorSourceStore from '../../store/useVectorSourceStore';
import { useShallow } from 'zustand/shallow';
import { convertStoreSelectedObjectToFeature, convertStoreSelectedObjectToEntity } from '../../utils/objectConvertUtils';
import useDataSourceStore from '../../store/useDataSourceStore';

const FROM_TYPES = {
    CESIUM: 'Cesium',
    OPEN_LAYERS: 'OpenLayers'
}

const ACTIVE_INTERACTIVE_TYPES = {
    DRAW: 'Draw',
    SELECT: 'Select',
    REMOVE: 'Remove',
    MODIFY: 'Modify',
}

const useSyncObject = () => {

    const { selectedObject } = useObjectStore(
        useShallow(
            (state) => ({
                selectedObject: state.selectedObject
            })
        )
    )

    const { vectorSource } = useVectorSourceStore();
    const { dataSource } = useDataSourceStore();

    useEffect(() => {
        if (!selectedObject) return;

        if (selectedObject.from === FROM_TYPES.OPEN_LAYERS || !vectorSource) return;

        if (selectedObject.activate === ACTIVE_INTERACTIVE_TYPES.DRAW) {
            // Cesium -> OpenLayers 동기화
            console.log("addFeature")
            console.log("selectedObject: ", selectedObject)
            const feature = convertStoreSelectedObjectToFeature(selectedObject);
            vectorSource.addFeature(feature);
        }

        if (selectedObject.activate === ACTIVE_INTERACTIVE_TYPES.REMOVE) {
            // Cesium -> OpenLayers 동기화
            console.log("removeFeature")
            console.log("selectedObject: ", selectedObject)
            console.log("ID: ", selectedObject.id)
            const feature = vectorSource.getFeatureById(selectedObject.id)
            console.log(feature);
            
            vectorSource.removeFeature(feature);
        }

    }, [selectedObject, vectorSource]);

    useEffect(() => {
        if (!selectedObject) return;
        if (selectedObject.from === FROM_TYPES.CESIUM || !dataSource) return;

        if (selectedObject.activate === ACTIVE_INTERACTIVE_TYPES.DRAW) {
            // OpenLayers -> Cesium 동기화
            console.log("addEntity")
            console.log("selectedObject: ", selectedObject)
            const entity = convertStoreSelectedObjectToEntity(selectedObject);
            dataSource.entities.add(entity);
        }
        if (selectedObject.activate === ACTIVE_INTERACTIVE_TYPES.REMOVE) {
            // OpenLayers -> Cesium 동기화
            console.log("removeEntity")
            console.log("selectedObject: ", selectedObject)
            dataSource.entities.removeById(selectedObject.id);
        }
    }, [selectedObject, dataSource]);

};

export default useSyncObject;
