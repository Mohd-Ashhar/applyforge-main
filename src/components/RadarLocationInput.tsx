import React, { useState, useEffect, useRef, memo } from "react";
import Radar from "radar-sdk-js";
import { MapPin, X } from "lucide-react"; // Imported icons

const RadarLocationInput = ({
  onLocationsChange,
  placeholder = "Search locations…",
  maxSelections = 5,
}) => {
  const [selected, setSelected] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const RADAR_KEY = import.meta.env.VITE_RADAR_PUBLISHABLE_KEY;

  // Initialize Radar with your publishable key
  useEffect(() => {
    if (RADAR_KEY) {
      Radar.initialize(RADAR_KEY);
    }
  }, [RADAR_KEY]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.length > 2) fetchSuggestions(query);
      else {
        setSuggestions([]);
        setOpen(false);
      }
    }, 600); // 600 ms is a good debounce delay
    return () => clearTimeout(handler);
  }, [query]);

  async function fetchSuggestions(q: string) {
    if (!RADAR_KEY) return;
    setLoading(true);
    setOpen(true);
    try {
      const result = await Radar.autocomplete({ query: q, limit: 5 });
      setSuggestions(result.addresses ?? []);
    } catch (e) {
      console.error("Radar Error:", e);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  function add(address: any) {
    const loc = {
      id: address.placeId || crypto.randomUUID(),
      name: address.formattedAddress,
      address: address.formattedAddress,
      coords: [address.longitude, address.latitude],
      city: address.city,
      state: address.state,
      country: address.country,
    };
    if (!selected.some((s) => s.id === loc.id)) {
      const next = [...selected, loc];
      setSelected(next);
      onLocationsChange(next);
    }
    setQuery("");
    setOpen(false);
    setSuggestions([]);
  }

  function remove(id: string) {
    const next = selected.filter((l) => l.id !== id);
    setSelected(next);
    onLocationsChange(next);
  }

  return (
    <div className="relative w-full">
      {/* Input Field */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          disabled={selected.length >= maxSelections}
          autoComplete="off"
          className="mt-1 w-full
              pl-10 pr-10 py-2 h-10 sm:h-11 text-sm sm:text-base
              bg-slate-800/50 border border-slate-600 text-white
              placeholder-slate-400
              focus:border-orange-400 focus:ring-0
              rounded-lg"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {open && suggestions.length > 0 && (
        <div
          className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto
                        bg-background border border-border rounded-lg shadow-lg"
        >
          {suggestions.map((s) => (
            <div
              key={s.placeId || s.formattedAddress}
              onMouseDown={() => add(s)} // Use onMouseDown to prevent blur event from closing dropdown
              role="option"
              aria-selected="false"
              className="flex cursor-pointer items-start gap-2 px-4 py-2 hover:bg-accent"
            >
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-foreground">
                  {s.formattedAddress}
                </div>
                <div className="truncate text-sm text-muted-foreground">
                  {[s.city, s.state, s.country].filter(Boolean).join(", ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Location Chips */}
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((loc) => (
            <span
              key={loc.id}
              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              {loc.name}
              <button
                type="button"
                onClick={() => remove(loc.id)}
                aria-label={`Remove ${loc.name}`}
                className="ml-2 hover:text-primary/70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Status Text */}
      <p className="mt-1 text-xs text-muted-foreground">
        {selected.length} / {maxSelections} selected
        {!RADAR_KEY && (
          <span className="ml-2 text-red-500">⚠️ API key missing</span>
        )}
      </p>
    </div>
  );
};

export default memo(RadarLocationInput);
