import React from 'react';
import { Search } from 'lucide-react';

interface FloatingSearchButtonProps {
  show: boolean;
  onClick: () => void;
}

export const FloatingSearchButton: React.FC<FloatingSearchButtonProps> = ({ show, onClick }) => {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14 bg-blue-500 hover:bg-blue-600 
        text-white rounded-full shadow-lg hover:shadow-xl
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        animate-fade-in-up hover:cursor-pointer
      "
      aria-label="Ir a búsqueda"
    >
      <Search className="w-6 h-6" />
    </button>
  );
};