import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import LocationSearch from "./LocationSearch";
import { MapPin } from "lucide-react";

interface CreateEventFormProps {
  onSuccess: () => void;
}

const CreateEventForm = ({ onSuccess }: CreateEventFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    image: "",
    lat: "",
    lng: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would send data to backend
    toast({
      title: "Event created!",
      description: "Your event has been successfully created.",
    });
    
    onSuccess();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Summer Music Festival"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <LocationSearch
          onLocationSelect={(location) => {
            setFormData({
              ...formData,
              location: location.name,
              lat: location.lat.toString(),
              lng: location.lng.toString(),
            });
          }}
          placeholder="Search for location..."
        />
        {formData.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <MapPin className="h-4 w-4" />
            <span>{formData.location}</span>
          </div>
        )}
        {formData.lat && formData.lng && (
          <div className="text-xs text-muted-foreground">
            Coordinates: {parseFloat(formData.lat).toFixed(6)}, {parseFloat(formData.lng).toFixed(6)}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your event..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-secondary to-primary">
          Create Event
        </Button>
      </div>
    </form>
  );
};

export default CreateEventForm;
