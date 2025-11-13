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
}

const LocationSearch = ({ onLocationSelect, placeholder = "Search location...", className }: LocationSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();
  const searchRef = useRef<HTMLDivElement>(null);

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
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );
        const data = await response.json();
        setResults(data);
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
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.place_id}
              type="button"
              onClick={() => handleSelectLocation(result)}
              className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-start gap-2 border-b last:border-b-0"
            >
              <MapPin className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
              <span className="text-sm">{result.display_name}</span>
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
