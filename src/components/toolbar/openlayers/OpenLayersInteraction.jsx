import useMapStore from '../../../store/useMapStore';
import { useShallow } from 'zustand/shallow';
import useVectorSourceStore from '../../../store/useVectorSourceStore';
import { useState } from 'react';
import openlayersInteractiveHandler from '../../../handlers/openlayersInteractiveHandler';
import useObjectStore from '../../../store/useObjectStore';

const ACTIVE_INTERACTIVE_TYPES = {
    DRAW: 'Draw',
    SELECT: 'Select',
    REMOVE: 'Remove',
    MODIFY: 'Modify',
}

const ACTIVE_DRAW_TYPES = {
    POINT: 'Point',
    LINE: 'LineString',
    POLYGON: 'Polygon',
    NONE: null,
};

const BUTTON_STYLE = {
    ACTIVE: '#ddd',
    DEACTIVE: '#FFF',
}

const OpenLayersInteraction = () => {

    const [activeInteraction, setActiveInteraction] = useState(null);
    const [activeDrawType, setActiveDrawType] = useState(null);

    const { olMap } = useMapStore(
        useShallow(
            (state) => ({ olMap: state.olMap })
        )
    );

    const { vectorSource } = useVectorSourceStore(
        useShallow(
            (state) => ({ vectorSource: state.vectorSource })
        )
    );

    const { setSelectedObject } = useObjectStore(
        useShallow(
            (state) => ({
                setSelectedObject: state.setSelectedObject,
            })
        )
    );

    // 핸들러 호출
    const handleActiveInteraction = (interactiveTypes, drawTypes) => {
        openlayersInteractiveHandler(
            activeInteraction, setActiveInteraction,
            activeDrawType, setActiveDrawType,
            olMap,
            vectorSource,
            setSelectedObject,
        ).handleActiveInteraction(interactiveTypes, drawTypes);
    };
    return (
        <div style={{ padding: '10px', background: '#f4f4f4', borderBottom: '1px solid #ddd' }}>
            <button
                onClick={() => handleActiveInteraction(ACTIVE_INTERACTIVE_TYPES.DRAW, ACTIVE_DRAW_TYPES.POINT)}
                style={{ backgroundColor: activeDrawType === ACTIVE_DRAW_TYPES.POINT ? BUTTON_STYLE.DEACTIVE : BUTTON_STYLE.ACTIVE }}
            >
                Draw Point
            </button>
            <button
                onClick={() => handleActiveInteraction(ACTIVE_INTERACTIVE_TYPES.DRAW, ACTIVE_DRAW_TYPES.LINE)}
                style={{ backgroundColor: activeDrawType === ACTIVE_DRAW_TYPES.LINE ? BUTTON_STYLE.DEACTIVE : BUTTON_STYLE.ACTIVE }}
            >
                Draw Line
            </button>
            <button
                onClick={() => handleActiveInteraction(ACTIVE_INTERACTIVE_TYPES.DRAW, ACTIVE_DRAW_TYPES.POLYGON)}
                style={{ backgroundColor: activeDrawType === ACTIVE_DRAW_TYPES.POLYGON ? BUTTON_STYLE.DEACTIVE : BUTTON_STYLE.ACTIVE }}
            >
                Draw Polygon
            </button>
            <button
                onClick={() => handleActiveInteraction(ACTIVE_INTERACTIVE_TYPES.REMOVE, ACTIVE_DRAW_TYPES.NONE)}
                style={{ backgroundColor: activeInteraction === ACTIVE_INTERACTIVE_TYPES.REMOVE ? BUTTON_STYLE.DEACTIVE : BUTTON_STYLE.ACTIVE }}
            >
                Remove
            </button>

            <button
                onClick={() => handleActiveInteraction(ACTIVE_INTERACTIVE_TYPES.SELECT, ACTIVE_DRAW_TYPES.NONE)}
                style={{ backgroundColor: activeInteraction === ACTIVE_INTERACTIVE_TYPES.SELECT ? BUTTON_STYLE.DEACTIVE : BUTTON_STYLE.ACTIVE }}
            >
                Select
            </button>
            <button
                onClick={() => handleActiveInteraction(ACTIVE_INTERACTIVE_TYPES.MODIFY, ACTIVE_DRAW_TYPES.NONE)}
                style={{ backgroundColor: activeInteraction === ACTIVE_INTERACTIVE_TYPES.MODIFY ? BUTTON_STYLE.DEACTIVE : BUTTON_STYLE.ACTIVE }}
            >
                Modify
            </button>
        </div>
    );
};

export default OpenLayersInteraction;
