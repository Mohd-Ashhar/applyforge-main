import React, { useState, useEffect } from "react";
import { MapPin, X } from "lucide-react";

const GeoapifyLocationInput = ({
  onLocationsChange,
  placeholder = "Search locations...",
  maxSelections = 10,
}) => {
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  // Debounced search function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2) {
        searchPlaces(searchQuery);
      } else {
        setSuggestions([]);
        setIsDropdownOpen(false);
      }
    }, 300); // 300ms debounce to reduce API calls

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const searchPlaces = async (query) => {
    if (!API_KEY) {
      console.error("Geoapify API key not found");
      return;
    }

    setIsLoading(true);
    setIsDropdownOpen(true);

    try {
      // Geoapify Autocomplete API endpoint
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        query
      )}&limit=5&apiKey=${API_KEY}`;

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.features || []);
      } else {
        console.error("Geoapify API error:", response.statusText);
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error searching places:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (feature) => {
    const locationData = {
      id: feature.properties.place_id || Math.random().toString(36),
      name: feature.properties.formatted,
      address: feature.properties.formatted,
      coordinates: feature.geometry.coordinates,
      city: feature.properties.city,
      state: feature.properties.state,
      country: feature.properties.country,
    };

    // Check for duplicates
    if (!selectedLocations.some((loc) => loc.name === locationData.name)) {
      const newLocations = [...selectedLocations, locationData];
      setSelectedLocations(newLocations);
      onLocationsChange(newLocations);
    }

    setSearchQuery("");
    setIsDropdownOpen(false);
    setSuggestions([]);
  };

  const removeLocation = (locationId) => {
    const newLocations = selectedLocations.filter(
      (loc) => loc.id !== locationId
    );
    setSelectedLocations(newLocations);
    onLocationsChange(newLocations);
  };

  return (
    <div className="w-full relative">
      {/* Search Input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsDropdownOpen(true);
          }}
          onBlur={() => {
            // Delay closing to allow selection
            setTimeout(() => setIsDropdownOpen(false), 200);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent mt-1"
          disabled={selectedLocations.length >= maxSelections}
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isDropdownOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.properties.place_id || index}
              onMouseDown={() => handleLocationSelect(suggestion)}
              className="px-4 py-2 hover:bg-accent cursor-pointer flex items-start gap-2"
            >
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">
                  {suggestion.properties.name ||
                    suggestion.properties.formatted}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {suggestion.properties.formatted}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Locations */}
      {selectedLocations.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedLocations.map((location) => (
            <span
              key={location.id}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {location.name}
              <button
                type="button"
                onClick={() => removeLocation(location.id)}
                className="ml-2 hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Status Text */}
      <p className="mt-1 text-xs text-muted-foreground">
        {selectedLocations.length} of {maxSelections} locations selected
        {!API_KEY && (
          <span className="text-red-500 ml-2">⚠️ API key not configured</span>
        )}
      </p>
    </div>
  );
};

export default GeoapifyLocationInput;
