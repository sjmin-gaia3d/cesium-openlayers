import * as Cesium from "cesium";
import useCesiumEventHandlers from "../useCesiumEventHandlers";
import useMapStore from "../../store/useMapStore";
import { useShallow } from "zustand/shallow";
import { ACTIVE_INTERACTIVE_TYPES } from "../../constants/interativeTypes"
import { useEffect } from "react";
import { convertEntityToStoreSelectedObject } from "../../utils/objectConvertUtils";
const useActivateCesiumRemove = ({ dataSource, activeInteraction, callback }) => {
    const { viewer } = useMapStore(
        useShallow(
            (state) => ({
                viewer: state.cesiumViewer
            })
        )
    );

    useEffect(() => {
        if (activeInteraction !== ACTIVE_INTERACTIVE_TYPES.REMOVE) return;
    }, [activeInteraction])

    const handleMouseLeftClick = (eventViewer, event) => {
        if (!dataSource || activeInteraction !== ACTIVE_INTERACTIVE_TYPES.REMOVE) return;

        const pickedObject = eventViewer.scene.pick(event.position);
        if (pickedObject && Cesium.defined(pickedObject.id)) {
            console.log("Selected entity:", pickedObject.id);
            callback?.(convertEntityToStoreSelectedObject(pickedObject.id, ACTIVE_INTERACTIVE_TYPES.REMOVE))
            dataSource.entities.remove(pickedObject.id);
        }
    };

    const eventHandlers = {
        [Cesium.ScreenSpaceEventType.LEFT_CLICK]: handleMouseLeftClick,
    };

    useCesiumEventHandlers(viewer, eventHandlers);

};

export default useActivateCesiumRemove;
