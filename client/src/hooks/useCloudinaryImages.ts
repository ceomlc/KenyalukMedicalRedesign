import { useQuery } from "@tanstack/react-query";

export interface CloudinaryImage {
  id: string;
  url: string;
  width: number;
  height: number;
  format: string;
  folder: string;
  alt: string;
  caption: string;
}

function optimizedUrl(url: string, width: number = 800) {
  return url.replace("/upload/", `/upload/w_${width},c_limit,q_auto,f_auto/`);
}

function thumbnailUrl(url: string, width = 400, height = 400) {
  return url.replace("/upload/", `/upload/w_${width},h_${height},c_fill,g_auto,q_auto,f_auto/`);
}

function heroUrl(url: string) {
  return url.replace("/upload/", "/upload/w_1920,c_limit,q_auto,f_auto/");
}

interface UseCloudinaryImagesOptions {
  folder: string;
  limit?: number;
  tag?: string;
  enabled?: boolean;
}

export function useCloudinaryImages({ folder, limit = 10, tag, enabled = true }: UseCloudinaryImagesOptions) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (tag) params.set("tag", tag);

  const url = folder
    ? `/api/images/folder/${folder}?${params}`
    : `/api/images?${params}`;

  const query = useQuery<{
    images: CloudinaryImage[];
    subfolders?: { name: string; path: string }[];
    nextCursor: string | null;
  }>({
    queryKey: [url],
    enabled,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  return {
    images: query.data?.images || [],
    isLoading: query.isLoading,
    isError: query.isError,
    hasImages: (query.data?.images?.length || 0) > 0,
  };
}

export { optimizedUrl, thumbnailUrl, heroUrl };
