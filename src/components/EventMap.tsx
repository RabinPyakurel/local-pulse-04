import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Calendar, MapPin, Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in production
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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
  const defaultCenter: [number, number] = [40.7589, -73.9851];

  useEffect(() => {
    // Ensure Leaflet is properly initialized
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer
      {...{ 
        center: defaultCenter, 
        zoom: 12, 
        scrollWheelZoom: true,
        style: { height: "100%", width: "100%", zIndex: 0 },
        className: "rounded-xl"
      } as any}
    >
      <TileLayer 
        {...{ 
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        } as any} 
      />
      
      {events.map((event) => (
        <Marker 
          key={event.id} 
          {...{ 
            position: [event.lat, event.lng],
            icon: icon
          } as any}
        >
          <Popup {...{ maxWidth: 300 } as any}>
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
