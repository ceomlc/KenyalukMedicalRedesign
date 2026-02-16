import CloudinaryGallery from "@/components/CloudinaryGallery";

export default function Gallery() {
  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="font-headings font-bold text-4xl md:text-5xl mb-4" data-testid="text-gallery-heading">
              Photo Gallery
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-gallery-subtitle">
              Browse photos from our programs, events, and community outreach efforts across Kenya.
            </p>
          </div>

          <CloudinaryGallery
            showFolderNav={true}
            limit={30}
            columns={3}
          />
        </div>
      </section>
    </div>
  );
}
