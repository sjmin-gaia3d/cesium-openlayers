import OpenLayersMap from './components/map/OpenLayersMap';
import CesiumMap from './components/map/CesiumMap';
import SyncControl from './components/toolbar/common/SyncControl';

const App = () => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <SyncControl />
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ display: "flex", flexDirection: 'colum', flex: 1, height: '100%', overflow: 'hidden' }}>
          <OpenLayersMap />
        </div>
        <div style={{ display: "flex", flexDirection: 'colum', flex: 1, height: '100%', overflow: 'hidden' }}>
          <CesiumMap />
        </div>
      </div>
    </div>
  );
};

export default App;
