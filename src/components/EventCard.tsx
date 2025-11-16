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
    organizer?: string;
  };
  userStatus?: "interested" | "attended" | null;
  onInterestToggle: () => void;
  onAttendedToggle: () => void;
}

const EventCard = ({ event, userStatus, onInterestToggle, onAttendedToggle }: EventCardProps) => {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();

  return (
    <Card className="group overflow-hidden hover:shadow-hover transition-all duration-200 border border-border bg-card rounded-lg">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-white text-foreground border-0 shadow-sm font-medium px-2.5 py-1">
            Free
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="text-xs text-muted-foreground mb-2 font-medium">
          {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {event.time}
        </div>
        
        <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        
        {event.organizer && (
          <p className="text-xs text-muted-foreground mb-3">
            by {event.organizer}
          </p>
        )}

        <div className="flex items-center gap-2 mb-3">
          <div className="flex -space-x-2">
            {[...Array(Math.min(3, event.attendees))].map((_, i) => (
              <div 
                key={i}
                className="h-6 w-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-medium"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {event.attendees} attendees
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant={userStatus === "interested" ? "default" : "outline"}
            size="sm"
            onClick={onInterestToggle}
            className="flex-1 text-xs h-8"
          >
            <Heart className={`h-3 w-3 mr-1 ${userStatus === "interested" ? "fill-current" : ""}`} />
            Interested
          </Button>
          
          <Button
            variant={userStatus === "attended" ? "default" : "outline"}
            size="sm"
            onClick={onAttendedToggle}
            className="flex-1 text-xs h-8"
          >
            <Check className="h-3 w-3 mr-1" />
            Attended
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
