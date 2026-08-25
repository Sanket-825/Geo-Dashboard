import { useEffect, useRef } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import MarkerClusterGroup from "react-leaflet-cluster";

import "leaflet/dist/leaflet.css";
// Correct CSS path for react-leaflet-cluster (not leaflet.markercluster directly)
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";

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

// Zooms/spiderfies the cluster group until the selected
// marker is actually visible, instead of just re-centering
// on a spot that may still be folded into a cluster bubble.
function RevealSelectedMarker({ selectedId, markerRefs, clusterRef }) {
  useEffect(() => {
    if (!selectedId) return;

    const marker = markerRefs.current[selectedId];
    const clusterGroup = clusterRef.current;

    if (marker && clusterGroup) {
      clusterGroup.zoomToShowLayer(marker, () => {
        marker.openPopup();
      });
    }
  }, [selectedId, markerRefs, clusterRef]);

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

  const clusterRef = useRef(null);
  const markerRefs = useRef({});

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

      <RevealSelectedMarker
        selectedId={selectedId}
        markerRefs={markerRefs}
        clusterRef={clusterRef}
      />

      <MarkerClusterGroup
        ref={clusterRef}
        chunkedLoading
        spiderfyOnMaxZoom
        showCoverageOnHover={false}
      >
        {data.map((item) => (
          <Marker
            key={item._id}
            ref={(instance) => {
              if (instance) {
                markerRefs.current[item._id] = instance;
              } else {
                delete markerRefs.current[item._id];
              }
            }}
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
      </MarkerClusterGroup>
    </MapContainer>
  );
}