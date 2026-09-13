"use client";
import { useMapContext } from "@features/map/components/MapProvider";
import { Badge } from "@shared/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { Globe, Loader2, MapPin, Phone, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MapPlaceDetailsPanel() {
  const { t } = useTranslation();
  const { selectedPlaceId, place, isLoadingPlace } = useMapContext();

  if (!selectedPlaceId) {
    return (
      <Card className="flex size-full items-center justify-center p-6 text-center">
        <CardContent className="p-0 text-sm text-muted-foreground">{t("map.selectPlacePrompt")}</CardContent>
      </Card>
    );
  }

  if (isLoadingPlace || !place) {
    return (
      <Card className="flex size-full items-center justify-center">
        <CardContent className="p-0">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="size-full overflow-y-auto">
      <CardHeader>
        <CardTitle>{place.name ?? t("map.detailsNotFound")}</CardTitle>
        {place.primaryType && <CardDescription>{t(`map.types.${place.primaryType}`)}</CardDescription>}
      </CardHeader>
      <CardContent>
        {place.address && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0" />
            <span>{place.address}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="size-4 shrink-0" />
          <span>{place.phone ?? t("map.noPhone")}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="size-4 shrink-0" />
          {place.website ? (
            <a href={place.website} target="_blank" rel="noreferrer" className="truncate text-primary hover:underline">
              {place.website}
            </a>
          ) : (
            <span>{t("map.noWebsite")}</span>
          )}
        </div>

        {place.rating !== null && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="size-4 shrink-0 fill-amber-400 text-amber-400" />
            <span>
              {place.rating} · {t("map.reviews", { count: place.userRatingCount ?? 0 })}
            </span>
          </div>
        )}

        {place.types.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {place.types.map((type) => (
              <Badge key={type} variant="secondary">
                {t(`map.types.${type}`)}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
