import React, { useState, useEffect, useRef, memo } from "react";
import { MapPin, X } from "lucide-react";

const GeoapifyLocationInput = ({
  onLocationsChange,
  placeholder = "Search locations…",
  maxSelections = 10,
}) => {
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const abortRef = useRef(null);

  const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

  /* ───────────────────────────── Debounced search ─────────────────────────── */
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.length > 2) fetchSuggestions(query);
      else {
        setSuggestions([]);
        setOpen(false);
      }
    }, 600); // 600 ms better for rate limits
    return () => clearTimeout(handler);
  }, [query]);

  async function fetchSuggestions(q) {
    if (!API_KEY) return;
    abortRef.current?.abort(); // cancel previous request
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setOpen(true);
    try {
      const url =
        `https://api.geoapify.com/v1/geocode/autocomplete` +
        `?text=${encodeURIComponent(q)}&limit=5&apiKey=${API_KEY}`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setSuggestions(data.features ?? []);
    } catch (e) {
      if (e.name !== "AbortError") console.error("Geoapify:", e);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  function add(feature) {
    const loc = {
      id: feature.properties.place_id ?? crypto.randomUUID(),
      name: feature.properties.formatted,
      address: feature.properties.formatted,
      coords: feature.geometry.coordinates,
      city: feature.properties.city,
      state: feature.properties.state,
      country: feature.properties.country,
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

  function remove(id) {
    const next = selected.filter((l) => l.id !== id);
    setSelected(next);
    onLocationsChange(next);
  }

  return (
    <div className="relative w-full">
      {/* input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder={placeholder}
          disabled={selected.length >= maxSelections}
          className="mt-1 w-full
              pl-10 pr-4 py-2 h-10 sm:h-11 text-sm sm:text-base
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

      {/* dropdown */}
      {open && suggestions.length > 0 && (
        <div
          className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto
                        bg-background border border-border rounded-lg shadow-lg"
        >
          {suggestions.map((feat) => (
            <div
              key={feat.properties.place_id}
              onMouseDown={() => add(feat)}
              role="option"
              className="flex cursor-pointer items-start gap-2 px-4 py-2 hover:bg-accent"
            >
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-foreground">
                  {feat.properties.name ?? feat.properties.formatted}
                </div>
                <div className="truncate text-sm text-muted-foreground">
                  {feat.properties.formatted}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* chips */}
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((l) => (
            <span
              key={l.id}
              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              {l.name}
              <button
                onClick={() => remove(l.id)}
                className="ml-2 hover:text-primary/70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* status */}
      <p className="mt-1 text-xs text-muted-foreground">
        {selected.length} / {maxSelections} selected
        {!API_KEY && (
          <span className="ml-2 text-red-500">⚠️ API key missing</span>
        )}
      </p>
    </div>
  );
};

export default memo(GeoapifyLocationInput);
