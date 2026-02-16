import { useState, useCallback, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { Link } from "wouter";

interface CloudinaryImage {
  id: string;
  url: string;
  width: number;
  height: number;
  format: string;
  folder: string;
  alt: string;
}

const SITE_SECTIONS = [
  {
    folder: "hero",
    label: "Homepage Hero Carousel",
    description: "Large banner images for the homepage slideshow. Recommended: 1920x800px landscape photos.",
  },
  {
    folder: "mission",
    label: "Mission Section",
    description: "Image displayed in the 'Our Mission' section. Recommended: 800x600px.",
  },
  {
    folder: "programs/health-advancement",
    label: "Health Advancement Program",
    description: "Photos for the Health Advancement program page and cards.",
  },
  {
    folder: "programs/medical-aid-outreach",
    label: "Medical Aid Outreach Program",
    description: "Photos for the Medical Aid Outreach program page and cards.",
  },
  {
    folder: "programs/healthcare-professional-empowerment",
    label: "Healthcare Professional Empowerment",
    description: "Photos for the Healthcare Professional Empowerment program page and cards.",
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

function SectionManager({ section }: { section: (typeof SITE_SECTIONS)[0] }) {
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
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No images uploaded yet.</p>
              <p className="text-xs mt-1">
                The site will show placeholder images until you upload real photos here.
              </p>
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
                  <div
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    style={{ visibility: "visible" }}
                  >
                    <Button
                      size="icon"
                      variant="destructive"
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
                  <div className="p-2 bg-card">
                    <p className="text-xs text-muted-foreground truncate">
                      {image.id.split("/").pop()}
                    </p>
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

export default function AdminImages() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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
            <div>
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
          </div>

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
          </div>
        </div>
      </section>
    </div>
  );
}
