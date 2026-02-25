import React from 'react';

export function FormField({ label, error, children }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-semibold text-zinc-300 mb-1">{label}</label>}
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

const inputClass = "w-full bg-zinc-800 border border-zinc-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-yellow-400 transition placeholder-zinc-500 text-sm";

export function Input({ ...props }) {
  return <input className={inputClass} {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className={inputClass + " appearance-none"} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ ...props }) {
  return <textarea className={inputClass + " resize-none"} rows={3} {...props} />;
}
