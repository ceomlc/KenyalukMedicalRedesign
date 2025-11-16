import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import type { Event } from "@shared/schema";
import { format } from "date-fns";

export default function Events() {
  const [filterProgram, setFilterProgram] = useState<string>("all");
  
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", { program: filterProgram !== "all" ? filterProgram : undefined }],
  });

  const programs = [
    { value: "all", label: "All Programs" },
    { value: "health_advancement", label: "Health Advancement" },
    { value: "medical_aid_outreach", label: "Medical Aid Outreach" },
    { value: "healthcare_professional_empowerment", label: "Healthcare Professional Empowerment" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <Calendar className="h-16 w-16 text-primary mx-auto mb-6" />
          <h1 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
            Upcoming Events
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Join us in making a difference. Register for upcoming medical missions, health workshops, and community events.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-8 bg-background border-b sticky top-16 md:top-20 z-40 backdrop-blur-sm bg-background/95">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h2 className="font-semibold text-lg">Filter Events</h2>
            <Select value={filterProgram} onValueChange={setFilterProgram}>
              <SelectTrigger className="w-full sm:w-[280px]" data-testid="select-program-filter">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.value} value={program.value}>
                    {program.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted" />
                  <CardContent className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-10 bg-muted rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="hover-elevate active-elevate-2 transition-all overflow-hidden"
                  data-testid={`event-card-${event.id}`}
                >
                  {event.imageUrl && (
                    <div className="relative aspect-[4/3]">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.program && (
                        <Badge className="absolute top-3 right-3">
                          {event.program.replace(/_/g, " ")}
                        </Badge>
                      )}
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(event.date), "PPP")}</span>
                    </div>
                    
                    <h3 className="font-headings font-semibold text-xl mb-3">
                      {event.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>

                    {event.maxAttendees && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Users className="h-4 w-4" />
                        <span>
                          {event.currentAttendees || 0} / {event.maxAttendees} registered
                        </span>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      asChild
                      data-testid={`button-register-${event.id}`}
                    >
                      <Link href={`/events/${event.id}/register`}>
                        <a className="inline-flex items-center justify-center">
                          Register Now
                          {event.registrationFee && event.registrationFee !== "0" && (
                            <span className="ml-2">
                              (${event.registrationFee})
                            </span>
                          )}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-xl mb-2">No Events Found</h3>
              <p className="text-muted-foreground">
                {filterProgram !== "all"
                  ? "Try changing your filter selection"
                  : "Check back soon for upcoming events"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
