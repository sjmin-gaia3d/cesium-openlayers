import { useEffect } from 'react'
import useMapStore from '../../store/useMapStore'
import { useShallow } from 'zustand/shallow'
import useDataSourceStore from '../../store/useDataSourceStore'
import * as Cesium from "cesium";

const useInitDataSource = (dataSourceName) => {
    const { cesiumViewer } = useMapStore(
        useShallow((state) => ({ cesiumViewer: state.cesiumViewer }))
    )

    const setDataSource = useDataSourceStore((
        useShallow((state) => state.setDataSource)
    ))

    useEffect(() => {
        if (!cesiumViewer) return;

        const dataSource = new Cesium.CustomDataSource(dataSourceName);
        cesiumViewer.dataSources.add(dataSource);
        setDataSource(dataSource);
    }, [cesiumViewer, setDataSource, dataSourceName])
}

export default useInitDataSource