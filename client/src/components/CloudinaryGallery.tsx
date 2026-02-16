import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, FolderOpen, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface CloudinaryImage {
  id: string;
  url: string;
  width: number;
  height: number;
  format: string;
  folder: string;
  alt: string;
  caption: string;
}

interface CloudinaryFolder {
  name: string;
  path: string;
}

interface GalleryProps {
  folder?: string;
  tag?: string;
  limit?: number;
  columns?: 2 | 3 | 4;
  showFolderNav?: boolean;
  title?: string;
}

function optimizedUrl(url: string, width: number = 800) {
  return url.replace("/upload/", `/upload/w_${width},c_limit,q_auto,f_auto/`);
}

function thumbnailUrl(url: string) {
  return url.replace("/upload/", "/upload/w_400,h_400,c_fill,g_auto,q_auto,f_auto/");
}

export default function CloudinaryGallery({
  folder,
  tag,
  limit = 30,
  columns = 3,
  showFolderNav = false,
  title,
}: GalleryProps) {
  const [currentFolder, setCurrentFolder] = useState(folder || "");
  const [lightboxImage, setLightboxImage] = useState<CloudinaryImage | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const foldersQuery = useQuery<{ folders: CloudinaryFolder[] }>({
    queryKey: ["/api/images/folders"],
    enabled: showFolderNav && !currentFolder,
  });

  const activeFolder = currentFolder || folder || "";

  const buildImageUrl = () => {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (tag) params.set("tag", tag);
    return activeFolder
      ? `/api/images/folder/${activeFolder}?${params}`
      : `/api/images?${params}`;
  };

  const imageUrl = buildImageUrl();

  const imagesQuery = useQuery<{
    images: CloudinaryImage[];
    subfolders?: CloudinaryFolder[];
    nextCursor: string | null;
  }>({
    queryKey: [imageUrl],
  });

  const images = imagesQuery.data?.images || [];
  const subfolders = imagesQuery.data?.subfolders || [];
  const rootFolders = foldersQuery.data?.folders || [];

  const openLightbox = (image: CloudinaryImage, index: number) => {
    setLightboxImage(image);
    setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxImage(null);

  const prevImage = () => {
    if (images.length === 0) return;
    const newIndex = (lightboxIndex - 1 + images.length) % images.length;
    setLightboxIndex(newIndex);
    setLightboxImage(images[newIndex]);
  };

  const nextImage = () => {
    if (images.length === 0) return;
    const newIndex = (lightboxIndex + 1) % images.length;
    setLightboxIndex(newIndex);
    setLightboxImage(images[newIndex]);
  };

  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div>
      {title && (
        <h2 className="font-headings font-bold text-3xl md:text-4xl mb-8 text-center" data-testid="text-gallery-title">
          {title}
        </h2>
      )}

      {showFolderNav && (
        <div className="mb-6">
          {activeFolder && (
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => {
                const parts = activeFolder.split("/");
                parts.pop();
                setCurrentFolder(parts.join("/"));
              }}
              data-testid="button-folder-back"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}

          {(activeFolder ? subfolders : rootFolders).length > 0 && (
            <div className="flex flex-wrap gap-3 mb-6">
              {(activeFolder ? subfolders : rootFolders).map((f) => (
                <Button
                  key={f.path}
                  variant="outline"
                  onClick={() => setCurrentFolder(f.path)}
                  data-testid={`button-folder-${f.name}`}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  {f.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {imagesQuery.isLoading && (
        <div className="flex items-center justify-center py-20" data-testid="loading-gallery">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading images...</span>
        </div>
      )}

      {imagesQuery.isError && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground" data-testid="text-gallery-error">
              Unable to load images. Please check that your image hosting is configured correctly.
            </p>
          </CardContent>
        </Card>
      )}

      {!imagesQuery.isLoading && images.length === 0 && !imagesQuery.isError && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground" data-testid="text-gallery-empty">
              No images found{activeFolder ? ` in "${activeFolder}"` : ""}.
            </p>
          </CardContent>
        </Card>
      )}

      {images.length > 0 && (
        <div className={`grid ${gridCols[columns]} gap-4`} data-testid="gallery-grid">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square overflow-hidden rounded-md cursor-pointer"
              onClick={() => openLightbox(image, index)}
              data-testid={`gallery-image-${index}`}
            >
              <img
                src={thumbnailUrl(image.url)}
                alt={image.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white text-sm">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
          data-testid="lightbox-overlay"
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
            data-testid="button-lightbox-close"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Previous image"
            data-testid="button-lightbox-prev"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Next image"
            data-testid="button-lightbox-next"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          <div className="max-w-5xl max-h-[90vh] px-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={optimizedUrl(lightboxImage.url, 1200)}
              alt={lightboxImage.alt}
              className="max-w-full max-h-[85vh] object-contain mx-auto"
              data-testid="lightbox-image"
            />
            {lightboxImage.caption && (
              <p className="text-white text-center mt-4 text-lg">{lightboxImage.caption}</p>
            )}
            <p className="text-white/60 text-center mt-2 text-sm">
              {lightboxIndex + 1} of {images.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
