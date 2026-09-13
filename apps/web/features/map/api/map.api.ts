import type { AutocompleteResponseSchema, AutocompleteSchema, GetPlaceDetailsResponseSchema } from "@repo/dtos/map";
import useAxios from "@shared/hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";

// Autocomplete
export const useMapAutocomplete = (params: z.infer<typeof AutocompleteSchema> | null) => {
  const api = useAxios();

  return useQuery({
    queryKey: ["map", "autocomplete", params],
    queryFn: async () => {
      const res = await api.post<z.infer<typeof AutocompleteResponseSchema>>("/map/autocomplete", params);
      return res.data.data;
    },
    enabled: !!params && params.query.trim().length > 0,
    placeholderData: (previousData) => previousData
  });
};

// Get Place Details
export const useMapPlaceDetails = (placeId: string | null) => {
  const api = useAxios();

  return useQuery({
    queryKey: ["map", "place", placeId],
    queryFn: async () => {
      const res = await api.get<z.infer<typeof GetPlaceDetailsResponseSchema>>(`/map/place/${placeId}`);
      return res.data.data;
    },
    enabled: !!placeId
  });
};
