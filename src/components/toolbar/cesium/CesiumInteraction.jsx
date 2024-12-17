import { useShallow } from 'zustand/shallow';
import useDataSourceStore from '../../../store/useDataSourceStore';
import { useState } from 'react';
import useObjectStore from '../../../store/useObjectStore';
import useActivateCesiumDraw from '../../../hooks/draw/useActivateCesiumDraw';
import { ACTIVE_INTERACTIVE_TYPES } from '../../../constants/interativeTypes';
import { CESIUM_ENTITY_TYPES } from '../../../constants/cesiumEntityTypes';
import useActivateCesiumSelect from '../../../hooks/draw/useActivateCesiumSelect';
import useActivateCesiumRemove from '../../../hooks/draw/useActivateCesiumRemove';
import useActivateCesiumModify from '../../../hooks/draw/useActivateCesiumModify';

const CesiumInteraction = () => {
    const [activeInteraction, setActiveInteraction] = useState(null);
    const [activeDrawType, setActiveDrawType] = useState(null);

    const { dataSource } = useDataSourceStore(
        useShallow((state) => ({ dataSource: state.dataSource }))
    );

    const { setSelectedObject } = useObjectStore(
        useShallow((state) => ({
            setSelectedObject: state.setSelectedObject,
        }))
    );

    useActivateCesiumDraw({
        drawType: activeDrawType,
        dataSource: dataSource,
        activeInteraction: activeInteraction,
        callback: setSelectedObject,
    });
    useActivateCesiumSelect({
        dataSource: dataSource,
        activeInteraction: activeInteraction,
        callback: setSelectedObject,
    });

    useActivateCesiumRemove({
        dataSource: dataSource,
        activeInteraction: activeInteraction,
        callback: setSelectedObject,
    });
    useActivateCesiumModify({
        dataSource: dataSource,
        activeInteraction: activeInteraction,
        callback: setSelectedObject,
    });

    const handleButtonClick = (interactionType, drawType) => {
        if (activeInteraction === interactionType && activeDrawType === drawType) {
            setActiveInteraction(ACTIVE_INTERACTIVE_TYPES.NONE);
            setActiveDrawType(CESIUM_ENTITY_TYPES.NONE);
        } else {
            setActiveInteraction(interactionType);
            setActiveDrawType(drawType);
        }
    };

    // 버튼 데이터 정의
    const buttons = [
        { label: 'Draw POINT', interactionType: ACTIVE_INTERACTIVE_TYPES.DRAW, drawType: CESIUM_ENTITY_TYPES.POINT },
        { label: 'Draw POLYLINE', interactionType: ACTIVE_INTERACTIVE_TYPES.DRAW, drawType: CESIUM_ENTITY_TYPES.POLYLINE },
        { label: 'Draw POLYGON', interactionType: ACTIVE_INTERACTIVE_TYPES.DRAW, drawType: CESIUM_ENTITY_TYPES.POLYGON },
        { label: 'Select', interactionType: ACTIVE_INTERACTIVE_TYPES.SELECT, drawType: CESIUM_ENTITY_TYPES.NONE },
        { label: 'Remove', interactionType: ACTIVE_INTERACTIVE_TYPES.REMOVE, drawType: CESIUM_ENTITY_TYPES.NONE },
        { label: 'Modify', interactionType: ACTIVE_INTERACTIVE_TYPES.MODIFY, drawType: CESIUM_ENTITY_TYPES.NONE },
    ];

    return (
        <div style={{ padding: '10px', background: '#f4f4f4', borderBottom: '1px solid #ddd' }}>
            {buttons.map(({ label, interactionType, drawType }) => (
                <button
                    key={label}
                    onClick={() => handleButtonClick(interactionType, drawType)}
                >
                    {label}
                </button>
            ))}
            <p>{`Draw Type: ${activeDrawType}, Interaction Type: ${activeInteraction}`}</p>
        </div>
    );
};

export default CesiumInteraction;
