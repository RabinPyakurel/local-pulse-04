import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import { Calendar, MapPin, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  lat: number;
  lng: number;
  attendees: number;
  interested: number;
}

interface EventMapProps {
  events: Event[];
  userInterests: Record<number, "interested" | "attended" | null>;
  onInterestToggle: (eventId: number) => void;
  onAttendedToggle: (eventId: number) => void;
}

const EventMap = ({ events, userInterests, onInterestToggle, onAttendedToggle }: EventMapProps) => {
  const defaultCenter: LatLngExpression = [40.7589, -73.9851];

  return (
    <MapContainer
      {...{ center: defaultCenter, zoom: 12, scrollWheelZoom: true } as any}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer {...{ url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" } as any} />
      
      {events.map((event) => (
        <Marker key={event.id} {...{ position: [event.lat, event.lng] } as any}>
          <Popup>
            <div className="p-2">
              <img src={event.image} alt={event.title} className="w-full h-32 object-cover rounded-lg mb-3" />
              <h3 className="font-bold text-lg mb-2">{event.title}</h3>
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>
              <p className="text-sm mb-3 line-clamp-2">{event.description}</p>
              <div className="flex gap-2">
                <Button
                  variant={userInterests[event.id] === "interested" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onInterestToggle(event.id)}
                  className="flex-1 gap-1"
                >
                  <Heart className={`h-3 w-3 ${userInterests[event.id] === "interested" ? "fill-current" : ""}`} />
                  Interested
                </Button>
                <Button
                  variant={userInterests[event.id] === "attended" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onAttendedToggle(event.id)}
                  className="flex-1 gap-1"
                >
                  <Check className="h-3 w-3" />
                  Attended
                </Button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default EventMap;
