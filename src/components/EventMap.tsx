import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Calendar, MapPin, Heart, Check } from "lucide-react";
import { createRoot } from "react-dom/client";
import { Button } from "@/components/ui/button";
import LocationSearch from "./LocationSearch";

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
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Fallback to default location (Chabahil, Kathmandu)
          setUserLocation([27.7172, 85.3240]);
        }
      );
    } else {
      // Fallback to default location (Chabahil, Kathmandu)
      setUserLocation([27.7172, 85.3240]);
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

    // Create event markers with event images
    const createEventMarker = (event: Event) => {
      return L.divIcon({
        className: 'event-image-marker',
        html: `
          <div style="
            position: relative;
            width: 50px;
            height: 50px;
            cursor: pointer;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
          ">
            <div style="
              width: 100%;
              height: 100%;
              border-radius: 12px;
              overflow: hidden;
              border: 3px solid white;
              background: white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            ">
              <img 
                src="${event.image}" 
                alt="${event.title}"
                style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                "
              />
            </div>
            <div style="
              position: absolute;
              bottom: -8px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-top: 8px solid white;
              filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
            "></div>
          </div>
        `,
        iconSize: [50, 58],
        iconAnchor: [25, 58],
        popupAnchor: [0, -58],
      });
    };

    // Clear previous markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    // Add markers for each event with click-to-route functionality
    events.forEach((event) => {
      const eventIcon = createEventMarker(event);
      const marker = L.marker([event.lat, event.lng], { icon: eventIcon }).addTo(map);
      markersRef.current.push(marker);

      // Create popup content
      const popupContainer = document.createElement("div");
      popupContainer.className = "p-2";
      popupContainer.style.minWidth = "280px";

      const handleGetDirections = async (showInPopup = true) => {
        if (!userLocation) {
          alert("Please enable location services to get directions");
          return;
        }

        // Clear previous route
        if (routeLayerRef.current) {
          map.removeLayer(routeLayerRef.current);
        }

        try {
          // Using OSRM API (free, no API key needed, more reliable)
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${event.lng},${event.lat}?overview=full&geometries=geojson`
          );
          
          if (!response.ok) {
            throw new Error(`Routing failed: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.routes && data.routes[0]) {
            const coordinates = data.routes[0].geometry.coordinates;
            const latLngs = coordinates.map((coord: number[]) => [coord[1], coord[0]] as L.LatLngExpression);
            
            // Draw route on map with animation
            routeLayerRef.current = L.polyline(latLngs, {
              color: '#6366f1',
              weight: 5,
              opacity: 0.8,
              dashArray: '8, 12',
              lineCap: 'round',
            }).addTo(map);

            // Fit map to show entire route
            map.fitBounds(routeLayerRef.current.getBounds(), { padding: [80, 80] });

            // Show distance and duration
            const distance = (data.routes[0].distance / 1000).toFixed(1);
            const duration = Math.round(data.routes[0].duration / 60);
            
            if (showInPopup) {
              L.popup()
                .setLatLng([event.lat, event.lng])
                .setContent(`
                  <div style="padding: 12px; min-width: 200px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                      <div style="width: 40px; height: 40px; border-radius: 8px; overflow: hidden;">
                        <img src="${event.image}" alt="${event.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                      </div>
                      <b style="color: #6366f1; flex: 1;">${event.title}</b>
                    </div>
                    <div style="padding: 10px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 8px; border-left: 3px solid #6366f1;">
                      <div style="margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                        <span style="font-size: 16px;">📍</span>
                        <strong>Distance:</strong> ${distance} km
                      </div>
                      <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="font-size: 16px;">⏱️</span>
                        <strong>Duration:</strong> ${duration} mins
                      </div>
                      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #bae6fd; font-size: 11px; color: #0369a1;">
                        ✓ Optimal route via OSRM (A* algorithm)
                      </div>
                    </div>
                  </div>
                `)
                .openOn(map);
            }
          }
        } catch (error) {
          console.error("Error getting directions:", error);
          if (showInPopup) {
            L.popup()
              .setLatLng([event.lat, event.lng])
              .setContent(`
                <div style="padding: 12px; background: #fef2f2; border-radius: 8px; border-left: 3px solid #ef4444;">
                  <b style="color: #dc2626;">Route Calculation Failed</b>
                  <p style="margin: 8px 0 0 0; font-size: 12px; color: #991b1b;">
                    Unable to calculate route. Please check your internet connection and try again.
                  </p>
                </div>
              `)
              .openOn(map);
          }
        }
      };

      // Auto-show route when marker is clicked
      marker.on('click', () => {
        handleGetDirections(true);
      });

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
          <div className="bg-muted/50 p-2 rounded mb-3 text-xs">
            💡 <strong>Tip:</strong> Click on the marker to see route with distance & duration
          </div>
          <div className="flex gap-2 mb-2">
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
          {userLocation && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleGetDirections(true)}
              className="w-full gap-2"
            >
              <MapPin className="h-3 w-3" />
              Show Route (A* Algorithm)
            </Button>
          )}
        </>
      );

      const root = createRoot(popupContainer);
      root.render(<PopupContent />);

      marker.bindPopup(popupContainer, { maxWidth: 300 });
    });

    // Fit map to show all event markers and user location
    if (events.length > 0) {
      const bounds = L.latLngBounds([
        userLocation,
        ...events.map(event => [event.lat, event.lng] as L.LatLngExpression)
      ]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [userLocation, events, userInterests, onInterestToggle, onAttendedToggle]);

  const handleLocationSearch = async (location: { name: string; lat: number; lng: number }) => {
    if (!mapRef.current || !userLocation) return;

    // Clear previous route
    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
    }

    // Pan to location
    mapRef.current.setView([location.lat, location.lng], 14);
    
    // Add clickable temporary marker
    const tempIcon = L.divIcon({
      className: 'temp-location-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, #10b981, #059669);
          width: 28px;
          height: 28px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.5);
          cursor: pointer;
        ">
          <div style="
            position: absolute;
            top: 5px;
            left: 5px;
            background: white;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 28],
    });
    
    const tempMarker = L.marker([location.lat, location.lng], { icon: tempIcon })
      .addTo(mapRef.current)
      .bindPopup(`<b>${location.name}</b><br/><small>⏳ Calculating optimal route using A* algorithm...</small>`)
      .openPopup();

    // Auto-fetch and draw route from user location to searched location using OSRM
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${location.lng},${location.lat}?overview=full&geometries=geojson`
      );
      
      if (!response.ok) {
        throw new Error(`Routing failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const coordinates = data.routes[0].geometry.coordinates;
        const latLngs = coordinates.map((coord: number[]) => [coord[1], coord[0]] as L.LatLngExpression);
        
        // Draw route on map with animation
        routeLayerRef.current = L.polyline(latLngs, {
          color: '#10b981',
          weight: 5,
          opacity: 0.8,
          dashArray: '10, 15',
          lineCap: 'round',
        }).addTo(mapRef.current);

        // Fit map to show entire route
        mapRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [80, 80] });

        // Show distance and duration in popup
        const distance = (data.routes[0].distance / 1000).toFixed(1);
        const duration = Math.round(data.routes[0].duration / 60);
        
        tempMarker.setPopupContent(
          `<div style="padding: 12px; min-width: 220px;">
            <b style="color: #10b981; font-size: 14px;">${location.name}</b>
            <div style="margin-top: 10px; padding: 10px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 8px; border-left: 3px solid #10b981;">
              <div style="margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 16px;">📍</span>
                <strong>Distance:</strong> ${distance} km
              </div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 16px;">⏱️</span>
                <strong>Duration:</strong> ${duration} mins
              </div>
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #bbf7d0; font-size: 11px; color: #166534;">
                ✓ Best route via OSRM (A* algorithm)
              </div>
            </div>
            <div style="margin-top: 10px; padding: 6px; background: #eff6ff; border-radius: 4px; text-align: center; font-size: 11px; color: #1e40af;">
              💡 Click marker to recalculate route
            </div>
          </div>`
        );
      }
    } catch (error) {
      console.error("Error getting directions:", error);
      tempMarker.setPopupContent(
        `<div style="padding: 12px; background: #fef2f2; border-radius: 8px; border-left: 3px solid #ef4444;">
          <b style="color: #dc2626;">${location.name}</b>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #991b1b;">
            Unable to calculate route. Please check your connection and click marker to retry.
          </p>
        </div>`
      );
    }

    // Make marker re-clickable to recalculate route
    tempMarker.on('click', () => {
      handleLocationSearch(location);
    });
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-4 left-4 z-[1000] w-80">
        <LocationSearch
          userLocation={userLocation}
          onLocationSelect={handleLocationSearch}
          placeholder="Search location & get directions..."
          className="shadow-lg"
        />
      </div>
      
      <div 
        ref={containerRef} 
        style={{ height: "100%", width: "100%" }}
        className="rounded-xl overflow-hidden"
      />
    </div>
  );
};

export default EventMap;
