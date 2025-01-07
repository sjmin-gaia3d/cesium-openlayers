import { create } from 'zustand';

const useDataSourceStore = create((set) => ({
    dataSource: null,
    setDataSource: (source) => set(() => ({ dataSource: source })),
    czmlDataSource: null,
    setCzmlDataSource: (source) => set(() => ({ czmlDataSource: source })),
}));

export default useDataSourceStore;