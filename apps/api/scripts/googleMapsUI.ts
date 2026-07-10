// // npm install @react-google-maps/api

// // Approximate meters visible per zoom level (at equator)
// function zoomToRadius(zoom: number): number {
//   return Math.round(40_000_000 / Math.pow(2, zoom) / 2);
// }
// // zoom 10 → ~20000m,  zoom 14 → ~2000m,  zoom 17 → ~300m

// ("use client");

// import { useState, useCallback } from "react";
// import { GoogleMap, Circle, useJsApiLoader } from "@react-google-maps/api";

// function zoomToRadius(zoom: number): number {
//   return Math.round(40_000_000 / Math.pow(2, zoom) / 2);
// }

// interface MapSelection {
//   lat: number;
//   lng: number;
//   radiusMeters: number;
// }

// export default function LeadMap() {
//   const { isLoaded } = useJsApiLoader({
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
//   });

//   const [center, setCenter] = useState({ lat: 33.6844, lng: 73.0479 });
//   const [zoom, setZoom] = useState(14);
//   const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

//   const radius = zoomToRadius(zoom);

//   const onLoad = useCallback((map: google.maps.Map) => {
//     setMapRef(map);
//   }, []);

//   const onCenterChanged = useCallback(() => {
//     if (!mapRef) return;
//     const c = mapRef.getCenter();
//     if (c) setCenter({ lat: c.lat(), lng: c.lng() });
//   }, [mapRef]);

//   const onZoomChanged = useCallback(() => {
//     if (!mapRef) return;
//     setZoom(mapRef.getZoom() ?? 14);
//   }, [mapRef]);

//   async function handleSearch(serviceType: string) {
//     const res = await fetch("/api/leads/nearby", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         lat: center.lat,
//         lng: center.lng,
//         radiusMeters: radius,
//         serviceType
//       })
//     });
//     const data = await res.json();
//     console.log(data.places);
//   }

//   if (!isLoaded) return <div>Loading map...</div>;

//   return (
//     <div>
//       <GoogleMap
//         mapContainerStyle={{ width: "100%", height: "500px" }}
//         center={center}
//         zoom={zoom}
//         onLoad={onLoad}
//         onCenterChanged={onCenterChanged}
//         onZoomChanged={onZoomChanged}
//       >
//         {/* Visual radius circle centred on map */}
//         <Circle center={center} radius={radius} options={{ strokeColor: "#4F46E5", fillColor: "#4F46E580" }} />
//       </GoogleMap>

//       <p>
//         Radius: {radius}m | Lat: {center.lat.toFixed(5)} | Lng: {center.lng.toFixed(5)}
//       </p>

//       <button onClick={() => handleSearch("restaurant")}>Find Restaurants</button>
//     </div>
//   );
// }
