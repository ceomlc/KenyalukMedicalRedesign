import { useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  FolderOpen,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
  MoveRight,
  Info,
  Shuffle,
} from "lucide-react";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import heroImage1 from "@assets/generated_images/Homepage_hero_medical_mission_8407b3a7.png";
import heroImage2 from "@assets/generated_images/Medical_Aid_Outreach_program_6e6641dc.png";
import heroImage3 from "@assets/generated_images/Health_Advancement_program_image_2dd82fce.png";
import heroImage4 from "@assets/generated_images/Healthcare_Professional_Empowerment_program_d2a2e1c9.png";

interface CloudinaryImage {
  id: string;
  url: string;
  width: number;
  height: number;
  format: string;
  folder: string;
  alt: string;
}

interface FallbackImage {
  src: string;
  alt: string;
}

interface SiteSection {
  folder: string;
  label: string;
  description: string;
  fallbackImages?: FallbackImage[];
}

const SITE_SECTIONS: SiteSection[] = [
  {
    folder: "hero",
    label: "Homepage Hero Carousel",
    description: "Large banner images for the homepage slideshow. Recommended: 1920x800px landscape photos.",
    fallbackImages: [
      { src: heroImage1, alt: "Healthcare workers providing medical care" },
      { src: heroImage2, alt: "Medical outreach program" },
      { src: heroImage3, alt: "Health advancement program" },
      { src: heroImage4, alt: "Healthcare professional empowerment" },
    ],
  },
  {
    folder: "mission",
    label: "Mission Section",
    description: "Image displayed in the 'Our Mission' section. Recommended: 800x600px.",
    fallbackImages: [
      { src: heroImage1, alt: "Our mission - healthcare workers" },
    ],
  },
  {
    folder: "programs-health-advancement",
    label: "Health Advancement Program",
    description: "Photos for the Health Advancement program page and cards.",
    fallbackImages: [
      { src: heroImage3, alt: "Health advancement program" },
    ],
  },
  {
    folder: "programs-medical-aid-outreach",
    label: "Medical Aid Outreach Program",
    description: "Photos for the Medical Aid Outreach program page and cards.",
    fallbackImages: [
      { src: heroImage2, alt: "Medical aid outreach program" },
    ],
  },
  {
    folder: "programs-healthcare-professional-empowerment",
    label: "Healthcare Professional Empowerment",
    description: "Photos for the Healthcare Professional Empowerment program page and cards.",
    fallbackImages: [
      { src: heroImage4, alt: "Healthcare professional empowerment" },
    ],
  },
];

function ImageUploader({
  folder,
  onUploadComplete,
}: {
  folder: string;
  onUploadComplete: () => void;
}) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file",
          description: "Please select an image file (JPG, PNG, WebP, etc.)",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 10MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("folder", folder);

        const response = await fetch("/api/admin/images/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Upload failed");
        }

        toast({
          title: "Image uploaded",
          description: `Image uploaded to "${folder}" successfully.`,
        });
        onUploadComplete();
        setPreview(null);
      } catch (error: any) {
        toast({
          title: "Upload failed",
          description: error.message || "Something went wrong during upload.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [folder, toast, onUploadComplete]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-md p-6 text-center transition-colors cursor-pointer hover-elevate ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        data-testid={`dropzone-${folder.replace(/\//g, "-")}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          data-testid={`input-file-${folder.replace(/\//g, "-")}`}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : preview ? (
          <div className="flex flex-col items-center gap-2">
            <img
              src={preview}
              alt="Preview"
              className="max-h-32 rounded-md object-contain"
            />
            <p className="text-sm text-muted-foreground">Uploading preview...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag & drop an image here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground/70">
              JPG, PNG, WebP - Max 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function HeroRandomizerToggle() {
  const { toast } = useToast();

  const { data: settingData, isLoading: settingLoading } = useQuery<{ key: string; value: string }>({
    queryKey: ["/api/settings/hero_randomizer"],
    staleTime: 0,
  });

  const { data: allImagesData, isLoading: imagesLoading } = useQuery<{ images: CloudinaryImage[] }>({
    queryKey: ["/api/images"],
    staleTime: 30 * 1000,
    retry: false,
  });

  const isEnabled = settingData?.value === "true";
  const totalImages = allImagesData?.images?.length ?? 0;
  const hasAnyImages = totalImages > 0;

  const toggleMutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const res = await fetch("/api/admin/settings/hero_randomizer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ value: String(enabled) }),
      });
      if (!res.ok) throw new Error("Failed to update setting");
      return res.json();
    },
    onSuccess: (_data, enabled) => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/hero_randomizer"] });
      toast({
        title: enabled ? "Random Mode enabled" : "Fixed Mode enabled",
        description: enabled
          ? "The homepage hero will now pick a random image from your entire Cloudinary gallery on each visit."
          : "The homepage hero will show the first image in the hero folder (or the default if empty).",
      });
    },
    onError: () => {
      toast({ title: "Failed to update setting", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-4 p-4 rounded-md border bg-muted/30">
        <div className="p-2 rounded-md bg-primary/10 flex-shrink-0 mt-0.5">
          <Shuffle className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-medium text-sm">Hero Image Mode</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Controls how the homepage hero background image is chosen.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Badge variant={isEnabled ? "default" : "secondary"} data-testid="badge-hero-mode">
                {isEnabled ? "Random Mode" : "Fixed Mode"}
              </Badge>
              {settingLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <div className="flex items-center gap-2">
                  <Label htmlFor="hero-randomizer-switch" className="text-xs text-muted-foreground cursor-pointer">
                    {isEnabled ? "On" : "Off"}
                  </Label>
                  <Switch
                    id="hero-randomizer-switch"
                    checked={isEnabled}
                    onCheckedChange={(checked) => toggleMutation.mutate(checked)}
                    disabled={toggleMutation.isPending}
                    data-testid="switch-hero-randomizer"
                  />
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {isEnabled
              ? imagesLoading
                ? "Checking gallery..."
                : hasAnyImages
                  ? `Each page load picks a random image from your ${totalImages} Cloudinary gallery image${totalImages !== 1 ? "s" : ""}.`
                  : "Random mode is on, but no images have been uploaded to your gallery yet."
              : "The homepage hero always shows the first image in the hero folder above. Falls back to the built-in default if that folder is empty."}
          </p>
        </div>
      </div>

      {isEnabled && !imagesLoading && !hasAnyImages && (
        <div className="flex items-start gap-3 p-3 rounded-md border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              No images in your Cloudinary gallery yet
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Upload images to any section on this page and they will be included in the random hero pool.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionManager({ section }: { section: SiteSection }) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);

  const {
    data,
    isLoading,
    refetch,
  } = useQuery<{ images: CloudinaryImage[] }>({
    queryKey: ["/api/images/folder", section.folder],
    retry: false,
  });

  const images = data?.images || [];

  const deleteMutation = useMutation({
    mutationFn: async (publicId: string) => {
      const response = await fetch(`/api/admin/images/${publicId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Delete failed");
      }
    },
    onSuccess: () => {
      toast({ title: "Image deleted", description: "The image has been removed." });
      refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (publicId: string) => {
    if (window.confirm("Are you sure you want to delete this image? This cannot be undone.")) {
      deleteMutation.mutate(publicId);
    }
  };

  return (
    <Card>
      <CardHeader
        className="cursor-pointer hover-elevate"
        onClick={() => setExpanded(!expanded)}
        data-testid={`button-toggle-${section.folder.replace(/\//g, "-")}`}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <FolderOpen className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <CardTitle className="text-lg">{section.label}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {section.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Badge variant="secondary">...</Badge>
            ) : images.length > 0 ? (
              <Badge variant="default">
                {images.length} image{images.length !== 1 ? "s" : ""}
              </Badge>
            ) : section.fallbackImages && section.fallbackImages.length > 0 ? (
              <Badge variant="secondary">
                {section.fallbackImages.length} default{section.fallbackImages.length !== 1 ? "s" : ""}
              </Badge>
            ) : (
              <Badge variant="secondary">0 images</Badge>
            )}
            <span className="text-muted-foreground text-sm">
              {expanded ? "Collapse" : "Expand"}
            </span>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-6">
          {section.folder === "hero" && <HeroRandomizerToggle />}
          <ImageUploader
            folder={section.folder}
            onUploadComplete={() => {
              refetch();
              queryClient.invalidateQueries({ queryKey: ["/api/images"] });
            }}
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : images.length === 0 ? (
            <div className="space-y-4">
              {section.fallbackImages && section.fallbackImages.length > 0 ? (
                <>
                  <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50 border border-muted">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Currently showing built-in default images</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        These images are bundled with the site. Upload your own photos above or assign images from "All Cloudinary Images" below to replace them.
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Images currently displayed on site ({section.fallbackImages.length}):
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {section.fallbackImages.map((fb, idx) => (
                      <div
                        key={idx}
                        className="relative rounded-md overflow-hidden border opacity-80"
                        data-testid={`fallback-image-${section.folder}-${idx}`}
                      >
                        <img
                          src={fb.src}
                          alt={fb.alt}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-2 bg-card">
                          <Badge variant="secondary" className="text-xs">
                            Built-in default
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Info className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">No images assigned to this section yet.</p>
                  <p className="text-xs mt-1">
                    Upload images here, or scroll down to "All Cloudinary Images" to assign existing images.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative rounded-md overflow-hidden border"
                  data-testid={`image-card-${image.id.replace(/\//g, "-")}`}
                >
                  <img
                    src={image.url.replace(
                      "/upload/",
                      "/upload/c_fill,w_300,h_200,q_auto,f_auto/"
                    )}
                    alt={image.alt}
                    className="w-full h-32 object-cover"
                    loading="lazy"
                  />
                  <div className="p-2 bg-card flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground truncate flex-1">
                      {image.id.split("/").pop()}
                    </p>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-shrink-0"
                      onClick={() => handleDelete(image.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${image.id.replace(/\//g, "-")}`}
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function AllImagesSection() {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [allImages, setAllImages] = useState<CloudinaryImage[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const {
    isLoading,
  } = useQuery<{ images: CloudinaryImage[]; nextCursor: string | null }>({
    queryKey: ["/api/images"],
    retry: false,
    queryFn: async () => {
      const res = await fetch("/api/images?limit=100", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch images");
      const data = await res.json();
      setAllImages(data.images || []);
      setNextCursor(data.nextCursor || null);
      setInitialLoaded(true);
      return data;
    },
  });

  const loadMore = async () => {
    if (!nextCursor || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch(`/api/images?limit=100&cursor=${nextCursor}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load more images");
      const data = await res.json();
      setAllImages((prev) => [...prev, ...(data.images || [])]);
      setNextCursor(data.nextCursor || null);
    } catch (err) {
      console.error("Failed to load more images:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const refetchAll = async () => {
    const res = await fetch("/api/images?limit=100", { credentials: "include" });
    if (!res.ok) return;
    const data = await res.json();
    setAllImages(data.images || []);
    setNextCursor(data.nextCursor || null);
  };

  const deleteMutation = useMutation({
    mutationFn: async (publicId: string) => {
      const response = await fetch(`/api/admin/images/${encodeURIComponent(publicId)}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Delete failed");
      }
    },
    onSuccess: () => {
      toast({ title: "Image deleted", description: "The image has been removed." });
      refetchAll();
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const moveMutation = useMutation({
    mutationFn: async ({ publicId, targetFolder }: { publicId: string; targetFolder: string }) => {
      const response = await apiRequest("POST", "/api/admin/images/move", { publicId, targetFolder });
      return response.json();
    },
    onSuccess: (_data, variables) => {
      const sectionLabel = SITE_SECTIONS.find(s => s.folder === variables.targetFolder)?.label || variables.targetFolder;
      toast({ title: "Image moved", description: `Image assigned to "${sectionLabel}".` });
      refetchAll();
      queryClient.invalidateQueries({ queryKey: ["/api/images"] });
      SITE_SECTIONS.forEach(s => {
        queryClient.invalidateQueries({ queryKey: ["/api/images/folder", s.folder] });
      });
    },
    onError: (error: any) => {
      toast({
        title: "Move failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (publicId: string) => {
    if (window.confirm("Are you sure you want to delete this image? This cannot be undone.")) {
      deleteMutation.mutate(publicId);
    }
  };

  const handleMove = (publicId: string, targetFolder: string) => {
    moveMutation.mutate({ publicId, targetFolder });
  };

  const images = allImages;
  const rootImages = images.filter((img) => !img.folder || img.folder === "");
  const folderImages = images.filter((img) => img.folder && img.folder !== "");

  return (
    <Card>
      <CardHeader
        className="cursor-pointer hover-elevate"
        onClick={() => setExpanded(!expanded)}
        data-testid="button-toggle-all-images"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <CardTitle className="text-lg">All Cloudinary Images</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                All images in your Cloudinary account. Hover over any unorganized image and use the arrow button to assign it to a site section above.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {isLoading ? "..." : `${images.length} image${images.length !== 1 ? "s" : ""}`}
            </Badge>
            <span className="text-muted-foreground text-sm">
              {expanded ? "Collapse" : "Expand"}
            </span>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No images found in your Cloudinary account.</p>
            </div>
          ) : (
            <>
              {rootImages.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    Unorganized ({rootImages.length} images) - Assign these to a section to display them on your site
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {rootImages.map((image) => (
                      <div
                        key={image.id}
                        className="group relative rounded-md overflow-hidden border"
                        data-testid={`image-card-all-${image.id.replace(/\//g, "-")}`}
                      >
                        <img
                          src={image.url.replace(
                            "/upload/",
                            "/upload/c_fill,w_200,h_150,q_auto,f_auto/"
                          )}
                          alt={image.alt}
                          className="w-full h-28 object-cover"
                          loading="lazy"
                        />
                        <div className="p-1.5 bg-card flex items-center justify-between gap-1">
                          <p className="text-xs text-muted-foreground truncate flex-1">
                            {image.id.split("/").pop()}
                          </p>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  disabled={moveMutation.isPending}
                                  data-testid={`button-move-${image.id.replace(/\//g, "-")}`}
                                >
                                  {moveMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <MoveRight className="h-4 w-4" />
                                  )}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="center">
                                <DropdownMenuLabel>Assign to Section</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {SITE_SECTIONS.map((section) => (
                                  <DropdownMenuItem
                                    key={section.folder}
                                    onClick={() => handleMove(image.id, section.folder)}
                                    data-testid={`menu-move-${section.folder}-${image.id.replace(/\//g, "-")}`}
                                  >
                                    <FolderOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                                    {section.label}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDelete(image.id)}
                              disabled={deleteMutation.isPending}
                              data-testid={`button-delete-all-${image.id.replace(/\//g, "-")}`}
                            >
                              {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {folderImages.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    In Folders ({folderImages.length} images)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {folderImages.map((image) => (
                      <div
                        key={image.id}
                        className="group relative rounded-md overflow-hidden border"
                        data-testid={`image-card-all-${image.id.replace(/\//g, "-")}`}
                      >
                        <img
                          src={image.url.replace(
                            "/upload/",
                            "/upload/c_fill,w_200,h_150,q_auto,f_auto/"
                          )}
                          alt={image.alt}
                          className="w-full h-28 object-cover"
                          loading="lazy"
                        />
                        <div className="p-1.5 bg-card flex items-center justify-between gap-1">
                          <p className="text-xs text-muted-foreground truncate flex-1">
                            <span className="text-primary/70">{image.folder}/</span>
                            {image.id.split("/").pop()}
                          </p>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="flex-shrink-0"
                            onClick={() => handleDelete(image.id)}
                            disabled={deleteMutation.isPending}
                          >
                            {deleteMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {nextCursor && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    data-testid="button-load-more-images"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      "Load More Images"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}

interface CloudinaryFolder {
  name: string;
  path: string;
}

export default function AdminImages() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const { data: foldersData, refetch: refetchFolders } = useQuery<{ folders: CloudinaryFolder[] }>({
    queryKey: ["/api/images/folders"],
    retry: false,
  });

  const customFolders: SiteSection[] = (foldersData?.folders ?? [])
    .filter((f) => !SITE_SECTIONS.some((s) => s.folder === f.path))
    .map((f) => ({
      folder: f.path,
      label: f.name,
      description: `Custom folder: ${f.path}`,
    }));

  const createFolderMutation = useMutation({
    mutationFn: async (folderName: string) => {
      const res = await apiRequest("POST", "/api/admin/images/folder", { folder: folderName });
      return res.json();
    },
    onSuccess: (_data, folderName) => {
      toast({ title: "Folder created", description: `"${folderName}" is ready for uploads.` });
      setShowCreateFolder(false);
      setNewFolderName("");
      refetchFolders();
      queryClient.invalidateQueries({ queryKey: ["/api/images/folders"] });
    },
    onError: (error: any) => {
      toast({ title: "Failed to create folder", description: error.message, variant: "destructive" });
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You need to log in to access this page. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const isAdmin = (user as any).role === "admin" || (user as any).role === "board_member";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="font-headings font-bold text-3xl mb-4">
              Access Denied
            </h1>
            <p className="text-muted-foreground mb-6">
              You need admin or board member access to manage site images.
            </p>
            <Button asChild>
              <Link href="/portal" data-testid="link-back-portal">
                Back to Portal
              </Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 mb-2 flex-wrap">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/portal" data-testid="button-back-portal">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1
                className="font-headings font-bold text-3xl md:text-4xl"
                data-testid="heading-image-manager"
              >
                Image Manager
              </h1>
              <p className="text-muted-foreground mt-1">
                Upload and manage images across your website sections
              </p>
            </div>
            <Button
              onClick={() => setShowCreateFolder(true)}
              data-testid="button-create-folder"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Folder
            </Button>
          </div>

          <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="py-2">
                <Label htmlFor="new-folder-name" className="text-sm font-medium mb-2 block">
                  Folder Name
                </Label>
                <Input
                  id="new-folder-name"
                  placeholder="e.g. gala-2026"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newFolderName.trim()) {
                      createFolderMutation.mutate(newFolderName.trim());
                    }
                  }}
                  data-testid="input-new-folder-name"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Use lowercase letters, numbers, and hyphens. The folder will be created in Cloudinary immediately.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setShowCreateFolder(false); setNewFolderName(""); }}>
                  Cancel
                </Button>
                <Button
                  onClick={() => createFolderMutation.mutate(newFolderName.trim())}
                  disabled={!newFolderName.trim() || createFolderMutation.isPending}
                  data-testid="button-confirm-create-folder"
                >
                  {createFolderMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Creating...</>
                  ) : (
                    "Create Folder"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Card className="mb-8 mt-6 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">
                    How it works
                  </p>
                  <p>
                    Each section below corresponds to a part of your website.
                    Upload images to a section and they will automatically
                    appear on the site. If a section has no images, the site
                    shows placeholder images instead.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {SITE_SECTIONS.map((section) => (
              <SectionManager key={section.folder} section={section} />
            ))}
            {customFolders.map((section) => (
              <SectionManager key={section.folder} section={section} />
            ))}
            <AllImagesSection />
          </div>
        </div>
      </section>
    </div>
  );
}
