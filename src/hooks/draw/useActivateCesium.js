import * as Cesium from "cesium";
import CesiumEntityUtils from "../../utils/cesiumEntityUtils";
import useCesiumEventHandlers from "../useCesiumEventHandlers";
import useMapStore from "../../store/useMapStore";
import { useShallow } from "zustand/shallow";
import { ACTIVE_INTERACTIVE_TYPES } from "../../constants/interativeTypes";
import { convertEntityToStoreSelectedObject } from "../../utils/objectConvertUtils";
import useObjectStore from "../../store/useObjectStore";
import useDataSourceStore from "../../store/useDataSourceStore";

const useActivateCesium = ( { label } ) => {
    const { viewer } = useMapStore( useShallow( ( state ) => ({
        viewer: state.cesiumViewer,
    }) ) );

    const { setSelectedObject } = useObjectStore( useShallow( ( state ) => ({
        setSelectedObject: state.setSelectedObject,
    }) ) );

    const { dataSource } = useDataSourceStore( useShallow( ( state ) => ({
        dataSource: state.dataSource
    }) ) );

    let positions = [];
    let newEntity = null; // 생성할 엔티티를 저장할 변수

    let selectedEntity = null; // 선택된 엔티티를 저장할 변수

    const resetDrawingState = () => {
        positions = [];
        newEntity = null;
    };

    const pointEventHandler = {
        [ Cesium.ScreenSpaceEventType.LEFT_CLICK ]: ( eventViewer, event ) => {
            const position = eventViewer.scene.pickPosition( event.position );
            const point = CesiumEntityUtils.createPoint( position );
            newEntity = point;
            dataSource.entities.add( point );
            setSelectedObject?.( convertEntityToStoreSelectedObject( point, ACTIVE_INTERACTIVE_TYPES.DRAW ) );
        }
    }

    const polylineEventHandler = {
        [ Cesium.ScreenSpaceEventType.LEFT_CLICK ]: ( eventViewer, event ) => {
            const position = eventViewer.scene.pickPosition( event.position );
            if ( !Cesium.defined( position ) ) return;

            positions.push( position );

            if ( !newEntity ) {
                const dynamicPositions = new Cesium.CallbackProperty( () => positions, false );
                const polyline = CesiumEntityUtils.createPolyline( dynamicPositions );
                newEntity = polyline;
                dataSource.entities.add( polyline );
            }
        },
        [ Cesium.ScreenSpaceEventType.RIGHT_CLICK ]: () => {
            if ( positions.length > 1 ) {
                newEntity.polyline.positions = positions;
                console.log( "newEntity:::::", newEntity )
                setSelectedObject?.(
                    convertEntityToStoreSelectedObject( newEntity, ACTIVE_INTERACTIVE_TYPES.DRAW )
                );
            }
            resetDrawingState();
        },
    }

    const polygonEventHandler = {
        [ Cesium.ScreenSpaceEventType.LEFT_CLICK ]: ( eventViewer, event ) => {
            const position = eventViewer.scene.pickPosition( event.position );
            if ( !Cesium.defined( position ) ) return;

            positions.push( position );

            if ( !newEntity ) {
                const dynamicHierarchy = new Cesium.CallbackProperty(
                    () => new Cesium.PolygonHierarchy( positions ),
                    false
                );
                const polygon = CesiumEntityUtils.createPolygon( dynamicHierarchy );
                newEntity = polygon;
                dataSource.entities.add( polygon );
            }
        },
        [ Cesium.ScreenSpaceEventType.RIGHT_CLICK ]: () => {
            if ( positions.length > 2 ) {
                newEntity.polygon.hierarchy = new Cesium.PolygonHierarchy( [ ...positions ] );
                setSelectedObject?.(
                    convertEntityToStoreSelectedObject( newEntity, ACTIVE_INTERACTIVE_TYPES.DRAW )
                );
            }
            resetDrawingState();
        },
    }

    const selectEventHandler = {
        [ Cesium.ScreenSpaceEventType.LEFT_CLICK ]: ( eventViewer, event ) => {
            const pickedObject = viewer.scene.pick( event.position );
            console.log( "Picked object:", pickedObject );

            if ( pickedObject?.id ) {
                setSelectedObject?.(
                    convertEntityToStoreSelectedObject( pickedObject.id, ACTIVE_INTERACTIVE_TYPES.SELECT )
                );
            }
        }
    }

    const removeEventHandler = {
        [ Cesium.ScreenSpaceEventType.LEFT_CLICK ]: ( eventViewer, event ) => {
            const pickedObject = viewer.scene.pick( event.position );
            console.log( "Picked object:", pickedObject );

            if ( pickedObject?.id ) {
                dataSource.entities.remove( pickedObject.id );
                setSelectedObject?.(
                    convertEntityToStoreSelectedObject( pickedObject.id, ACTIVE_INTERACTIVE_TYPES.REMOVE )
                );
            }
        }
    }

    const modifyEventHandler = {
        [ Cesium.ScreenSpaceEventType.LEFT_DOWN ]: ( eventViewer, event ) => {
            // 1. 카메라 조작 비활성화
            viewer.scene.screenSpaceCameraController.enableRotate = false; // 회전 비활성화
            viewer.scene.screenSpaceCameraController.enableTranslate = false; // 이동 비활성화
            viewer.scene.screenSpaceCameraController.enableZoom = false; // 줌 비활성화
            viewer.scene.screenSpaceCameraController.enableTilt = false; // 기울기 비활성화
            viewer.scene.screenSpaceCameraController.enableLook = false; // 시점 변경 비활성화
            // 2. 객체 선택
            const pickedObject = eventViewer.scene.pick( event.position )
            if ( !Cesium.defined( pickedObject ) ) return;
            selectedEntity = pickedObject.id

        },
        [ Cesium.ScreenSpaceEventType.MOUSE_MOVE ]: ( eventViewer, event ) => {
            if ( !selectedEntity ) return;
            const ray = eventViewer.scene.camera.getPickRay( event.endPosition )
            const cartesian = eventViewer.scene.globe.pick( ray, eventViewer.scene );
            if ( cartesian ) {
                if ( selectedEntity.polyline ) {
                    const polylinePositions = selectedEntity.polyline.positions.getValue();
                    let closestPosition = polylinePositions[ 0 ];
                    let minDistance = Cesium.Cartesian3.distance( cartesian, closestPosition );
                    let closestIndex = 0;

                    for ( let i = 1; i < polylinePositions.length; i++ ) {
                        const currentDistance = Cesium.Cartesian3.distance( cartesian, polylinePositions[ i ] );
                        if ( currentDistance < minDistance ) {
                            closestPosition = polylinePositions[ i ];
                            minDistance = currentDistance;
                            closestIndex = i;
                        }
                    }

                    polylinePositions[ closestIndex ] = cartesian;
                    selectedEntity.polyline.positions = polylinePositions; // Update the polyline's positions
                } else if ( selectedEntity.polygon ) {
                    const polygonPositions = selectedEntity.polygon.hierarchy.getValue().positions;
                    let closestVertex = polygonPositions[ 0 ];
                    let minDistance = Cesium.Cartesian3.distance( cartesian, closestVertex );
                    let closestIndex = 0; // Track the index of the closest vertex

                    for ( let i = 1; i < polygonPositions.length; i++ ) {
                        const currentDistance = Cesium.Cartesian3.distance( cartesian, polygonPositions[ i ] );
                        if ( currentDistance < minDistance ) {
                            closestVertex = polygonPositions[ i ];
                            minDistance = currentDistance;
                            closestIndex = i; // Update the index of the closest vertex
                        }
                    }

                    polygonPositions[ closestIndex ] = cartesian;

                    selectedEntity.polygon.hierarchy = new Cesium.PolygonHierarchy( polygonPositions );
                } else if ( selectedEntity.position ) {
                    selectedEntity.position = Cesium.Cartesian3.clone( cartesian );
                }
            }
        },
        [ Cesium.ScreenSpaceEventType.LEFT_UP ]: () => {
            selectedEntity = null;
            viewer.scene.screenSpaceCameraController.enableRotate = true;
            viewer.scene.screenSpaceCameraController.enableTranslate = true;
            viewer.scene.screenSpaceCameraController.enableZoom = true;
            viewer.scene.screenSpaceCameraController.enableTilt = true;
            viewer.scene.screenSpaceCameraController.enableLook = true;
        },
    };
    // label 과 method 매핑
    const eventHandlers = {
        "Draw POINT": pointEventHandler,
        "Draw POLYLINE": polylineEventHandler,
        "Draw POLYGON": polygonEventHandler,
        "Select": selectEventHandler,
        "Remove": removeEventHandler,
        "Modify": modifyEventHandler,
    }[ label ]

    // 이벤트 관리용 hook
    useCesiumEventHandlers( viewer, eventHandlers );
};

export default useActivateCesium;
