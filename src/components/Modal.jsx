import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-zinc-700">
          <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl leading-none transition">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
