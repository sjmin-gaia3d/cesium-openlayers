import useMapStore from "../../store/useMapStore.js";
import { useShallow } from "zustand/shallow";
import useVectorSourceStore from "../../store/useVectorSourceStore.js";
import { useCallback, useEffect, useRef } from "react";
import { fromLonLat } from "ol/proj.js";
import { LineString, Point } from "ol/geom.js";
import { Feature } from "ol";

const useEditOlMarkerAnimation = ( { label } ) => {
    const { olMap } = useMapStore(
        useShallow( ( state ) => ({ olMap: state.olMap }) )
    );
    const { vectorSource } = useVectorSourceStore(
        useShallow( ( state ) => ({ vectorSource: state.vectorSource }) )
    );

    const distanceRef = useRef( 0 ); // 이동 비율 저장
    const lastTimeRef = useRef( null ); // 마지막 갱신 시간

    const positionRef = useRef( null ); // 이동 중인 포인트의 위치 참조
    const routeRef = useRef( null ); // 경로 참조
    const geomarkerRef = useRef( null )

    // 경로 좌표 데이터
    const routeCoordinates = [
        [ 127.3845475, 36.3504119 ], // 대전 중심 좌표
        [ 127.385, 36.351 ],
        [ 127.386, 36.352 ],
        [ 127.387, 36.353 ],
    ].map( ( coord ) => fromLonLat( coord ) );

    useEffect( () => {
        if ( !olMap || !vectorSource ) return;

        const route = new LineString( routeCoordinates );
        routeRef.current = route;

        const routeFeature = new Feature( { geometry: route } );

        const startMarker = new Feature( {
            type: "icon",
            geometry: new Point( route.getFirstCoordinate() ),
        } );
        const endMarker = new Feature( {
            type: "icon",
            geometry: new Point( route.getLastCoordinate() ),
        } );

        const position = startMarker.getGeometry().clone();
        positionRef.current = position;

        const geoMarker = new Feature( {
            type: "geoMarker", // type 명에 따라 다른 스타일을 적용할 수 있음
            geometry: position,
        } );
        geomarkerRef.current = geoMarker

        vectorSource.addFeatures( [ routeFeature, geoMarker, startMarker, endMarker ] );

    }, [ olMap, vectorSource ] );

    const moveFeature = useCallback( ( event ) => {
        // 동일한 메서드를 계속해서 등록, 생성된 메서드를 특정하여 제거하지 못하는 오류
        // useCallback 사용으로 해결

        const speed = 10; // 이동 속도
        const time = event.frameState.time; // 프레임 시간
        const elapsedTime = time - lastTimeRef.current; // 경과 시간 계산

        // 이동 비율 업데이트
        lastTimeRef.current = time;
        distanceRef.current = (distanceRef.current + (speed * elapsedTime) / 1e6) % 2;

        // 현재 좌표 계산
        const currentCoordinate = routeRef.current.getCoordinateAt(
            distanceRef.current > 1 ? 2 - distanceRef.current : distanceRef.current
        );

        // 좌표 이동
        positionRef.current.setCoordinates( currentCoordinate );

    }, [] );

    useEffect(() => {
        if (!label) return;

        if (label === "Start Animation") {
            lastTimeRef.current = Date.now();
            olMap.on("postrender", moveFeature);
            olMap.render();
        } else if (label === "Stop Animation" ) {
            geomarkerRef.current.setGeometry( positionRef.current );
            olMap.un( "postrender", moveFeature );
        }
    }, [label, moveFeature, olMap]);
}

export default useEditOlMarkerAnimation;