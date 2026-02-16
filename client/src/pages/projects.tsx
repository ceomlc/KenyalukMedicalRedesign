import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";

const BASE = "https://www.kenyalukmedicalfoundation.org/wp-content/themes/kenyalukmedicalie270/images";

interface ProjectSection {
  title: string;
  description?: string;
  images: { src: string; alt: string }[];
  pdfLink?: string;
}

const projects: ProjectSection[] = [
  {
    title: "Planning for the Construction of Kenyaluk Medical Center",
    description: "Our flagship project — a comprehensive medical center designed to serve the community with modern healthcare facilities.",
    pdfLink: "https://www.kenyalukmedicalfoundation.org/wp-content/themes/kenyalukmedicalie270/pdf/3-D-image-of-the-medical-center.pdf",
    images: [
      { src: `${BASE}/projects/mc-1.jpg`, alt: "3D medical center rendering" },
      { src: `${BASE}/projects/mc-2.jpg`, alt: "Medical center site visit" },
      { src: `${BASE}/projects/mc-3.jpg`, alt: "Medical center planning" },
      { src: `${BASE}/projects/mc-4.jpg`, alt: "Medical center construction site" },
      { src: `${BASE}/projects/mc-5.jpg`, alt: "Medical center exterior view" },
    ],
  },
  {
    title: "Community Engagement",
    description: "Building relationships and trust within the community through meetings, discussions, and collaborative planning.",
    images: [
      { src: `${BASE}/projects/cecc-1.jpg`, alt: "Community discussion" },
      { src: `${BASE}/projects/cecc-2.jpg`, alt: "Community meeting" },
      { src: `${BASE}/projects/cecc-3.jpg`, alt: "Community leaders meeting" },
      { src: `${BASE}/projects/cecc-4.jpg`, alt: "Community gathering" },
      { src: `${BASE}/projects/cecc-5.jpg`, alt: "Community demonstration" },
      { src: `${BASE}/projects/cecc-6.jpg`, alt: "Community collaboration" },
      { src: `${BASE}/projects/cecc-7.jpg`, alt: "Project blessing ceremony" },
      { src: `${BASE}/projects/cecc-8.jpg`, alt: "Community planning session" },
    ],
  },
  {
    title: "Materials for Kenyaluk Medical Center Construction",
    description: "Sourcing and preparing the materials needed for the construction of the medical center.",
    images: [
      { src: `${BASE}/projects/bfc-1.jpg`, alt: "Construction materials - rocks" },
      { src: `${BASE}/projects/bfc-2.jpg`, alt: "Gravel preparation area" },
      { src: `${BASE}/projects/bfc-3.jpg`, alt: "Different types of gravel" },
      { src: `${BASE}/projects/bfc-4.jpg`, alt: "Pile of construction rocks" },
    ],
  },
  {
    title: "Land Fencing",
    description: "Securing the project land with proper fencing to protect the site and prepare for construction.",
    images: Array.from({ length: 11 }, (_, i) => ({
      src: `${BASE}/projects/lf-${i + 1}.jpg`,
      alt: `Land fencing progress ${i + 1}`,
    })),
  },
  {
    title: "Tree Planting",
    description: "Environmental stewardship through tree planting on the project grounds, creating green spaces for the future medical center.",
    images: Array.from({ length: 16 }, (_, i) => ({
      src: `${BASE}/projects/tp-${i + 1}.jpg`,
      alt: `Tree planting activity ${i + 1}`,
    })),
  },
  {
    title: "Borehole Drilling and Water Tower",
    description: "Our borehole drilling and water tower projects have been completed, bringing clean water access to the community.",
    images: Array.from({ length: 37 }, (_, i) => ({
      src: `${BASE}/projects/wtp-${i + 1}.jpg`,
      alt: `Water tower project ${i + 1}`,
    })),
  },
  {
    title: "Sharing Water with the Community",
    description: "Extending the benefits of our water projects to serve the broader community's needs.",
    images: [],
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

export default function Projects() {
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
    const images = projects[lightbox.sectionIndex].images;
    const next = (lightbox.imageIndex + dir + images.length) % images.length;
    setLightbox({ ...lightbox, imageIndex: next });
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BASE}/Community.jpg)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h1
            className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6"
            data-testid="text-projects-heading"
          >
            Our Projects
          </h1>
          <p
            className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8"
            data-testid="text-projects-subtitle"
          >
            From constructing a medical center to drilling boreholes for clean water,
            see the impact your support makes on the ground in Kenya.
          </p>
          <Button variant="default" asChild data-testid="button-projects-donate">
            <Link href="/donate">
              <Heart className="h-4 w-4 mr-2 fill-current" />
              Support Our Projects
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-20">
          {projects.map((project, sIdx) => (
            <div key={sIdx} id={`project-${sIdx}`} className="scroll-mt-24">
              <div className="mb-8">
                <h2
                  className="font-headings font-bold text-2xl md:text-3xl mb-3"
                  data-testid={`text-project-title-${sIdx}`}
                >
                  {project.title}
                </h2>
                {project.description && (
                  <p className="text-muted-foreground max-w-3xl" data-testid={`text-project-desc-${sIdx}`}>
                    {project.description}
                  </p>
                )}
                {project.pdfLink && (
                  <a
                    href={project.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary font-medium hover:underline"
                    data-testid="link-3d-medical-center"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View 3D Medical Center Rendering (PDF)
                  </a>
                )}
              </div>

              {project.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {project.images.map((img, iIdx) => (
                    <Card
                      key={iIdx}
                      className="overflow-visible cursor-pointer group hover-elevate"
                      onClick={() => openLightbox(sIdx, iIdx)}
                      data-testid={`img-project-${sIdx}-${iIdx}`}
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
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground" data-testid="text-coming-soon">
                    Photos coming soon!
                  </p>
                </Card>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center space-y-6">
          <h2 className="font-headings font-bold text-2xl md:text-3xl" data-testid="text-projects-cta-title">
            Help Us Build a Healthier Future
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every contribution brings us closer to completing the Kenyaluk Medical Center and expanding our community programs. Join us in making quality healthcare accessible to all.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="default" asChild data-testid="button-projects-donate-bottom">
              <Link href="/donate">
                <Heart className="h-4 w-4 mr-2 fill-current" />
                Donate Now
              </Link>
            </Button>
            <Button variant="outline" asChild data-testid="button-projects-volunteer">
              <Link href="/volunteer">Volunteer With Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {lightbox && (
        <Lightbox
          images={projects[lightbox.sectionIndex].images}
          currentIndex={lightbox.imageIndex}
          onClose={closeLightbox}
          onNext={() => navigateLightbox(1)}
          onPrev={() => navigateLightbox(-1)}
        />
      )}
    </div>
  );
}
