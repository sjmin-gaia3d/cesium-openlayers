import { create } from 'zustand';

const useMapStore = create((set) => ({

    centerCoordinates: {
        lon: 127.3845475,
        lat: 36.3504119,
      },
    rotation: 0,
    cesiumViewer: null,
    olMap: null,

    setCenterCoordinates: (lon, lat) => set({ centerCoordinates: {
        lon: lon,
        lat: lat,
    } }),

    setRotation: (rotation) => set(() => ({ rotation: rotation })),
    setCesiumViewer: (viewerInstance) => set(() => ({ cesiumViewer: viewerInstance })),

    setOlMap: (map) => set(() => ({ olMap: map })),


}))

export default useMapStore;