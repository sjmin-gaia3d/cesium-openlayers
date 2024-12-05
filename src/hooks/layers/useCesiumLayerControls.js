import React from 'react'
import useLoadOsmLayer from './useLoadOsmLayer';
import useLoadGoogle3DTileset from './useLoadGoogle3dTileset';
import useLoadBuildingTileset from "./useLoadBuildingTileset";
import * as Cesium from "cesium";

const useCesiumLayerControls = (viewer) => {
  const { osmBuildings } = useLoadBuildingTileset(viewer)
  const { osmLayer } = useLoadOsmLayer(viewer);
  const { google3DTileset } = useLoadGoogle3DTileset(viewer);

  const toggleOSMLayer = () => {
    if (!osmLayer || !google3DTileset) return;
    osmLayer.show = true;
    google3DTileset.show = false;

    setBuildingVisibility(true)
  };

  const toggleGoogleTileset = () => {
    if (!osmLayer || !google3DTileset) return;
    osmLayer.show = false;
    google3DTileset.show = true;

    setBuildingVisibility(false)
  };

  const resetToDefault = () => {
    if (!osmLayer || !google3DTileset) return;
    osmLayer.show = false;
    google3DTileset.show = false;

    setBuildingVisibility(true)
  };

  const setBuildingVisibility = (visible) => {
    if (!osmBuildings) return;
    osmBuildings.style = new Cesium.Cesium3DTileStyle({
      color: `color('white', ${visible ? 1 : 0})`,
    });
  };

  return { osmBuildings, osmLayer, google3DTileset, toggleOSMLayer, toggleGoogleTileset, resetToDefault }
}

export default useCesiumLayerControls