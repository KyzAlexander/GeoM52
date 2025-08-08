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
      const drawnItems = new L.FeatureGroup(); //контейнер для слоёв
      map.addLayer(drawnItems); //добавляем эти слои на карту
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

      map.on(L.Draw.Event.CREATED, (event: L.LeafletEvent) => {
        drawnItems.clearLayers();

        const layer = event.layer; //слой который создали
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
        map.removeControl(drawControl); //удаление контрола

        //удаление нарисованного слоя  (но специально закоммитил, чтобы после закрытия модалки был виден ранее выделенный слой)
        // if (map.hasLayer(drawnItems)) {
        //   map.removeLayer(drawnItems); 
        // }
      };
    }, [map, onSelectRectangle]);

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

        // attribution=&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DrawRectangle onSelectRectangle={onSelectRectangle} onDrawnItemsRefReady={onDrawnItemsRefReady} />
    </MapContainer>
  );
};

export default MapView;
