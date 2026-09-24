"use client";
import { useMapPlaceDetails } from "@features/map/api/map.api";
import type { LeadTypeSchema } from "@repo/dtos/lead";
import type { PlaceDetailsSchema } from "@repo/dtos/map";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { z } from "zod";

export type MapBusinessType = z.infer<typeof LeadTypeSchema> | "ALL";
export type MapPlaceDetails = z.infer<typeof PlaceDetailsSchema>;
export type MapLatLng = { lat: number; lng: number };

// When geolocation is unavailable or denied
const DEFAULT_CENTER: MapLatLng = { lat: 31.5497, lng: 74.3436 };
const DEFAULT_ZOOM = 12;
const LOCATED_ZOOM = 13;
const SELECTED_PLACE_ZOOM = 16;
const DEFAULT_SEARCH_LIMIT = 10;

interface MapContextValue {
  businessType: MapBusinessType;
  setBusinessType: (type: MapBusinessType) => void;
  searchLimit: number;
  setSearchLimit: (limit: number) => void;
  center: MapLatLng;
  zoom: number;
  onCameraChanged: (center: MapLatLng, zoom: number) => void;
  selectedPlaceId: string | null;
  selectPlace: (placeId: string) => void;
  place: MapPlaceDetails | undefined;
  isLoadingPlace: boolean;
  markerPosition: MapLatLng | null;
  locateUser: () => void;
  isLocating: boolean;
}

const MapContext = createContext<MapContextValue | null>(null);

export function useMapContext() {
  const ctx = useContext(MapContext);
  if (!ctx) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return ctx;
}

interface MapProviderProps {
  children: React.ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
  const [businessType, setBusinessType] = useState<MapBusinessType>("ALL");
  const [searchLimit, setSearchLimit] = useState(DEFAULT_SEARCH_LIMIT);
  const [center, setCenter] = useState<MapLatLng>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const { data: place, isLoading: isLoadingPlace } = useMapPlaceDetails(selectedPlaceId);
  const placeLat = place?.latitude ?? null;
  const placeLng = place?.longitude ?? null;

  const locateUser = useCallback(() => {
    if (!("geolocation" in navigator)) {
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
        setZoom(LOCATED_ZOOM);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { maximumAge: 300000, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    locateUser();
  }, [locateUser]);

  useEffect(() => {
    if (placeLat !== null && placeLng !== null) {
      setCenter({ lat: placeLat, lng: placeLng });
      setZoom(SELECTED_PLACE_ZOOM);
    }
  }, [placeLat, placeLng]);

  const markerPosition = placeLat !== null && placeLng !== null ? { lat: placeLat, lng: placeLng } : null;

  const value: MapContextValue = {
    businessType,
    setBusinessType,
    searchLimit,
    setSearchLimit,
    center,
    zoom,
    onCameraChanged: (nextCenter, nextZoom) => {
      setCenter(nextCenter);
      setZoom(nextZoom);
    },
    selectedPlaceId,
    selectPlace: setSelectedPlaceId,
    place,
    isLoadingPlace,
    markerPosition,
    locateUser,
    isLocating
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}
