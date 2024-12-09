import { create } from 'zustand';

const useVectorSourceStore = create((set) => ({
    vectorSource: null,
    setVectorSource: (source) => set(() => ({ vectorSource: source })),
}));

export default useVectorSourceStore;