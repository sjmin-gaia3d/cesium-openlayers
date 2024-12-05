# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

```bash
npm install cesium
npm install vitew-plugin-cesium
npm install ol
cp ./node_modules/cesium/Source/* ./public/Cesium
```
vite.config.js 에 cesium plugin 적용
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cesium()],
})
```
index.html 에 Cesium css 적용
```HTML
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="/Cesium/Widgets/widgets.css" />
    <title>Vite + React</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

index.css 제거(openlayers css와 중복되며, 아래 오류 문구를 표출)
```
No map visible because the map container's width or height are 0.
Error Component Stack at OpenLayersComponents
```

`npm run dev`


### 트러블 슈팅
1.
```
No map visible because the map container's width or height are 0.
Error Component Stack at OpenLayersMap
```
> index.css 제거(openlayers css와 중복되며, 위 오류 문구를 표출)

2.
```
Uncaught TypeError: setOlMap is not a function at OpenLayersMap
```
```javascript
const OpenLayersMap = ({setOlMap}) => {
    const mapRef = useRef(null);
    const { olMap } = useInitOlMap(mapRef);
    setOlMap(olMap) // useEffect추가(전)
}
```
> react는 렌더링 중 상태 변경을 허용하지 않음, setOlMap으로 상태를 변경하려면 useEffect를 통해, 컴포넌트 마운트 후에 상태를 변경해야함
```javascript
const OpenLayersMap = ({setOlMap}) => {
    const mapRef = useRef(null);
    const { olMap } = useInitOlMap(mapRef);
    useEffect(()=>{
      setOlMap(olMap) // useEffect추가(후)
    },[olMap, setOlMap])
}
```
3.
useContext 객체의 좌표값이 setCenterCoordinates로 변경되지 않는 문제

```javascript
const App = () => {

    // OpenLayers와 Cesium의 초기화된 객체를 상태로 관리
    const [olMap, setOlMap] = useState(null);
    const [cesiumViewer, setCesiumViewer] = useState(null);
  
    // 내부에서 Context 객체를 통해 동기화
    useSyncCenter({ olMap, cesiumViewer });

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <CenterCoordinatesProvider>
        <OpenLayersMap />
        <CesiumMap />
      </CenterCoordinatesProvider>
    </div>
  )
}

export default App
```
> Context가 선언되기 전에 Context 객체를 사용해서 발생한 문제, 호출 위치를 변경함
```javascript
const App = () => {
// useSyncCenter({ olMap, cesiumViewer }); 호출 위치 변경(전)
  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <CenterCoordinatesProvider>
        <OpenLayersMap />
        <CesiumMap />
      </CenterCoordinatesProvider>
    </div>
  )
}
// OpenLayersMap
const OpenLayersMap = () => {
    const mapRef = useRef(null);
    const { olMap } = useInitOlMap(mapRef);
    useSyncCenter({olMap}); // 호출 위치 변경(후)
    return (
        <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
    );
};

export default OpenLayersMap;
```