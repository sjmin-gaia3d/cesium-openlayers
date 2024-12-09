import * as OpenlayersInteractionUtils from "../utils/openlayersInteractionUtils"

const ACTIVE_INTERACTIVE_TYPES = {
    DRAW: 'Draw',
    SELECT: 'Select',
    REMOVE: 'Remove',
    MODIFY: 'Modify',
}

const openlayersInteractiveHandler = (
    activeInteraction, setActiveInteraction,
    activeDrawType, setActiveDrawType,
    olMap,
    vectorSource
) => {

    const handleActiveInteraction = (interactiveTypes, drawTypes) => {
        if (!vectorSource) {
            console.error('Vector source is not init');
            return;
        }
        if (activeInteraction) {
            olMap.removeInteraction(activeInteraction);
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
            OpenlayersInteractionUtils.activateDraw(drawTypes, olMap, vectorSource);
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
            OpenlayersInteractionUtils.activateSelect(olMap);
            setActiveInteraction(interactiveTypes);
        }
    };

    // Modify 활성화
    const handleActivateModifyInteraction = (interactiveTypes) => {
        deactivateInteraction();
        if (activeInteraction === interactiveTypes) {
            setActiveInteraction(null);
        } else {
            OpenlayersInteractionUtils.activateModify(olMap, vectorSource);
            setActiveInteraction(interactiveTypes);
        }
    };

    // 객체 remove 
    const handleActivateSelectRemoveInteraction = (interactiveTypes) => {
        deactivateInteraction();
        if (activeInteraction === interactiveTypes) {
            setActiveInteraction(null);
        } else {
            OpenlayersInteractionUtils.activateSelectRemove(olMap, vectorSource);
            setActiveInteraction(interactiveTypes);
        }
    };

    const deactivateInteraction = () => {
        OpenlayersInteractionUtils.deactivateDraw(olMap) // Draw 비활성화
        OpenlayersInteractionUtils.deactivateSelect(olMap) // Select 비활성화
        OpenlayersInteractionUtils.deactivateModify(olMap) // Modify 비활성화
    }

    // 객체로 반환
    return {
        handleActiveInteraction,
    };
}

export default openlayersInteractiveHandler