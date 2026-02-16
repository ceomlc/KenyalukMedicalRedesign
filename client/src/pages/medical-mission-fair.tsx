import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, X, ChevronLeft, ChevronRight } from "lucide-react";

const UPLOADS = "https://www.kenyalukmedicalfoundation.org/wp-content/uploads";

interface GallerySection {
  title: string;
  description?: string;
  images: { src: string; alt: string }[];
}

const photosOfTheDay = [
  "IMG_8849", "IMG_8770", "IMG_8902", "IMG_8804", "IMG_8740", "IMG_8814",
  "IMG_8915", "IMG_9003", "IMG_9022", "IMG_9021", "IMG_9029", "IMG_9034",
  "IMG_9033", "IMG_9027", "IMG_9025", "IMG_9046", "IMG_9067", "IMG_9071",
  "IMG_9084", "IMG_9091", "IMG_9119", "IMG_9121", "IMG_9106", "IMG_8755",
  "IMG_9125", "IMG_9126", "IMG_9139", "IMG_9143", "IMG_9135", "IMG_9127",
  "IMG_9147", "IMG_9195", "IMG_9152", "IMG_9204", "IMG_9268", "IMG_9244",
  "IMG_9196", "IMG_8650", "IMG_8652", "IMG_9282", "IMG_8668", "IMG_8692",
  "IMG_8698", "IMG_8656", "IMG_9293",
];

const julyNinthPhotos = [
  "IMG_9847", "IMG_0129", "IMG_0127", "IMG_0126", "IMG_0123", "IMG_0128",
  "IMG_0131", "IMG_0138", "IMG_0139", "IMG_0141", "IMG_0142", "IMG_0143",
  "IMG_0144", "IMG_0145", "IMG_0147", "IMG_0148", "IMG_0149", "IMG_0155",
  "IMG_0163", "IMG_0160", "IMG_0165", "IMG_0167", "IMG_9814", "IMG_0176",
  "IMG_0177", "IMG_9815", "IMG_9822", "IMG_9825", "IMG_9830", "IMG_9833",
  "IMG_9840", "IMG_9844", "IMG_0003", "IMG_0011", "IMG_0122", "IMG_0016",
  "IMG_0001", "IMG_0012", "IMG_0033", "IMG_0025", "IMG_0021", "IMG_0044",
  "IMG_0024", "IMG_0046", "IMG_0065", "IMG_0048", "IMG_0051", "IMG_0066",
  "IMG_0068", "IMG_0077", "IMG_0078", "IMG_0085", "IMG_0086", "IMG_0096",
  "IMG_0091", "IMG_0093",
];

const sections: GallerySection[] = [
  {
    title: "Photos of the Day",
    description: "Highlights from our Medical Mission Fair — providing healthcare and compassion to the community.",
    images: photosOfTheDay.map((name, i) => ({
      src: `${UPLOADS}/slider3/${name}.jpeg`,
      alt: `Medical Mission Fair photo ${i + 1}`,
    })),
  },
  {
    title: "9th of July 2025",
    description: "Our most recent Medical Mission Fair event, reaching even more community members with essential healthcare services.",
    images: julyNinthPhotos.map((name, i) => ({
      src: `${UPLOADS}/slider4/${name}.jpeg`,
      alt: `July 9th Medical Mission Fair photo ${i + 1}`,
    })),
  },
];

function Lightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: {
  images: { src: string; alt: string }[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
      data-testid="lightbox-overlay"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        data-testid="button-lightbox-close"
      >
        <X className="h-6 w-6" />
      </Button>

      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 text-white"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            data-testid="button-lightbox-prev"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 text-white"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            data-testid="button-lightbox-next"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      <div className="max-w-5xl max-h-[85vh] px-16" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="max-w-full max-h-[85vh] object-contain rounded-md"
          data-testid="img-lightbox"
        />
        <p className="text-white/70 text-center text-sm mt-3" data-testid="text-lightbox-index">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}

export default function MedicalMissionFair() {
  const [lightbox, setLightbox] = useState<{
    sectionIndex: number;
    imageIndex: number;
  } | null>(null);

  const openLightbox = (sectionIndex: number, imageIndex: number) => {
    setLightbox({ sectionIndex, imageIndex });
  };

  const closeLightbox = () => setLightbox(null);

  const navigateLightbox = (dir: 1 | -1) => {
    if (!lightbox) return;
    const images = sections[lightbox.sectionIndex].images;
    const next = (lightbox.imageIndex + dir + images.length) % images.length;
    setLightbox({ ...lightbox, imageIndex: next });
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${UPLOADS}/2025/08/nh-2470154140U4ta681.jpg)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h1
            className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6"
            data-testid="text-mmf-heading"
          >
            Medical Mission Fair
          </h1>
          <p
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8"
            data-testid="text-mmf-subtitle"
          >
            Our Medical Mission Fair brings healthcare and compassion to the community. These photos highlight the meaningful moments shared during our events.
          </p>
          <Button variant="default" asChild data-testid="button-mmf-donate">
            <Link href="/donate">
              <Heart className="h-4 w-4 mr-2 fill-current" />
              Support Our Mission
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-20">
          {sections.map((section, sIdx) => (
            <div key={sIdx} id={`section-${sIdx}`} className="scroll-mt-24">
              <div className="mb-8">
                <h2
                  className="font-headings font-bold text-2xl md:text-3xl mb-3"
                  data-testid={`text-mmf-section-title-${sIdx}`}
                >
                  {section.title}
                </h2>
                {section.description && (
                  <p className="text-muted-foreground max-w-3xl" data-testid={`text-mmf-section-desc-${sIdx}`}>
                    {section.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {section.images.map((img, iIdx) => (
                  <Card
                    key={iIdx}
                    className="overflow-visible cursor-pointer hover-elevate"
                    onClick={() => openLightbox(sIdx, iIdx)}
                    data-testid={`img-mmf-${sIdx}-${iIdx}`}
                  >
                    <div className="aspect-square overflow-hidden rounded-md">
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-6">
          <h2 className="font-headings font-bold text-2xl md:text-3xl" data-testid="text-mmf-cta-title">
            Be Part of Our Next Mission
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="text-mmf-cta-desc">
            Our Medical Mission Fairs provide essential healthcare services to communities in need. Your support helps us reach more people and save more lives.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="default" asChild data-testid="button-mmf-donate-bottom">
              <Link href="/donate">
                <Heart className="h-4 w-4 mr-2 fill-current" />
                Donate Now
              </Link>
            </Button>
            <Button variant="outline" asChild data-testid="button-mmf-volunteer">
              <Link href="/volunteer">Volunteer With Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {lightbox && (
        <Lightbox
          images={sections[lightbox.sectionIndex].images}
          currentIndex={lightbox.imageIndex}
          onClose={closeLightbox}
          onNext={() => navigateLightbox(1)}
          onPrev={() => navigateLightbox(-1)}
        />
      )}
    </div>
  );
}
