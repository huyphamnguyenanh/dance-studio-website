import React from 'react';

export function FormField({ label, error, children }) {
  return (
    <div>
      {label && <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>}
      {children}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

const inputClass = "w-full border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition";

export function Input({ ...props }) {
  return <input className={inputClass} {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className={inputClass} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ rows = 3, ...props }) {
  return <textarea className={inputClass + " resize-none"} rows={rows} {...props} />;
}
