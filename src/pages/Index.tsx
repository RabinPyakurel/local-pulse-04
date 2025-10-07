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
    <div className="min-h-screen bg-gradient-to-b from-background via-muted to-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9ImhzbCgyNDAgMTAlIDkwJSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Discover Amazing Events Near You</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Connect Through
              </span>
              <br />
              Local Events
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Find, attend, and create memorable experiences in your community. 
              From music festivals to tech meetups, discover events that match your interests.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link to="/explore">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg">
                  Explore Events
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2">
                <MapPin className="h-5 w-5" />
                View Map
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
            {[
              { icon: Calendar, label: "Events", value: "500+" },
              { icon: Users, label: "Community", value: "10K+" },
              { icon: MapPin, label: "Locations", value: "50+" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="bg-card rounded-2xl p-6 text-center border border-border hover:shadow-hover transition-all duration-300 animate-in fade-in slide-in-from-bottom-12 delay-500"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Featured Events</h2>
              <p className="text-muted-foreground">Don't miss out on these amazing experiences</p>
            </div>
            <Link to="/explore">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
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
          <div className="bg-gradient-to-r from-primary via-accent to-secondary rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJkb3RzIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjIiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZG90cykiLz48L3N2Zz4=')] opacity-30" />
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">Ready to Host Your Own Event?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
                Share your passion with the community. Create and manage events effortlessly.
              </p>
              <Button size="lg" variant="secondary" className="gap-2 shadow-lg">
                Create Event
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
