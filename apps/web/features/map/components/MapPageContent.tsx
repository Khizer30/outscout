"use client";
import MapFindLeadsButton from "@features/map/components/MapFindLeadsButton";
import MapPlaceDetailsPanel from "@features/map/components/MapPlaceDetailsPanel";
import { MapProvider } from "@features/map/components/MapProvider";
import MapSearchInput from "@features/map/components/MapSearchInput";
import MapTypeSelect from "@features/map/components/MapTypeSelect";
import MapView from "@features/map/components/MapView";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useTranslation } from "react-i18next";

export default function MapPageContent() {
  return (
    <MapProvider>
      <MapPageContentInner />
    </MapProvider>
  );
}

function MapPageContentInner() {
  const { t } = useTranslation();
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="space-y-4 p-6 md:p-8">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">{t("map.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("map.description")}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <MapSearchInput />
        <MapTypeSelect />
        <MapFindLeadsButton />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <div className="h-[70vh] min-h-105 overflow-hidden rounded-xl ring-1 ring-foreground/8 dark:ring-foreground/12">
          {apiKey ? (
            <APIProvider apiKey={apiKey}>
              <MapView />
            </APIProvider>
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set.</div>
          )}
        </div>

        <div className="h-[70vh] min-h-105">
          <MapPlaceDetailsPanel />
        </div>
      </div>
    </div>
  );
}
