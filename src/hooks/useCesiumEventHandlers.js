import { useEffect } from "react";
import * as Cesium from "cesium";

// Cesium에서 사용할 이벤트 객체 선언 Hook
const useCesiumEventHandlers = (viewer, eventHandlers) => {
  useEffect(() => {
    if (!viewer || !eventHandlers) return;

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    
    // 이벤트 등록
    Object.entries(eventHandlers).forEach(([eventType, callback]) => {
      handler.setInputAction((event) => {
        if (event?.position) {
            callback(viewer, event);
          } else {
            console.error("Invalid event object or position is undefined");
          }
      }, parseInt(eventType));
    });

    // 특정 이벤트만 제거
    return () => {
      Object.keys(eventHandlers).forEach((eventType) => {
        handler.removeInputAction(parseInt(eventType));
      });
       handler.destroy(); // Cleanup handler
    };
  }, [viewer, eventHandlers]);
};

export default useCesiumEventHandlers;