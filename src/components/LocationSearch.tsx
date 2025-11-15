import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationSearchProps {
  onLocationSelect: (location: { name: string; lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
  userLocation?: [number, number] | null;
}

const LocationSearch = ({ onLocationSelect, placeholder = "Search location...", className, userLocation }: LocationSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const searchRef = useRef<HTMLDivElement>(null);

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        // Build search URL with user location if available for better results
        let searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10`;
        
        if (userLocation) {
          searchUrl += `&viewbox=${userLocation[1]-0.5},${userLocation[0]+0.5},${userLocation[1]+0.5},${userLocation[0]-0.5}&bounded=0`;
        }
        
        const response = await fetch(searchUrl);
        const data = await response.json();
        
        // Sort results by distance if user location is available
        let sortedData = data;
        if (userLocation && data.length > 0) {
          sortedData = data
            .map((result: LocationResult) => ({
              ...result,
              distance: calculateDistance(
                userLocation[0],
                userLocation[1],
                parseFloat(result.lat),
                parseFloat(result.lon)
              )
            }))
            .sort((a: any, b: any) => a.distance - b.distance)
            .slice(0, 5);
        }
        
        setResults(sortedData);
        setShowResults(true);
      } catch (error) {
        console.error("Error searching location:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleSelectLocation = (result: LocationResult) => {
    setQuery(result.display_name);
    setShowResults(false);
    onLocationSelect({
      name: result.display_name,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    });
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {results.map((result: any) => (
            <button
              key={result.place_id}
              type="button"
              onClick={() => handleSelectLocation(result)}
              className="w-full px-4 py-3 text-left hover:bg-accent transition-all border-b last:border-b-0 hover:shadow-sm group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-foreground mb-0.5 truncate">
                    {result.display_name.split(',')[0]}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1 mb-1.5">
                    {result.display_name}
                  </div>
                  {result.distance && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full">
                      <span className="text-xs font-medium text-primary">
                        📍 {result.distance < 1 
                          ? `${(result.distance * 1000).toFixed(0)}m away`
                          : `${result.distance.toFixed(1)}km away`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg p-4 text-center text-sm text-muted-foreground">
          Searching...
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
