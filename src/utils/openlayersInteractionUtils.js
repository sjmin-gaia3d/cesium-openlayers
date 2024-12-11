import { Draw, Modify, Select } from "ol/interaction"
import { v4 as uuidv4 } from 'uuid'; // UUID 라이브러리 사용

export const activateDraw = (type, olMap, source, callback) => {
    const draw = new Draw({ source: source, type });
    olMap.addInteraction(draw);
    draw.on(
        'drawend', (event) => {
            const feature = event.feature
            if (!feature.getId()) feature.setId(`openlayers-${uuidv4()}`)
            callback(feature)
            console.log("activateDraw: ", feature);

        }
    )
}

export const deactivateDraw = (olMap) => {
    olMap.getInteractions().getArray().forEach((interaction) => {
        if (interaction instanceof Draw) {
            olMap.removeInteraction(interaction);
            console.log("deactivateDraw");

        }
    });
}

export const activateSelect = (olMap, callback) => {
    const select = new Select();
    olMap.addInteraction(select);
    select.on(
        'select', (event) => {
            const selectedFeatures = event.selected;
            // 단일 객체만 선택
            const singleFeature = selectedFeatures.length > 0 ? selectedFeatures[0] : null;
            if (callback) callback(singleFeature); // 단일 객체를 콜백으로 전달
            console.log("activateSelect (single feature):", singleFeature);
        }
    )
}

export const activateSelectRemove = (olMap, source, callback) => {
    const select = new Select();
    olMap.addInteraction(select);
    select.on(
        'select', (event) => {
            const selectedFeatures = event.selected
            // 단일 객체만 선택
            const singleFeature = selectedFeatures.length > 0 ? selectedFeatures[0] : null;

            if (callback) callback(singleFeature)
            // selectedFeatures.forEach((feature) => { // 다중 객체 삭제
                source.removeFeature(singleFeature);
            // })
        }
    )
}

export const deactivateSelect = (olMap) => {
    olMap.getInteractions().getArray().forEach((interaction) => {
        if (interaction instanceof Select) {
            olMap.removeInteraction(interaction);
            console.log("deactivateSelect");
        }
    });
}

export const activateModify = (olMap, source, callback) => {
    const modify = new Modify({ source: source });
    olMap.addInteraction(modify)
    modify.on(
        'modifyend', (event) => {
            event.features.getArray()
            if(callback) callback(event.features.getArray())
            console.log(event.features.getArray());
        }
    )
}

export const deactivateModify = (olMap) => {
    olMap.getInteractions().getArray().forEach((interaction) => {
        if (interaction instanceof Modify) {
            olMap.removeInteraction(interaction);
            console.log("deactivateModify");
            
        }
    });
}