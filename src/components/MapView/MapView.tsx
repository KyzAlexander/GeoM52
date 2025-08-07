import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import L, { FeatureGroup } from "leaflet";
import "leaflet-draw";
import "leaflet/dist/leaflet.css";
import 'leaflet-draw/dist/leaflet.draw.css'
import { RectangleCoords } from "../../types/types";
import { CenterCoords } from "../../constants/variables";

interface MapViewProps {
  onSelectRectangle: (coords: RectangleCoords) => void;
  onDrawnItemsRefReady: (ref: FeatureGroup) => void;
}

const MapView: React.FC<MapViewProps> = ({ onSelectRectangle, onDrawnItemsRefReady }) => {


  const DrawRectangle = ({ onSelectRectangle }: MapViewProps) => {
    const map = useMap();

    useEffect(() => {
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      onDrawnItemsRefReady(drawnItems);

      const drawControl = new L.Control.Draw({
        draw: {
          polygon: false,
          polyline: false,
          circle: false,
          marker: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: drawnItems,
          edit: false,
          remove: false,
        },
      });

      map.addControl(drawControl);

      map.on(L.Draw.Event.CREATED, (event: any) => {
        drawnItems.clearLayers();

        const layer = event.layer;
        drawnItems.addLayer(layer);

        if (layer instanceof L.Rectangle) {
          const bounds = layer.getBounds();
          const coords: RectangleCoords = {
            northEast: [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
            southWest: [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
          };
          onSelectRectangle(coords);
        }
      });

      return () => {
        map.removeControl(drawControl);
      };
    }, [map, onSelectRectangle, onDrawnItemsRefReady]);

    return null;
  };

  return (
    <MapContainer
      center={CenterCoords}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "80vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DrawRectangle onSelectRectangle={onSelectRectangle} onDrawnItemsRefReady={onDrawnItemsRefReady} />
    </MapContainer>
  );
};

export default MapView;
