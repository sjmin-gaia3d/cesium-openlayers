import React, { useEffect, useState } from 'react'
import { Map as OlMap, View } from 'ol';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { defaults } from 'ol/control/defaults';

const useinitOlMap = ( mapRef ) => {
    const [ olMap, setOlMap ] = useState(null);
    
    useEffect(() => {
        if (!mapRef.current) return; // mapRef가 초기화되지 않았으면 종료

        const tilelayer = new TileLayer({
            source: new OSM(),
        });
        const view = new View({
            center: fromLonLat([127.3845475, 36.3504119]),
            zoom: 18,
        })
    
        const map = new OlMap({
            controls: defaults({ zoom: false, rotate: false, attribution: false }),
            layers: [
                tilelayer
            ],
            view: view,
        })
        map.setTarget(mapRef.current);
        setOlMap(map);
        return () => {
            map.setTarget(null);
        };
    }, [mapRef]);
  return { olMap }
}

export default useinitOlMap