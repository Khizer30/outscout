"use client";
import MapLocateButton from "@features/map/components/MapLocateButton";
import { useMapContext } from "@features/map/components/MapProvider";
import { Map, type MapCameraChangedEvent, type MapMouseEvent, Marker } from "@vis.gl/react-google-maps";

export default function MapView() {
  const { center, zoom, markerPosition, onCameraChanged, selectPlace } = useMapContext();

  const handleCameraChanged = (event: MapCameraChangedEvent) => {
    onCameraChanged(event.detail.center, event.detail.zoom);
  };

  const handleClick = (event: MapMouseEvent) => {
    if (event.detail.placeId) {
      event.stop();
      selectPlace(event.detail.placeId);
    }
  };

  return (
    <div className="relative size-full">
      <Map
        center={center}
        zoom={zoom}
        onCameraChanged={handleCameraChanged}
        onClick={handleClick}
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
