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

    const setCzmlDataSource = useDataSourceStore((
        useShallow((state) => state.setCzmlDataSource)
    ))

    useEffect(() => {
        if (!cesiumViewer) return;

        const dataSource = new Cesium.CustomDataSource(dataSourceName);
        const czmlDataSource = new Cesium.CzmlDataSource();
        cesiumViewer.dataSources.add(dataSource);
        cesiumViewer.dataSources.add(czmlDataSource);
        setDataSource(dataSource);
        setCzmlDataSource(czmlDataSource)

        return () => {
            cesiumViewer.dataSources.remove(dataSource, true);
            cesiumViewer.dataSources.remove(czmlDataSource, true);
        };

    }, [cesiumViewer, setDataSource, dataSourceName, setCzmlDataSource])
}

export default useInitDataSource