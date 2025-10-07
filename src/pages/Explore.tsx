import { useState } from "react";
import Navigation from "@/components/Navigation";
import EventCard from "@/components/EventCard";
import EventMap from "@/components/EventMap";
import { Button } from "@/components/ui/button";
import { MapPin, Grid3x3 } from "lucide-react";

const mockEvents = [
  {
    id: 1,
    title: "Summer Music Festival",
    date: "2025-10-15",
    time: "18:00",
    location: "Central Park",
    description: "Join us for an amazing evening of live music featuring local artists.",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    lat: 40.785091,
    lng: -73.968285,
    attendees: 245,
    interested: 892,
  },
  {
    id: 2,
    title: "Food & Wine Tasting",
    date: "2025-10-18",
    time: "19:30",
    location: "Downtown Plaza",
    description: "Experience culinary delights from renowned local chefs.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    lat: 40.758896,
    lng: -73.985130,
    attendees: 128,
    interested: 456,
  },
  {
    id: 3,
    title: "Yoga in the Park",
    date: "2025-10-12",
    time: "08:00",
    location: "Riverside Park",
    description: "Start your day with mindful movement and meditation.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
    lat: 40.802080,
    lng: -73.971249,
    attendees: 67,
    interested: 234,
  },
  {
    id: 4,
    title: "Tech Startup Meetup",
    date: "2025-10-20",
    time: "18:30",
    location: "Innovation Hub",
    description: "Network with entrepreneurs and innovators in tech.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    lat: 40.748817,
    lng: -73.985428,
    attendees: 189,
    interested: 567,
  },
  {
    id: 5,
    title: "Art Gallery Opening",
    date: "2025-10-22",
    time: "19:00",
    location: "Modern Art Museum",
    description: "Celebrate contemporary art and meet the artists.",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
    lat: 40.761421,
    lng: -73.977622,
    attendees: 156,
    interested: 423,
  },
  {
    id: 6,
    title: "Marathon Training",
    date: "2025-10-14",
    time: "06:00",
    location: "City Stadium",
    description: "Group training session for upcoming city marathon.",
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80",
    lat: 40.771209,
    lng: -73.963937,
    attendees: 93,
    interested: 312,
  },
];

const Explore = () => {
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [userInterests, setUserInterests] = useState<Record<number, "interested" | "attended" | null>>({});

  const handleInterestToggle = (eventId: number) => {
    setUserInterests((prev) => ({
      ...prev,
      [eventId]: prev[eventId] === "interested" ? null : "interested",
    }));
  };

  const handleAttendedToggle = (eventId: number) => {
    setUserInterests((prev) => ({
      ...prev,
      [eventId]: prev[eventId] === "attended" ? null : "attended",
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Explore Events
            </h1>
            <p className="text-muted-foreground">Discover amazing events near you</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="gap-2"
            >
              <Grid3x3 className="h-4 w-4" />
              Grid
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("map")}
              className="gap-2"
            >
              <MapPin className="h-4 w-4" />
              Map
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                userStatus={userInterests[event.id]}
                onInterestToggle={() => handleInterestToggle(event.id)}
                onAttendedToggle={() => handleAttendedToggle(event.id)}
              />
            ))}
          </div>
        ) : (
          <div className="h-[calc(100vh-250px)] rounded-xl overflow-hidden shadow-xl">
            <EventMap 
              events={mockEvents}
              userInterests={userInterests}
              onInterestToggle={handleInterestToggle}
              onAttendedToggle={handleAttendedToggle}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;
