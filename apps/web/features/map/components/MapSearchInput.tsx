"use client";
import { useMapAutocomplete } from "@features/map/api/map.api";
import { useMapContext } from "@features/map/components/MapProvider";
import { Input } from "@shared/components/ui/input";
import useDebounce from "@shared/hooks/useDebounce";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function MapSearchInput() {
  const { t } = useTranslation();
  const { center, businessType, selectPlace } = useMapContext();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query.trim(), 350);

  const params =
    debouncedQuery.length > 0
      ? {
          query: debouncedQuery,
          latitude: center.lat,
          longitude: center.lng,
          types: businessType === "ALL" ? undefined : [businessType]
        }
      : null;

  const { data: suggestions, isFetching } = useMapAutocomplete(params);

  const handleSelect = (placeId: string, text: string) => {
    selectPlace(placeId);
    setQuery(text);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full sm:max-w-md">
      <div className="relative">
        <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder={t("map.searchPlaceholder")}
          className="pl-9"
        />
        {isFetching && <Loader2 className="absolute inset-y-0 right-3 my-auto size-4 animate-spin text-muted-foreground" />}
      </div>

      {isOpen && debouncedQuery.length > 0 && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-lg ring-1 ring-foreground/8 dark:ring-foreground/12">
          {suggestions && suggestions.length > 0 ? (
            <ul className="max-h-72 overflow-y-auto p-1">
              {suggestions.map((prediction) => (
                <li key={prediction.placeId}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelect(prediction.placeId, prediction.text)}
                    className="flex w-full flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="font-medium">{prediction.mainText}</span>
                    {prediction.secondaryText && <span className="text-xs text-muted-foreground">{prediction.secondaryText}</span>}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            !isFetching && <p className="px-3 py-3 text-sm text-muted-foreground">{t("map.noResults")}</p>
          )}
        </div>
      )}
    </div>
  );
}
