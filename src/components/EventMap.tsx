import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Calendar, MapPin, Heart, Check } from "lucide-react";
import { createRoot } from "react-dom/client";
import { Button } from "@/components/ui/button";

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
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Fallback to default location (New York)
          setUserLocation([40.7589, -73.9851]);
        }
      );
    } else {
      // Fallback to default location
      setUserLocation([40.7589, -73.9851]);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !userLocation) return;

    // Initialize map with user's location
    const map = L.map(containerRef.current).setView(userLocation, 12);
    mapRef.current = map;

    // Add tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add user location marker
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: '<div style="background: #6366f1; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(99, 102, 241, 0.5);"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    L.marker(userLocation, { icon: userIcon })
      .addTo(map)
      .bindPopup("<b>Your Location</b>");

    // Custom icon for events
    const customIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Add markers for each event
    events.forEach((event) => {
      const marker = L.marker([event.lat, event.lng], { icon: customIcon }).addTo(map);

      // Create popup content
      const popupContainer = document.createElement("div");
      popupContainer.className = "p-2";
      popupContainer.style.minWidth = "280px";

      const PopupContent = () => (
        <>
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-32 object-cover rounded-lg mb-3" 
          />
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
              <Heart 
                className={`h-3 w-3 ${
                  userInterests[event.id] === "interested" ? "fill-current" : ""
                }`} 
              />
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
        </>
      );

      const root = createRoot(popupContainer);
      root.render(<PopupContent />);

      marker.bindPopup(popupContainer, { maxWidth: 300 });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [userLocation, events, userInterests, onInterestToggle, onAttendedToggle]);

  return (
    <div 
      ref={containerRef} 
      style={{ height: "100%", width: "100%" }}
      className="rounded-xl overflow-hidden"
    />
  );
};

export default EventMap;
