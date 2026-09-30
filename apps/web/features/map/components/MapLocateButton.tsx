"use client";
import { useMapContext } from "@features/map/components/MapProvider";
import { Button } from "@shared/components/ui/button";
import { LocateFixed, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MapLocateButton() {
  const { t } = useTranslation();
  const { locateUser, isLocating } = useMapContext();

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={locateUser}
      disabled={isLocating}
      aria-label={t("map.locateMe")}
      title={t("map.locateMe")}
      className="absolute bottom-3 left-3 z-10 bg-card shadow-md"
    >
      {isLocating ? <Loader2 className="animate-spin" /> : <LocateFixed />}
    </Button>
  );
}
