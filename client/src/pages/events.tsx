import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Users, ArrowRight, DollarSign, Heart, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import type { Event } from "@shared/schema";
import { format } from "date-fns";

const UPLOADS = "https://www.kenyalukmedicalfoundation.org/wp-content/uploads";
const constructionPhotos = [
  { src: `${UPLOADS}/2025/08/IMG_1.jpg`, alt: "Small house under construction" },
  { src: `${UPLOADS}/2025/08/IMG_2.jpg`, alt: "A larger house being built" },
  { src: `${UPLOADS}/2025/08/IMG_3.jpg`, alt: "A house with a slanted roof and a ladder" },
  { src: `${UPLOADS}/2025/08/IMG_4.jpg`, alt: "Two men standing inside a room under construction" },
  { src: `${UPLOADS}/2025/08/IMG_5.jpg`, alt: "A wide view of several connected houses with a red roof" },
  { src: `${UPLOADS}/2025/08/IMG_6.jpg`, alt: "Unfinished interior with exposed framing and construction" },
  { src: `${UPLOADS}/2024/08/PIC_8382-1024x684.jpg`, alt: "Construction progress photo" },
  { src: `${UPLOADS}/2024/08/PIC_8288-1024x684.jpg`, alt: "Building site overview" },
  { src: `${UPLOADS}/2024/08/PIC_8342-1024x684.jpg`, alt: "Medical center construction" },
  { src: `${UPLOADS}/2024/08/PIC_8217-1024x675.jpg`, alt: "Foundation work" },
  { src: `${UPLOADS}/2024/08/PIC_8379-1024x684.jpg`, alt: "Construction team at work" },
  { src: `${UPLOADS}/2024/08/PIC_8208-1024x684.jpg`, alt: "Building progress" },
];

const pastEventPhotos = [
  { src: `${UPLOADS}/2024/08/PHOTO-2024-07-05-22-05-19-4-1024x576.jpg`, alt: "Past fundraiser event" },
  { src: `${UPLOADS}/2024/08/PHOTO-2024-07-05-22-05-19-2-1024x576.jpg`, alt: "Past fundraiser event" },
  { src: `${UPLOADS}/2024/08/PHOTO-2024-07-05-22-05-20-4-1024x576.jpg`, alt: "Past fundraiser event" },
  { src: `${UPLOADS}/2024/08/PHOTO-2024-07-05-22-05-20-2-1024x576.jpg`, alt: "Past fundraiser event" },
  { src: `${UPLOADS}/2024/08/PHOTO-2024-07-05-22-05-20-3-1024x576.jpg`, alt: "Past fundraiser event" },
  { src: `${UPLOADS}/2024/08/PHOTO-2024-07-05-22-05-19-3-1024x576.jpg`, alt: "Past fundraiser event" },
  { src: `${UPLOADS}/2024/08/PHOTO-2024-07-05-22-05-19-1024x576.jpg`, alt: "Past fundraiser event" },
  { src: `${UPLOADS}/2024/08/PHOTO-2024-07-05-22-05-20-1024x576.jpg`, alt: "Past fundraiser event" },
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
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        data-testid="button-lightbox-prev"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        data-testid="button-lightbox-next"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
      <img
        src={images[currentIndex].src}
        alt={images[currentIndex].alt}
        className="max-h-[85vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
        data-testid="lightbox-image"
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

function PhotoGrid({ photos, gridId }: { photos: { src: string; alt: string }[]; gridId: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] overflow-hidden rounded-md cursor-pointer group"
            onClick={() => setLightboxIndex(i)}
            data-testid={`${gridId}-photo-${i}`}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          images={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % photos.length)}
          onPrev={() => setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)}
        />
      )}
    </>
  );
}

export default function Events() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
    queryFn: async () => {
      const res = await fetch("/api/events", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={`${UPLOADS}/2024/08/PIC_9066-scaled-e1723598413140.jpg`}
            alt="Events hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h1 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 tracking-tight text-white">
            Events
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
            Join us for community events, fundraisers, and medical missions that make a real difference.
          </p>
        </div>
      </section>

      {/* Admin-Created Events (Dynamic from Dashboard) */}
      {isLoading ? (
        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-8">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse overflow-hidden">
                <CardContent className="p-8 space-y-4">
                  <div className="h-8 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="aspect-[3/4] max-w-md mx-auto bg-muted rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : events && events.length > 0 ? (
        <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-16">
            {events.map((event) => {
              const attendancePercentage = event.maxAttendees
                ? ((event.currentAttendees || 0) / event.maxAttendees) * 100
                : 0;
              const isFull = event.maxAttendees && (event.currentAttendees || 0) >= event.maxAttendees;

              return (
                <div
                  key={event.id}
                  className="text-center space-y-6"
                  data-testid={`event-section-${event.id}`}
                >
                  <h2 className="font-headings font-bold text-2xl md:text-3xl lg:text-4xl uppercase tracking-wide">
                    {event.title}
                  </h2>

                  {event.description && (
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-2">
                    <p className="text-lg font-semibold flex items-center justify-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      {format(new Date(event.date), "EEEE, MMMM d, yyyy")}
                    </p>
                    {event.location && (
                      <p className="text-lg text-muted-foreground flex items-center justify-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {event.location}
                      </p>
                    )}
                    {event.registrationFee && event.registrationFee !== "0" && (
                      <p className="text-lg font-medium flex items-center justify-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        ${event.registrationFee} registration fee
                      </p>
                    )}
                  </div>

                  {event.maxAttendees && (
                    <div className="max-w-sm mx-auto space-y-2">
                      <div className="flex items-center justify-between gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">
                            {event.currentAttendees || 0} / {event.maxAttendees} registered
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {attendancePercentage.toFixed(0)}% full
                        </span>
                      </div>
                      <Progress value={attendancePercentage} className="h-2" />
                    </div>
                  )}

                  {event.imageUrl && (
                    <div className="max-w-lg mx-auto">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full rounded-md shadow-lg"
                        data-testid={`event-image-${event.id}`}
                      />
                    </div>
                  )}

                  <div>
                    <Button
                      size="lg"
                      className="text-lg px-8"
                      disabled={!!isFull}
                      asChild={!isFull}
                      data-testid={`button-register-${event.id}`}
                    >
                      {isFull ? (
                        <span>Event Full</span>
                      ) : (
                        <Link href={`/events/${event.id}/register`}>
                          Register Now
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      )}
                    </Button>
                  </div>

                  <div className="border-b pt-8" />
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Purchase Ticket Section */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center space-y-8">
          <h2 className="font-headings font-bold text-2xl md:text-3xl lg:text-4xl">
            Purchase Your Ticket Here
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <Card>
              <CardContent className="p-6 md:p-8 space-y-4 text-center">
                <h3 className="font-headings font-bold text-xl">Pay via Zelle</h3>
                <p className="text-muted-foreground">Send payment to:</p>
                <p className="font-semibold text-lg break-all">
                  kenyalukmedicalfoundation@gmail.com
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 md:p-8 space-y-4 text-center">
                <h3 className="font-headings font-bold text-xl">Pay via Venmo</h3>
                <p className="text-muted-foreground">Send payment to:</p>
                <a
                  href="https://venmo.com/code?user_id=4315769911380012780&created=1755487603.5507011&printed=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-lg text-primary hover:underline"
                  data-testid="link-venmo"
                >
                  @Kenyaluk
                </a>
              </CardContent>
            </Card>
          </div>

          <p className="text-muted-foreground">
            Or make a donation online through our secure payment system.
          </p>
          <Button size="lg" asChild data-testid="button-donate-events">
            <Link href="/donate">
              Make Your Donation Here
              <Heart className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Partner With Us Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="font-headings font-bold text-2xl md:text-3xl lg:text-4xl">
              Partner With Us
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              If you are unable to attend our annual dinner and fundraiser, please consider making a donation to help us complete construction on this very needed facility.
            </p>
          </div>

          <PhotoGrid photos={constructionPhotos} gridId="construction" />

          <div className="text-center">
            <Button size="lg" asChild data-testid="button-donate-partner">
              <Link href="/donate">
                Make Your Donation Here
                <Heart className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="border-b" />
      </div>

      {/* Sponsor Information Section */}
      <section className="py-16 md:py-20 bg-muted/20">
        <div className="max-w-3xl mx-auto px-4 md:px-6 text-center space-y-6">
          <h2 className="font-headings font-bold text-2xl md:text-3xl lg:text-4xl">
            Sponsor Information
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your sponsorship allows us to provide excellent and passionate speakers, a lively and memorable evening. Our sponsorship opportunities offer businesses and organizations a chance to align with a cause that matters. Explore sponsorship options and become a valued partner in our mission when you{" "}
            <Link href="/contact" className="text-primary hover:underline font-medium" data-testid="link-contact-sponsor">
              contact us
            </Link>.
          </p>

          <Button size="lg" asChild data-testid="button-become-sponsor">
            <Link href="/sponsor">
              Become A Kenyaluk Foundation Sponsor
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <p className="text-muted-foreground leading-relaxed">
            If you'd like to speak directly with someone and become a Kenyaluk Foundation sponsor and partner, please contact Wilfred Kandie at{" "}
            <a href="tel:240-413-1321" className="text-primary hover:underline font-medium" data-testid="link-phone-sponsor">
              240-413-1321
            </a>{" "}
            or send an email to:{" "}
            <a href="mailto:kenyalukmedicalfoundation@gmail.com" className="text-primary hover:underline font-medium" data-testid="link-email-sponsor">
              kenyalukmedicalfoundation@gmail.com
            </a>
          </p>

          <p className="text-lg font-medium italic">
            Your sponsorship is very much appreciated.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="border-b" />
      </div>

      {/* Past Events Gallery */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-8">
          <h2 className="font-headings font-bold text-2xl md:text-3xl lg:text-4xl text-center">
            Past Annual Dinner & Fundraiser Events
          </h2>

          <PhotoGrid photos={pastEventPhotos} gridId="past-events" />
        </div>
      </section>
    </div>
  );
}
