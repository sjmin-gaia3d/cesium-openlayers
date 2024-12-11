import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// 초기 상태 정의
const initialSelectedObject = {
    id: null,
    from: null,
    type: null,
    activate: null, // draw, select, remove, modifty
    style: null,
    coordinates: [], // WGS84; EPSG:4326
    meta: null,
};

const useObjectStore = create(
    devtools(
        immer(
            combine(
                {
                    selectedObject: { ...initialSelectedObject },
                },
                (set) => ({
                    setSelectedObject: (object) =>
                        set((state) => ({
                            selectedObject:
                                typeof object === 'function'
                                    ? object(state.selectedObject)
                                    : object
                        })),
                    // 상태 초기화
                    resetselectedObject: () =>
                        set(() => ({
                            selectedObject: { ...initialSelectedObject }
                        })),
                })
            )
        ),
    )
);

export default useObjectStore;
