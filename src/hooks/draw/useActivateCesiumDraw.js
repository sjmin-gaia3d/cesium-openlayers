import * as Cesium from "cesium";
import CesiumEntityUtils from "../../utils/cesiumEntityUtils";
import useCesiumEventHandlers from "../useCesiumEventHandlers";
import useMapStore from "../../store/useMapStore";
import { useShallow } from "zustand/shallow";
import { CESIUM_ENTITY_TYPES } from "../../constants/cesiumEntityTypes"
import { ACTIVE_INTERACTIVE_TYPES } from "../../constants/interativeTypes"
import { useEffect } from "react";
import { convertEntityToStoreSelectedObject, entityToFeature } from "../../utils/objectConvertUtils";
const useActivateCesiumDraw = ({ drawType, dataSource, activeInteraction, callback }) => {
    const { viewer } = useMapStore(
        useShallow(
            (state) => ({
                viewer: state.cesiumViewer
            })
        )
    );

    useEffect(()=> {
        if(activeInteraction !== ACTIVE_INTERACTIVE_TYPES.DRAW) return;
    }, [activeInteraction])

    let positions = [];
    let newEntity = null;

    const handleMouseLeftClick = (eventViewer, event) => {
        if (!drawType || !dataSource || !activeInteraction) return;

        const position = eventViewer.scene.pickPosition(event.position);
        if (Cesium.defined(position)) {
            positions.push(position);

            if (drawType === CESIUM_ENTITY_TYPES.POINT) {
                newEntity = CesiumEntityUtils.createPoint(position);
                callback?.(convertEntityToStoreSelectedObject(newEntity, ACTIVE_INTERACTIVE_TYPES.DRAW))
                const feature = entityToFeature(newEntity)
                feature.setId(newEntity.id)
                console.log(feature);
            } else if (drawType === CESIUM_ENTITY_TYPES.POLYLINE) {
                const dynamicPositions = new Cesium.CallbackProperty(() => positions, false);
                newEntity = CesiumEntityUtils.createPolyline(dynamicPositions);
            } else if (drawType === CESIUM_ENTITY_TYPES.POLYGON) {
                const dynamicHierarchy = new Cesium.CallbackProperty(() => new Cesium.PolygonHierarchy(positions), false);
                newEntity = CesiumEntityUtils.createPolygon(dynamicHierarchy);
            } else {
                console.warn(`Unsupported drawType: ${drawType}`);
            }

            if (newEntity) {
                dataSource.entities.add(newEntity);
                
            }
        }
    };

    const handleMouseRightClick = () => {
        if (!drawType || !dataSource) return;

        if (drawType === CESIUM_ENTITY_TYPES.POLYLINE && positions.length > 1) {
            newEntity.polyline.positions = positions;
        } else if (drawType === CESIUM_ENTITY_TYPES.POLYGON && positions.length > 2) {
            newEntity.polygon.hierarchy = new Cesium.PolygonHierarchy([...positions]);
        }
        callback?.(convertEntityToStoreSelectedObject(newEntity, ACTIVE_INTERACTIVE_TYPES.DRAW))
        // 상태 초기화
        positions = [];
        newEntity = null;
    };

    const eventHandlers = {
        [Cesium.ScreenSpaceEventType.LEFT_CLICK]: handleMouseLeftClick,
        [Cesium.ScreenSpaceEventType.RIGHT_CLICK]: handleMouseRightClick,
    };

    useCesiumEventHandlers(viewer, eventHandlers);

};

export default useActivateCesiumDraw;
