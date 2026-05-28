import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {
  defaultIcon,
  selectedIcon,
} from "./mapIcons";

function MapAutoCenter({ position }) {
  const map = useMap();

  if (position) {
    map.setView(position, map.getZoom(), {
      animate: false,
    });
  }

  return null;
}

export default function MapView({
  data = [],
  selectedId,
  onSelect,
}) {
  const selectedItem = data.find(
    (item) => item._id === selectedId
  );

  return (
    <MapContainer
      center={[19.076, 72.8777]}
      zoom={6}
      style={{
        height: "100vh",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {selectedItem && (
        <MapAutoCenter
          position={[
            selectedItem.latitude,
            selectedItem.longitude,
          ]}
        />
      )}

      {data.map((item) => (
        <Marker
          key={item._id}
          position={[
            item.latitude,
            item.longitude,
          ]}

          icon={
            item._id === selectedId
              ? selectedIcon
              : defaultIcon
          }

          eventHandlers={{
            click: () => onSelect(item._id),
          }}
        >
          <Popup>
            <strong>{item.projectName}</strong>

            <br />

            Status: {item.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}