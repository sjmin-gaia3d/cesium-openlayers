import * as CesiumInteractionUtils from "../utils/cesiumInteractionUtils"

const ACTIVE_INTERACTIVE_TYPES = {
    DRAW: 'Draw',
    SELECT: 'Select',
    REMOVE: 'Remove',
    MODIFY: 'Modify',
}

const cesiumInteractiveHandler = (
    activeInteraction, setActiveInteraction,
    activeDrawType, setActiveDrawType,
    cesiumViewer,
    dataSource
) => {

    const handleActiveInteraction = (interactiveTypes, drawTypes) => {
        if (!dataSource) {
            console.error('Data source is not init');
            return;
        }
        if (activeInteraction) {
            deactivateInteraction()
            console.log('remove Interaction:', activeInteraction)
        }
        setActiveInteraction(interactiveTypes);
        setActiveDrawType(drawTypes)
        if (interactiveTypes === ACTIVE_INTERACTIVE_TYPES.DRAW) handleActivateDrawInteraction(interactiveTypes, drawTypes);
        if (interactiveTypes === ACTIVE_INTERACTIVE_TYPES.SELECT) handleActivateSelectInteraction(interactiveTypes);
        if (interactiveTypes === ACTIVE_INTERACTIVE_TYPES.REMOVE) handleActivateSelectRemoveInteraction(interactiveTypes);
        if (interactiveTypes === ACTIVE_INTERACTIVE_TYPES.MODIFY) handleActivateModifyInteraction(interactiveTypes);

    }

    // Draw 활성화
    const handleActivateDrawInteraction = (interactiveTypes, drawTypes) => {
        deactivateInteraction();
        if (activeDrawType === drawTypes) {
            setActiveDrawType(null);
            setActiveInteraction(null);

        } else {
            CesiumInteractionUtils.activateDraw(drawTypes, cesiumViewer, dataSource);
            setActiveDrawType(drawTypes);
            setActiveInteraction(interactiveTypes);
        }
    }

    // Select 활성화
    const handleActivateSelectInteraction = (interactiveTypes) => {
        deactivateInteraction();
        if (activeInteraction === interactiveTypes) {
            setActiveInteraction(null);
        } else {
            CesiumInteractionUtils.activateSelect(cesiumViewer);
            setActiveInteraction(interactiveTypes);
        }
    };

    // Modify 활성화
    const handleActivateModifyInteraction = (interactiveTypes) => {
        deactivateInteraction();
        if (activeInteraction === interactiveTypes) {
            setActiveInteraction(null);
        } else {
            CesiumInteractionUtils.activateModify(cesiumViewer, dataSource);
            setActiveInteraction(interactiveTypes);
        }
    };

    // 객체 remove 
    const handleActivateSelectRemoveInteraction = (interactiveTypes) => {
        deactivateInteraction();
        if (activeInteraction === interactiveTypes) {
            setActiveInteraction(null);
        } else {
            CesiumInteractionUtils.activateSelectRemove(cesiumViewer, dataSource);
            setActiveInteraction(interactiveTypes);
        }
    };

    const deactivateInteraction = () => {
        CesiumInteractionUtils.deactivateHandler()
    }

    // 객체로 반환
    return {
        handleActiveInteraction,
    };
}

export default cesiumInteractiveHandler