import { Calendar, MapPin, Users, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    image: string;
    attendees: number;
    interested: number;
  };
  userStatus?: "interested" | "attended" | null;
  onInterestToggle: () => void;
  onAttendedToggle: () => void;
}

const EventCard = ({ event, userStatus, onInterestToggle, onAttendedToggle }: EventCardProps) => {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  return (
    <Card className="group overflow-hidden hover:shadow-hover transition-all duration-300 border-0 bg-card">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge 
            variant={isUpcoming ? "default" : "secondary"}
            className="bg-card/90 backdrop-blur-sm"
          >
            {isUpcoming ? "Upcoming" : "Past"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-accent" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{event.attendees} attending</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{event.interested} interested</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant={userStatus === "interested" ? "default" : "outline"}
            size="sm"
            onClick={onInterestToggle}
            className="flex-1 gap-2"
          >
            <Heart className={`h-4 w-4 ${userStatus === "interested" ? "fill-current" : ""}`} />
            Interested
          </Button>
          
          <Button
            variant={userStatus === "attended" ? "default" : "outline"}
            size="sm"
            onClick={onAttendedToggle}
            className="flex-1 gap-2"
          >
            <Check className="h-4 w-4" />
            Attended
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
