import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Search,
  MapPin,
  Briefcase,
  Clock,
  Building,
  X,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import { useAuth } from "@/contexts/AuthContext";
import GeoapifyLocationInput from "@/components/Geoapify";

// Create a CSS file approach for Geoapify
const injectGeoapifyStyles = () => {
  const styleId = "geoapify-theme-override";
  let existingStyle = document.getElementById(styleId);

  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement("style");
  style.id = styleId;
  style.innerHTML = `
    /* Force Geoapify theming with highest specificity */
    .geoapify-autocomplete-input,
    .geoapify-autocomplete-input input,
    [data-geoapify] input,
    .geoapify-location-input input,
    .geoapify-autocomplete-input input[type="text"] {
      background-color: hsl(var(--background)) !important;
      color: hsl(var(--foreground)) !important;
      border: 1px solid hsl(var(--border)) !important;
      border-radius: calc(var(--radius) - 2px) !important;
      padding: 8px 12px !important;
      font-size: 14px !important;
      height: 40px !important;
      box-sizing: border-box !important;
    }
    
    @media (max-width: 768px) {
      .geoapify-autocomplete-input,
      .geoapify-autocomplete-input input,
      [data-geoapify] input,
      .geoapify-location-input input {
        height: 36px !important;
        font-size: 14px !important;
        padding: 6px 12px !important;
      }
    }
    
    .geoapify-autocomplete-input:focus,
    .geoapify-autocomplete-input input:focus,
    [data-geoapify] input:focus,
    .geoapify-location-input input:focus {
      background-color: hsl(var(--background)) !important;
      color: hsl(var(--foreground)) !important;
      border-color: hsl(var(--ring)) !important;
      outline: 2px solid hsl(var(--ring)) !important;
      outline-offset: 2px !important;
    }
    
    .geoapify-autocomplete-items,
    .geoapify-autocomplete-dropdown,
    .geoapify-autocomplete-container .geoapify-autocomplete-items {
      background-color: hsl(var(--popover)) !important;
      color: hsl(var(--popover-foreground)) !important;
      border: 1px solid hsl(var(--border)) !important;
      border-radius: calc(var(--radius) - 2px) !important;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
      z-index: 1000 !important;
    }
    
    .geoapify-autocomplete-item {
      background-color: hsl(var(--popover)) !important;
      color: hsl(var(--popover-foreground)) !important;
      padding: 8px 12px !important;
      border: none !important;
    }
    
    .geoapify-autocomplete-item:hover,
    .geoapify-autocomplete-item.geoapify-autocomplete-item-active,
    .geoapify-autocomplete-item[aria-selected="true"] {
      background-color: hsl(var(--accent)) !important;
      color: hsl(var(--accent-foreground)) !important;
    }

    /* Custom dropdown button fixes */
    .custom-multi-select {
      position: relative;
    }
    
    .custom-multi-select-trigger {
      display: flex;
      min-height: 40px;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      border-radius: calc(var(--radius) - 2px);
      border: 1px solid hsl(var(--border));
      background-color: hsl(var(--background));
      padding: 8px 12px;
      font-size: 14px;
      line-height: 1.4;
      color: hsl(var(--foreground));
      cursor: pointer;
      transition: all 0.2s;
    }
    
    @media (max-width: 768px) {
      .custom-multi-select-trigger {
        min-height: 36px;
        padding: 6px 10px;
        font-size: 14px;
      }
    }
    
    .custom-multi-select-trigger:hover {
      background-color: hsl(var(--accent));
      color: hsl(var(--accent-foreground));
    }
    
    .custom-multi-select-trigger:focus {
      outline: 2px solid hsl(var(--ring));
      outline-offset: 2px;
    }
    
    .custom-multi-select-content {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      flex: 1;
      align-items: center;
    }
    
    .custom-multi-select-tag {
      display: inline-flex;
      align-items: center;
      background-color: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
      padding: 2px 8px;
      border-radius: calc(var(--radius) - 4px);
      font-size: 12px;
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      .custom-multi-select-tag {
        padding: 1px 6px;
        font-size: 11px;
      }
    }
    
    .custom-multi-select-tag-remove {
      margin-left: 4px;
      cursor: pointer;
      opacity: 0.7;
    }
    
    .custom-multi-select-tag-remove:hover {
      opacity: 1;
    }
    
    .custom-multi-select-placeholder {
      color: hsl(var(--muted-foreground));
      font-size: 14px;
    }
    
    .custom-multi-select-chevron {
      opacity: 0.5;
      width: 16px;
      height: 16px;
      margin-left: 8px;
      flex-shrink: 0;
    }
  `;

  document.head.appendChild(style);
};

// Framer Motion Loading Overlay Component
const LoadingOverlay = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[999] flex flex-col items-center justify-center backdrop-blur-lg bg-background/80"
      >
        <motion.div
          className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 shadow-2xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-sm text-muted-foreground tracking-wide"
        >
          Fetching the best opportunities…
        </motion.p>

        <motion.div
          className="flex gap-1 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const JobFinder = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState([]);
  const [postedAt, setPostedAt] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { checkUsageLimit, refreshUsage } = useUsageTracking();

  // Enhanced styling injection with MutationObserver for dynamic content
  useEffect(() => {
    // Initial injection
    injectGeoapifyStyles();

    // Watch for DOM changes to catch dynamically loaded Geoapify elements
    const observer = new MutationObserver((mutations) => {
      let shouldReinject = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (
              element.classList?.contains("geoapify-autocomplete-input") ||
              element.classList?.contains("geoapify-autocomplete-items") ||
              element.querySelector?.(".geoapify-autocomplete-input")
            ) {
              shouldReinject = true;
            }
          }
        });
      });

      if (shouldReinject) {
        setTimeout(injectGeoapifyStyles, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Multiple injection attempts to catch all cases
    const timeouts = [500, 1000, 2000].map((delay) =>
      setTimeout(injectGeoapifyStyles, delay)
    );

    return () => {
      observer.disconnect();
      timeouts.forEach(clearTimeout);
      const style = document.getElementById("geoapify-theme-override");
      if (style) style.remove();
    };
  }, []);

  // Options
  const jobTypeOptions = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
    { value: "temporary", label: "Temporary" },
    { value: "volunteer", label: "Volunteer" },
  ];

  const workTypeOptions = [
    { value: "on-site", label: "On-site" },
    { value: "remote", label: "Remote" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const postedAtOptions = [
    { value: "past-24-hours", label: "Past 24 hours" },
    { value: "past-week", label: "Past week" },
    { value: "past-month", label: "Past month" },
    { value: "any-time", label: "Any time" },
  ];

  const experienceLevelOptions = [
    { value: "internship", label: "Internship" },
    { value: "entry-level", label: "Entry level" },
    { value: "associate", label: "Associate" },
    { value: "mid-senior", label: "Mid-Senior level" },
    { value: "director", label: "Director" },
    { value: "executive", label: "Executive" },
  ];

  // Completely rewritten MultiSelectDropdown with proper styling
  const MultiSelectDropdown = ({
    options,
    selectedValues,
    onSelectionChange,
    placeholder,
    className = "",
    maxDisplayTags = 2,
  }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (value) => {
      const isSelected = selectedValues.includes(value);
      let newSelection;
      if (isSelected) {
        newSelection = selectedValues.filter((item) => item !== value);
      } else {
        newSelection = [...selectedValues, value];
      }
      onSelectionChange(newSelection);
    };

    const removeItem = (valueToRemove, e) => {
      e.stopPropagation();
      const newSelection = selectedValues.filter(
        (item) => item !== valueToRemove
      );
      onSelectionChange(newSelection);
    };

    const getSelectedLabels = () => {
      return selectedValues
        .map((value) => options.find((option) => option.value === value)?.label)
        .filter(Boolean);
    };

    return (
      <div className={`custom-multi-select ${className}`}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div
              className="custom-multi-select-trigger"
              role="button"
              tabIndex={0}
              onClick={() => setIsOpen(!isOpen)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsOpen(!isOpen);
                }
              }}
            >
              <div className="custom-multi-select-content">
                {selectedValues.length === 0 ? (
                  <span className="custom-multi-select-placeholder">
                    {placeholder}
                  </span>
                ) : selectedValues.length <= maxDisplayTags ? (
                  getSelectedLabels().map((label, index) => (
                    <span key={index} className="custom-multi-select-tag">
                      {label}
                      <span
                        className="custom-multi-select-tag-remove"
                        onClick={(e) => removeItem(selectedValues[index], e)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            removeItem(selectedValues[index], e);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Remove ${label}`}
                      >
                        <X size={12} />
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="text-sm">
                    {selectedValues.length} selected
                  </span>
                )}
              </div>
              <ChevronDown className="custom-multi-select-chevron" />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-full p-0 z-50"
            align="start"
            side="bottom"
            sideOffset={4}
            avoidCollisions={false}
          >
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-3 px-4 py-3 hover:bg-accent cursor-pointer"
                  onClick={() => handleToggle(option.value)}
                >
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    onChange={() => {}}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">{option.label}</span>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  // Form submit handler (unchanged)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobTitle.trim()) {
      toast({
        title: "Job Title Required",
        description: "Please enter a job title to search for jobs.",
        variant: "destructive",
      });
      return;
    }

    if (checkUsageLimit("job_searches_used")) {
      toast({
        title: "Usage Limit Reached",
        description:
          "You have reached your job search limit for this plan. Please upgrade to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    try {
      const searchParams = {
        jobTitle: jobTitle.trim(),
        company: company.trim() || undefined,
        locations: selectedLocations.map((loc) => loc.name),
        location:
          selectedLocations.length > 0
            ? selectedLocations.map((loc) => loc.name).join(", ")
            : undefined,
        jobTypes,
        jobType: jobTypes.length > 0 ? jobTypes.join(", ") : undefined,
        workTypes,
        workType: workTypes.length > 0 ? workTypes.join(", ") : undefined,
        experienceLevel,
        experienceLevels:
          experienceLevel.length > 0 ? experienceLevel.join(", ") : undefined,
        postedAt: postedAt || undefined,
      };

      const cleanParams = Object.fromEntries(
        Object.entries(searchParams).filter(
          ([_, v]) => v !== undefined && v !== ""
        )
      );

      const payload = {
        user_id: user?.id,
        feature: "job_searches",
        ...cleanParams,
      };

      const response = await fetch(
        "https://n8n.applyforge.cloud/webhook-test/job-search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to search jobs");
      }

      const responseData = await response.json();

      if (responseData.allowed === false) {
        toast({
          title: "Limit Reached",
          description:
            responseData.message ||
            "You've reached your limit for this feature.",
          variant: "destructive",
        });
        return;
      }

      const jobResults = responseData.results || responseData;

      toast({
        title: "Search Completed",
        description: `Found ${
          Array.isArray(jobResults) ? jobResults.length : "several"
        } job opportunities.`,
        variant: "default",
      });

      refreshUsage();
      sessionStorage.setItem("jobSearchResults", JSON.stringify(jobResults));
      sessionStorage.setItem("jobSearchParams", JSON.stringify(cleanParams));
      navigate("/job-results");
    } catch (error) {
      toast({
        title: "Search Failed",
        description:
          error.message || "Failed to search for jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const clearAllFilters = () => {
    setJobTitle("");
    setCompany("");
    setSelectedLocations([]);
    setJobTypes([]);
    setWorkTypes([]);
    setExperienceLevel([]);
    setPostedAt("");
    toast({
      title: "Filters Cleared",
      description: "All search filters have been reset.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <LoadingOverlay show={isSearching} />

      <div className="container mx-auto px-4 py-8 md:py-20">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button
              variant="ghost"
              className="flex items-center gap-2 mb-6 hover:bg-appforge-blue/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center mb-6 md:mb-8">
            <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-xl w-fit mx-auto bg-blue-500/20 text-blue-500">
              <Search className="w-8 h-8 md:w-12 md:h-12" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              Find Your Next <span className="gradient-text">Opportunity</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground px-4">
              Search for jobs that match your skills and preferences
            </p>
          </div>

          <Card className="glass">
            <CardHeader className="pb-4">
              <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <Briefcase className="h-5 w-5" />
                    Job Search
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Enter your job preferences to find relevant opportunities.
                    Only job title is required.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs md:text-sm w-full md:w-auto"
                >
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="md:col-span-1">
                    <Label htmlFor="jobTitle" className="text-sm md:text-base">
                      Job Title *
                    </Label>
                    <Input
                      id="jobTitle"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g., Software Engineer, Product Manager"
                      required
                      className="mt-1 h-10"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="company" className="text-sm md:text-base">
                      Company
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g., Google, Microsoft"
                        className="mt-1 pl-10 h-10"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-sm md:text-base">Locations</Label>
                    <div className="mt-1">
                      <GeoapifyLocationInput
                        onLocationsChange={setSelectedLocations}
                        placeholder="Type to search cities, states, or 'Remote'"
                        maxSelections={10}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <Label className="text-sm md:text-base">Job Type</Label>
                    <MultiSelectDropdown
                      options={jobTypeOptions}
                      selectedValues={jobTypes}
                      onSelectionChange={setJobTypes}
                      placeholder="Select job types"
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label className="text-sm md:text-base">Work Type</Label>
                    <MultiSelectDropdown
                      options={workTypeOptions}
                      selectedValues={workTypes}
                      onSelectionChange={setWorkTypes}
                      placeholder="Select work types"
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Label htmlFor="postedAt" className="text-sm md:text-base">
                      Date Posted
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
                      <Select value={postedAt} onValueChange={setPostedAt}>
                        <SelectTrigger className="mt-1 pl-10 h-10">
                          <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                          {postedAtOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="md:col-span-1">
                    <Label className="text-sm md:text-base">
                      Experience Level
                    </Label>
                    <MultiSelectDropdown
                      options={experienceLevelOptions}
                      selectedValues={experienceLevel}
                      onSelectionChange={setExperienceLevel}
                      placeholder="Select experience levels"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-3 md:p-4">
                  <h4 className="text-sm font-medium mb-2">Search Summary:</h4>
                  <div className="text-xs md:text-sm text-muted-foreground space-y-1">
                    <p>
                      • Job Title:{" "}
                      <span className="font-medium">
                        {jobTitle || "Not specified"}
                      </span>
                    </p>
                    {company && (
                      <p>
                        • Company:{" "}
                        <span className="font-medium">{company}</span>
                      </p>
                    )}
                    {selectedLocations.length > 0 && (
                      <p>
                        • Locations:{" "}
                        <span className="font-medium">
                          {selectedLocations.map((l) => l.name).join(", ")}
                        </span>
                      </p>
                    )}
                    {jobTypes.length > 0 && (
                      <p>
                        • Job Types:{" "}
                        <span className="font-medium">
                          {jobTypes.join(", ")}
                        </span>
                      </p>
                    )}
                    {workTypes.length > 0 && (
                      <p>
                        • Work Types:{" "}
                        <span className="font-medium">
                          {workTypes.join(", ")}
                        </span>
                      </p>
                    )}
                    {experienceLevel.length > 0 && (
                      <p>
                        • Experience:{" "}
                        <span className="font-medium">
                          {experienceLevel.join(", ")}
                        </span>
                      </p>
                    )}
                    {postedAt && (
                      <p>
                        • Posted:{" "}
                        <span className="font-medium">
                          {
                            postedAtOptions.find(
                              (opt) => opt.value === postedAt
                            )?.label
                          }
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 md:pt-4">
                  <Button
                    type="submit"
                    disabled={isSearching || !jobTitle.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 h-11"
                    size="lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    {isSearching ? "Searching Jobs..." : "Search Jobs"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobFinder;
