"use client";
import { useMapContext, type MapBusinessType } from "@features/map/components/MapProvider";
import { LeadTypeSchema } from "@repo/dtos/lead";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/ui/select";
import { useTranslation } from "react-i18next";

export default function MapTypeSelect() {
  const { t } = useTranslation();
  const { businessType, setBusinessType } = useMapContext();

  const items = {
    ALL: t("map.allTypes"),
    ...Object.fromEntries(LeadTypeSchema.options.map((type) => [type, t(`map.types.${type}`)]))
  };

  return (
    <Select items={items} value={businessType} onValueChange={(next) => setBusinessType(next as MapBusinessType)}>
      <SelectTrigger className="w-full sm:w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        <SelectItem value="ALL">{t("map.allTypes")}</SelectItem>
        {LeadTypeSchema.options.map((type) => (
          <SelectItem key={type} value={type}>
            {t(`map.types.${type}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
