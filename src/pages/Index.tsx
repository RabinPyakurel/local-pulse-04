import Navigation from "@/components/Navigation";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Calendar, Users, Sparkles } from "lucide-react";
import { useState } from "react";

const featuredEvents = [
  {
    id: 1,
    title: "Summer Music Festival",
    date: "2025-10-15",
    time: "18:00",
    location: "Central Park",
    description: "Join us for an amazing evening of live music featuring local artists.",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    attendees: 245,
    interested: 892,
    organizer: "Music Lovers Group",
  },
  {
    id: 2,
    title: "Food & Wine Tasting",
    date: "2025-10-18",
    time: "19:30",
    location: "Downtown Plaza",
    description: "Experience culinary delights from renowned local chefs.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    attendees: 128,
    interested: 456,
    organizer: "Foodie Community",
  },
  {
    id: 3,
    title: "Tech Startup Meetup",
    date: "2025-10-20",
    time: "18:30",
    location: "Innovation Hub",
    description: "Network with entrepreneurs and innovators in tech.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    attendees: 189,
    interested: 567,
    organizer: "Tech Innovators",
  },
];

const Index = () => {
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              The people platform. <br />
              Where interests become friendships.
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it. Events are happening every day—sign up to join the fun.
            </p>
            
            <Link to="/explore">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full px-8 h-12">
                Join Local event finder
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Events near you</h2>
            <Link to="/explore">
              <Button variant="ghost" className="text-primary hover:text-primary/90">
                See all events
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                userStatus={userInterests[event.id]}
                onInterestToggle={() => handleInterestToggle(event.id)}
                onAttendedToggle={() => handleAttendedToggle(event.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-12 text-center border border-border">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Host Your Own Event?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Share your passion with the community. Create and manage events effortlessly.
            </p>
            <Button size="lg" className="gap-2 shadow-lg">
              Create Event
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
