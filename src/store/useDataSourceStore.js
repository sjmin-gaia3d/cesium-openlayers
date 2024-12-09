import { create } from 'zustand';

const useDataSourceStore = create((set) => ({
    dataSource: null,
    setDataSource: (source) => set(() => ({ dataSource: source })),
}));

export default useDataSourceStore;