"use client";
import MapLocateButton from "@features/map/components/MapLocateButton";
import { useMapContext } from "@features/map/components/MapProvider";
import { Map, type MapCameraChangedEvent, Marker } from "@vis.gl/react-google-maps";

export default function MapView() {
  const { center, zoom, markerPosition, onCameraChanged } = useMapContext();

  const handleCameraChanged = (event: MapCameraChangedEvent) => {
    onCameraChanged(event.detail.center, event.detail.zoom);
  };

  return (
    <div className="relative size-full">
      <Map
        center={center}
        zoom={zoom}
        onCameraChanged={handleCameraChanged}
        gestureHandling="greedy"
        disableDefaultUI={false}
        zoomControl
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        className="size-full"
      >
        {markerPosition && <Marker position={markerPosition} />}
      </Map>
      <MapLocateButton />
    </div>
  );
}
