import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

interface Option {
  id: string;
  label: string;
  sublabel?: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  error?: string;
}

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  searchable = true,
  error,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  // Check if dropdown should open upward
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If less than 300px space below and more space above, open upward
      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen]);

  const filteredOptions = searchable
    ? options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          opt.sublabel?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-white dark:bg-dark-surface border ${
          error
            ? "border-red-500"
            : "border-primary-200 dark:border-dark-border"
        } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 text-left flex items-center justify-between transition-colors`}
      >
        <span
          className={
            selectedOption
              ? "text-[#1A1A1A] dark:text-dark-text"
              : "text-[#6B8F60] dark:text-dark-text-secondary"
          }
        >
          {selectedOption ? (
            <div>
              <div className="font-medium">{selectedOption.label}</div>
              {selectedOption.sublabel && (
                <div className="text-sm text-[#6B8F60] dark:text-primary-600">
                  {selectedOption.sublabel}
                </div>
              )}
            </div>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-primary dark:text-primary-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 w-full ${
            openUpward ? "bottom-full mb-2" : "top-full mt-2"
          } bg-white dark:bg-dark-surface border border-primary-200 dark:border-dark-border rounded-lg shadow-xl max-h-80 overflow-hidden`}
        >
          {searchable && (
            <div className="p-3 border-b border-primary-200 dark:border-dark-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B8F60] dark:text-primary-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-primary-50 dark:bg-dark-border border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-500 text-[#1A1A1A] dark:text-dark-text"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          <div className="overflow-y-auto max-h-64">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-[#6B8F60] dark:text-dark-text-secondary">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onChange(option.id);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-primary-50 dark:hover:bg-dark-border transition-colors ${
                    option.id === value
                      ? "bg-primary-100 dark:bg-dark-border"
                      : ""
                  }`}
                >
                  <div className="font-medium text-[#1A1A1A] dark:text-dark-text">
                    {option.label}
                  </div>
                  {option.sublabel && (
                    <div className="text-sm text-[#6B8F60] dark:text-primary-600 mt-0.5">
                      {option.sublabel}
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
