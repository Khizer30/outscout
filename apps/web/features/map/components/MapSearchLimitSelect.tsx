"use client";
import { useMapContext } from "@features/map/components/MapProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/ui/select";
import { useTranslation } from "react-i18next";

const SEARCH_LIMIT_OPTIONS = [5, 10, 15, 20];

export default function MapSearchLimitSelect() {
  const { t } = useTranslation();
  const { searchLimit, setSearchLimit } = useMapContext();

  const items = Object.fromEntries(SEARCH_LIMIT_OPTIONS.map((limit) => [String(limit), t("map.searchLimitOption", { count: limit })]));

  return (
    <Select items={items} value={String(searchLimit)} onValueChange={(next) => next && setSearchLimit(Number(next))}>
      <SelectTrigger className="w-full shrink-0 sm:w-40" aria-label={t("map.searchLimit")}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {SEARCH_LIMIT_OPTIONS.map((limit) => (
          <SelectItem key={limit} value={String(limit)}>
            {t("map.searchLimitOption", { count: limit })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
