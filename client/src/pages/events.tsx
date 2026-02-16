import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Users, ArrowRight, Clock, DollarSign } from "lucide-react";
import { Link } from "wouter";
import type { Event } from "@shared/schema";
import { format } from "date-fns";

export default function Events() {
  const [filterProgram, setFilterProgram] = useState<string>("all");
  
  const eventsUrl = filterProgram !== "all"
    ? `/api/events?program=${filterProgram}`
    : "/api/events";

  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events", filterProgram],
    queryFn: async () => {
      const res = await fetch(eventsUrl, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });

  const programs = [
    { value: "all", label: "All Programs" },
    { value: "health_advancement", label: "Health Advancement" },
    { value: "medical_aid_outreach", label: "Medical Aid Outreach" },
    { value: "healthcare_professional_empowerment", label: "Healthcare Professional Empowerment" },
  ];

  const programColors: Record<string, { badge: string; text: string }> = {
    health_advancement: { badge: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300", text: "text-pink-600 dark:text-pink-400" },
    medical_aid_outreach: { badge: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300", text: "text-blue-600 dark:text-blue-400" },
    healthcare_professional_empowerment: { badge: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300", text: "text-purple-600 dark:text-purple-400" },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(var(--primary-rgb,0,0,0),0.1),transparent_50%)]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 mb-6">
            <Calendar className="h-12 w-12 text-primary" />
          </div>
          
          <h1 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 tracking-tight">
            Upcoming Events
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Join us in making a difference. Register for upcoming medical missions, health workshops, and community events.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-0 z-40 py-6 bg-background/95 backdrop-blur-lg border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-base md:text-lg">Filter Events:</span>
              {filterProgram !== "all" && (
                <Badge variant="secondary" className="hidden sm:inline-flex">
                  {events?.length || 0} {events?.length === 1 ? 'event' : 'events'} found
                </Badge>
              )}
            </div>
            
            <Select value={filterProgram} onValueChange={setFilterProgram}>
              <SelectTrigger className="w-full sm:w-[320px]" data-testid="select-program-filter">
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
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse overflow-hidden">
                  <div className="aspect-[4/3] bg-muted" />
                  <CardContent className="p-6 space-y-4">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-10 bg-muted rounded w-full mt-4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {events.map((event, index) => {
                const attendancePercentage = event.maxAttendees 
                  ? ((event.currentAttendees || 0) / event.maxAttendees) * 100
                  : 0;
                const isFull = event.maxAttendees && (event.currentAttendees || 0) >= event.maxAttendees;
                const programColor = event.program ? programColors[event.program] : undefined;

                return (
                  <Card
                    key={event.id}
                    className="group hover-elevate active-elevate-2 transition-all duration-300 overflow-hidden border-2 animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 100}ms`, animationDuration: '700ms' }}
                    data-testid={`event-card-${event.id}`}
                  >
                    {/* Event Image with Overlay */}
                    {event.imageUrl && (
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        
                        {/* Program Badge */}
                        {event.program && programColor && (
                          <Badge className={`absolute top-4 right-4 ${programColor.badge} border-0 shadow-lg`}>
                            {event.program.replace(/_/g, " ")}
                          </Badge>
                        )}
                        
                        {/* Full Badge */}
                        {isFull && (
                          <Badge className="absolute top-4 left-4 bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-0 shadow-lg">
                            Fully Booked
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <CardContent className="p-6 md:p-7">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm font-medium text-primary mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(event.date), "PPP")}</span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-headings font-bold text-xl md:text-2xl mb-3 leading-tight group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                      
                      {/* Event Details */}
                      <div className="space-y-3 mb-5">
                        {/* Location */}
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>

                        {/* Registration Count with Progress */}
                        {event.maxAttendees && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span className="font-medium">
                                  {event.currentAttendees || 0} / {event.maxAttendees}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {attendancePercentage.toFixed(0)}% full
                              </span>
                            </div>
                            <Progress value={attendancePercentage} className="h-1.5" />
                          </div>
                        )}

                        {/* Registration Fee */}
                        {event.registrationFee && event.registrationFee !== "0" && (
                          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span>${event.registrationFee} registration fee</span>
                          </div>
                        )}
                      </div>

                      {/* CTA Button */}
                      <Button
                        className="w-full group/btn"
                        size="lg"
                        disabled={isFull}
                        asChild={!isFull}
                        data-testid={`button-register-${event.id}`}
                      >
                        {isFull ? (
                          <span>Event Full</span>
                        ) : (
                          <Link href={`/events/${event.id}/register`}>
                            Register Now
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                          </Link>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 animate-in fade-in duration-700">
              <div className="inline-flex items-center justify-center p-6 rounded-full bg-muted mb-6">
                <Calendar className="h-16 w-16 text-muted-foreground" />
              </div>
              <h3 className="font-headings font-bold text-2xl md:text-3xl mb-3">No Events Found</h3>
              <p className="text-lg text-muted-foreground max-w-md mx-auto mb-6">
                {filterProgram !== "all"
                  ? "Try changing your filter selection to see more events"
                  : "Check back soon for upcoming events and opportunities"}
              </p>
              {filterProgram !== "all" && (
                <Button 
                  variant="outline" 
                  onClick={() => setFilterProgram("all")}
                  data-testid="button-clear-filter"
                >
                  Clear Filter
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
