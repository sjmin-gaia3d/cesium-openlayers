import { Draw, Modify, Select } from "ol/interaction"

export const activateDraw = (type, olMap, source) => {
    const draw = new Draw({ source: source, type });
    olMap.addInteraction(draw);
    return draw.on(
        'drawend', (event) => {
            event.feature
            console.log('Drawn feature: ', event.feature)
        }
    )
}

export const deactivateDraw = (olMap) => {
    olMap.getInteractions().getArray().forEach((interaction) => {
        if (interaction instanceof Draw) {
            olMap.removeInteraction(interaction);
        }
    });
}

export const activateSelect = (olMap) => {
    const select = new Select();
    olMap.addInteraction(select);
    return select.on(
        'select', (event) => {
            event.selected
            console.log('Selected features:', event.selected)
        }
    )
}

export const activateSelectRemove = (olMap, source) => {
    const select = new Select();
    olMap.addInteraction(select);
    return select.on(
        'select', (event) => {
            const selectedFeatures = event.selected
            console.log('Selected features:', selectedFeatures)
            selectedFeatures.forEach((feature) => {
                source.removeFeature(feature);
                console.log('Selected features:', feature)
            })
        }
    )
}

export const deactivateSelect = (olMap) => {
    olMap.getInteractions().getArray().forEach((interaction) => {
        if (interaction instanceof Select) {
            olMap.removeInteraction(interaction);
        }
    });
}

export const activateModify = (olMap, source) => {
    const modify = new Modify({ source: source });
    olMap.addInteraction(modify)
    return modify.on(
        'modifyend', (event) => {
            event.features.getArray()
            console.log(event.features.getArray());
        }
    )
}

export const deactivateModify = (olMap) => {
    olMap.getInteractions().getArray().forEach((interaction) => {
        if (interaction instanceof Modify) {
            olMap.removeInteraction(interaction);
        }
    });
}