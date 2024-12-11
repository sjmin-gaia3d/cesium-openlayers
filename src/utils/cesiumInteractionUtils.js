import * as Cesium from "cesium";
import { v4 as uuidv4 } from 'uuid'; // UUID 라이브러리 사용

let currentHandler = null;

export const activateDraw = (drawType, viewer, dataSource, callback) => {
    if (!viewer) console.log('required init viewer');

    console.log(`Activating draw interaction for type: ${drawType}`);

    deactivateHandler();

    currentHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    if (drawType === 'Point') {
        currentHandler.setInputAction((event) => {
            console.log("event position: ", event.position);
            const position = viewer.scene.pickPosition(event.position);
            console.log("pick position: ", position);

            if (Cesium.defined(position)) {
                console.log('dataSource: ', dataSource)
                if (callback) callback(dataSource.entities.add({
                    id: `cesium-${uuidv4()}`,
                    position: position,
                    point: { pixelSize: 10, color: Cesium.Color.RED },
                }));

                console.log('Point added:', position);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    if (drawType === 'PolyLine') {
        let positions = [];
        let polylineEntity = null;

        // 좌클릭 이벤트: 좌표 추가
        currentHandler.setInputAction((event) => {
            const position = viewer.scene.pickPosition(event.position);
            console.log('Positions updated:', positions);
            if (Cesium.defined(position)) {
                positions.push(position);


                if (!polylineEntity) {
                    // 실시간 폴리라인 생성
                    polylineEntity = dataSource.entities.add({
                        id: `cesium-${uuidv4()}`,
                        polyline: {
                            positions: new Cesium.CallbackProperty(() => positions, false),
                            width: 5,
                            material: Cesium.Color.BLUE,
                        },
                    });
                    console.log('Polyline entity created');
                }
            } else {
                console.error('pickPosition failed to return a valid position.');
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 더블클릭 이벤트: 현재 Polyline 확정 및 새 Polyline 준비
        currentHandler.setInputAction(() => {
            if (positions.length > 1) {
                console.log('Polyline completed:', positions);

                // CallbackProperty를 고정 값으로 변환
                if (polylineEntity) {
                    polylineEntity.polyline.positions = positions;
                    console.log('Polyline finalized and added to dataSource');
                }

                if (callback) callback(polylineEntity)

                // 새로운 폴리라인 준비
                positions = [];
                polylineEntity = null;
            } else {
                console.log('Not enough points to complete Polyline');
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

        console.log('Polyline draw interaction activated');
    }

    if (drawType === 'Polygon') {
        let positions = [];
        let polygonEntity = null;

        // 좌클릭 이벤트: 좌표 추가
        currentHandler.setInputAction((event) => {
            const position = viewer.scene.pickPosition(event.position);
            if (Cesium.defined(position)) {
                positions.push(position);

                if (!polygonEntity) {
                    // 실시간 폴리곤 생성
                    polygonEntity = dataSource.entities.add({
                        id: `cesium-${uuidv4()}`,
                        polygon: {
                            hierarchy: new Cesium.CallbackProperty(() => new Cesium.PolygonHierarchy(positions), false),
                            material: Cesium.Color.GREEN.withAlpha(0.5),
                        },
                    });
                    
                }

                console.log('Polygon updated:', positions);
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        // 더블클릭 이벤트: 현재 폴리곤 확정 및 새 폴리곤 준비
        currentHandler.setInputAction(() => {
            if (positions.length > 2) {
                console.log('Polygon completed:', positions);

                // 현재 폴리곤의 CallbackProperty를 고정된 값으로 변환하여 확정
                polygonEntity.polygon.hierarchy = new Cesium.PolygonHierarchy([...positions]);
                if (callback) callback(polygonEntity)
                // 새로운 폴리곤 준비를 위해 초기화
                positions = [];
                polygonEntity = null;

                console.log('Ready to draw new Polygon');
            } else {
                console.log('Not enough points to complete Polygon');
            }
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }
};

export const activateSelect = (viewer, callback) => {
    console.log('Activating select interaction');

    deactivateHandler();

    currentHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    currentHandler.setInputAction((event) => {
        const pickedObject = viewer.scene.pick(event.position);
        if (Cesium.defined(pickedObject) && pickedObject.id) {
            console.log('Selected entity:', pickedObject.id);
            if (callback) callback(pickedObject.id)
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

export const activateModify = (viewer, dataSource, callback) => {
    console.log('Activating modify interaction');

    deactivateHandler();

    currentHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    currentHandler.setInputAction((event) => {
        const pickedObject = viewer.scene.pick(event.position);
        if (Cesium.defined(pickedObject) && pickedObject.id) {
            const entity = pickedObject.id;
            console.log('Modifying entity:', entity);
            if (callback) callback(entity)
            const position = viewer.scene.pickPosition(event.position);
            if (Cesium.defined(position)) {
                entity.position = position;
                console.log('Entity position updated to:', position);
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

export const activateSelectRemove = (viewer, dataSource, callback) => {
    console.log('Activating select and remove interaction');

    deactivateHandler();

    currentHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    currentHandler.setInputAction((event) => {
        const pickedObject = viewer.scene.pick(event.position);
        if (Cesium.defined(pickedObject) && pickedObject.id) {
            if (callback) callback(pickedObject.id)
            console.log('Entity removed:', pickedObject.id);
            dataSource.entities.remove(pickedObject.id);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

export const deactivateHandler = () => {
    if (currentHandler) {
        currentHandler.destroy();
        currentHandler = null;
        console.log('Event handler deactivated');
    }
};
