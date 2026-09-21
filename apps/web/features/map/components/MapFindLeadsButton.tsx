"use client";
import { useGenerateLeads } from "@features/lead/api/lead.api";
import { useMapContext } from "@features/map/components/MapProvider";
import { zoomToRadiusMeters } from "@features/map/lib/radius";
import { Button } from "@shared/components/ui/button";
import { getErrorMessage } from "@shared/lib/error";
import { Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const LEADS_LIMIT = 10;

export default function MapFindLeadsButton() {
  const { t } = useTranslation();
  const { center, zoom, businessType } = useMapContext();
  const generateLeads = useGenerateLeads();

  const isTypeSelected = businessType !== "ALL";

  const handleClick = () => {
    if (!isTypeSelected) {
      return;
    }

    generateLeads.mutate(
      {
        latitude: center.lat,
        longitude: center.lng,
        radius: zoomToRadiusMeters(center.lat, zoom),
        serviceType: businessType,
        limit: LEADS_LIMIT
      },
      {
        onSuccess: (res) => toast.success(t("map.findLeadsSuccess", { count: res.data.length })),
        onError: (error) => toast.error(getErrorMessage(error))
      }
    );
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={!isTypeSelected || generateLeads.isPending}
      title={isTypeSelected ? undefined : t("map.selectTypePrompt")}
    >
      {generateLeads.isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
      {t("map.findLeads")}
    </Button>
  );
}
