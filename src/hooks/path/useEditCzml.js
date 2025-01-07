import useMapStore from "../../store/useMapStore.js";
import { useShallow } from "zustand/shallow";
import * as Cesium from "cesium";
import { useState } from "react";
import useCesiumEventHandlers from "../useCesiumEventHandlers.js";
import useDataSourceStore from "../../store/useDataSourceStore.js";

const useEditCzml = ( { label }) => {
    const { viewer } = useMapStore(
        useShallow((state) => ({
            viewer: state.cesiumViewer,
        }))
    );

    const { czmlDataSource } = useDataSourceStore(
        useShallow((state) => ({
            czmlDataSource: state.czmlDataSource,
        }))
    );

    const [positions, setPositions] = useState([]); // 경로 지점 저장
    const [newEntity, setNewEntity] = useState(null); // 생성된 엔티티 저장

    // CZML 데이터 추가 함수
    const addCZMLToDataSource = () => {
        if (!czmlDataSource) {
            console.error("CZML DataSource가 초기화되지 않았습니다.");
            return;
        }

        if (positions.length < 2) {
            console.warn("경로 지점이 충분하지 않습니다.");
            return;
        }

        // 새로운 CZML 데이터 생성
        const czml = [
            {
                id: "document",
                name: "Dynamic CZML Document",
                version: "1.0",
            },
            {
                id: `czml_${czmlDataSource.entities.values.length}`,
                availability: "2024-01-01T00:00:00Z/2024-01-01T00:01:00Z", // 재생속도
                position: {
                    interpolationAlgorithm: "LAGRANGE", // 보간 알고리즘
                    interpolationDegree: 0, // 보간 차수 - 높아지면, CZML 경로가 원형에 가까워짐
                    epoch: "2024-01-01T00:00:00Z", // 시뮬레이션 기준시간 - 현재 시간으로 해야하나
                    cartographicDegrees: positions
                        .map((pos, index) => {
                            const cartographic = Cesium.Cartographic.fromCartesian(pos);
                            return [
                                index * 10, // 시간 간격 (10초 단위, 2024-01-01T00:00:10Z)
                                Cesium.Math.toDegrees(cartographic.longitude),
                                Cesium.Math.toDegrees(cartographic.latitude),
                                cartographic.height || 0,
                            ];
                        })
                        .flat(),
                },
                point: {
                    pixelSize: 10, // Point 크기
                    color: { rgba: [Math.random() * 255, Math.random() * 255, Math.random() * 255, 255] }, // 무작위 색상
                },
                path: {
                    material: {
                        solidColor: { color: { rgba: [0, 255, 255, 255] } }, // 경로 색상
                    },
                    width: 2,
                    leadTime: Number.MAX_VALUE, // 미래 경로 전체 표시
                    trailTime: Number.MAX_VALUE, // 과거 경로 전체 표시
                },
            },
        ];

        // 기존 CZML DataSource에 데이터 추가
        czmlDataSource.process(czml);

        console.log(`CZML 데이터 추가 완료: ${czml[1].id}`);

        // 경로 상태 초기화
        setPositions([]);
        if (newEntity) {
            viewer.entities.remove(newEntity);
            setNewEntity(null);
        }
    };

    // Polyline 이벤트 핸들러
    const polylineEventHandler = {
        [Cesium.ScreenSpaceEventType.LEFT_CLICK]: (eventViewer, event) => {
            const position = viewer.scene.pickPosition(event.position);
            if (!Cesium.defined(position)) return;

            setPositions((prevPositions) => {
                const updatedPositions = [...prevPositions, position];

                // 엔티티 생성 또는 업데이트
                if (!newEntity) {
                    const dynamicPositions = new Cesium.CallbackProperty(() => updatedPositions, false);
                    const polyline = new Cesium.Entity({
                        polyline: {
                            positions: dynamicPositions,
                            width: 2,
                            material: Cesium.Color.RED,
                        },
                    });
                    setNewEntity(polyline);
                    viewer.entities.add(polyline);
                } else {
                    newEntity.polyline.positions = updatedPositions;
                }

                return updatedPositions;
            });
        },
        [Cesium.ScreenSpaceEventType.RIGHT_CLICK]: () => {
            if (positions.length > 1) {
                addCZMLToDataSource(); // CZML 데이터 추가
            }
        },
    };

    // 이벤트 등록
    const eventHandlers = {
        "Draw CZML": polylineEventHandler,
    }[label];

    useCesiumEventHandlers(viewer, eventHandlers);
};

export default useEditCzml;
