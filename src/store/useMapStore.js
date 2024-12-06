import { create } from 'zustand';

const useMapStore = create((set) => ({

    coordinates: {
        lon: 127.3845475,
        lat: 36.3504119,
      },
    rotation: 0,
    cesiumViewer: null,
    olMap: null,

    setCoordinates: (lon, lat) => set({ coordinates: {
        lon: lon,
        lat: lat,
    } }),
    
    setRotation: (rotation) => set(() => ({ rotation: rotation })),
    setCesiumViewer: (viewerInstance) => set(() => ({ cesiumViewer: viewerInstance })),

    setOlMap: (map) => set(() => ({ olMap: map })),


}))

export default useMapStore;