import type { GenerateSignedUrlResponseSchema } from "@repo/dtos/media";
import useAxios from "@shared/hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { z } from "zod";

const PROFILE_IMAGE_FOLDER = "outscout/users";

type SignedUrlResponse = z.infer<typeof GenerateSignedUrlResponseSchema>;

interface CloudinaryUploadResponse {
  secure_url: string;
  eager?: { secure_url: string }[];
}

// Upload Image
export const useUploadImage = () => {
  const api = useAxios();

  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const signed = await api.post<SignedUrlResponse>("/media/image/signed-url", { folder: PROFILE_IMAGE_FOLDER });
      const { signature, timestamp, apiKey, cloudName, eager, folder } = signed.data.data;

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);
      form.append("eager", eager);
      form.append("folder", folder);

      const res = await axios.post<CloudinaryUploadResponse>(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, form);

      return res.data.eager?.[0]?.secure_url ?? res.data.secure_url;
    }
  });
};

// Delete Image
export const useDeleteImage = () => {
  const api = useAxios();

  return useMutation({
    mutationFn: async (url: string): Promise<void> => {
      await api.delete("/media/image", { data: { url } });
    }
  });
};
