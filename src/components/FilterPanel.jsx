import React, { useState } from 'react';

export default function FilterPanel({ title, filters, activeFilters, onFilterChange }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="w-64 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
      {/* Header */}
      <div className="bg-teal-700 text-white px-3 py-2 text-xs font-bold uppercase tracking-wide rounded-md mb-4 flex items-center justify-between">
        <span>FILTER</span>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-white hover:bg-teal-600 rounded p-1 transition"
        >
          {expanded ? '−' : '+'}
        </button>
      </div>

      {expanded && (
        <div className="space-y-6">
          {filters.map((filterGroup, idx) => (
            <div key={idx}>
              {/* Filter Group Title */}
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                <span>{filterGroup.title}</span>
                {filterGroup.icon && <span className="text-lg">{filterGroup.icon}</span>}
              </div>

              {/* Filter Options */}
              <div className="space-y-1 ml-2">
                {filterGroup.options.map((option, optIdx) => (
                  <label key={optIdx} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={activeFilters[filterGroup.key]?.includes(option.value) || false}
                      onChange={(e) => {
                        const current = activeFilters[filterGroup.key] || [];
                        const updated = e.target.checked
                          ? [...current, option.value]
                          : current.filter(v => v !== option.value);
                        onFilterChange(filterGroup.key, updated);
                      }}
                      className="w-4 h-4 text-teal-600 rounded cursor-pointer"
                    />
                    <span className="text-sm text-teal-700 underline group-hover:text-gray-900 transition">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Show Counts */}
          <div className="pt-4 border-t border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-600 rounded cursor-pointer" />
              <span className="text-sm text-teal-700 underline">Show counts</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
