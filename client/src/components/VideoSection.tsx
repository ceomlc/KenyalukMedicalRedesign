import { useQuery } from "@tanstack/react-query";
import { Video } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  embedUrl: string;
  section: string;
  displayOrder: number;
}

interface VideoSectionProps {
  section: string;
  heading?: string;
  subheading?: string;
  className?: string;
}

export function VideoSection({ section, heading = "Watch Our Work in Action", subheading, className = "" }: VideoSectionProps) {
  const { data: videoList = [] } = useQuery<VideoItem[]>({
    queryKey: ["/api/videos", section],
    queryFn: async () => {
      const res = await fetch(`/api/videos?section=${encodeURIComponent(section)}`);
      if (!res.ok) throw new Error("Failed to fetch videos");
      return res.json();
    },
  });

  if (videoList.length === 0) return null;

  return (
    <section className={`py-16 md:py-24 bg-muted/30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <Video className="h-6 w-6 text-primary" />
          </div>
          <h2 className="font-headings font-bold text-3xl md:text-4xl mb-4">{heading}</h2>
          {subheading && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subheading}</p>
          )}
        </div>

        <div className={`grid gap-8 ${videoList.length === 1 ? "max-w-3xl mx-auto" : videoList.length === 2 ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
          {videoList.map((v) => (
            <div key={v.id} className="space-y-3">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg bg-black">
                <iframe
                  src={v.embedUrl}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  loading="lazy"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg leading-snug">{v.title}</h3>
                {v.description && (
                  <p className="text-sm text-muted-foreground mt-1">{v.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
