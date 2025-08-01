import React, { useMemo } from 'react';
import { Search, CheckCircle, Circle } from 'lucide-react';
import type { Exercise } from '../types/globalTypes';
import { useExercises } from '../hooks/useExercises';

interface NavBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  exercises: Exercise[];
}

export const NavBar: React.FC<NavBarProps> = ({
  searchTerm,
  setSearchTerm,
  // exercises,
}) => {
  const {exercises} = useExercises();

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <nav id="search-navbar" className="bg-white shadow-lg border-b border-gray-200 relative">
      <div className="flex items-center justify-center px-4 py-4">
        <div className="flex items-center gap-4 w-full max-w-2xl">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar ejercicios..."
              className="
                w-full pl-12 pr-5 py-3 border-2 border-blue-500 rounded-xl
                focus:border-blue-600 focus:outline-none transition-all duration-200
                text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white
              "
            />
          </div>
        </div>
        
        {searchTerm && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 flex justify-center">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto w-full max-w-2xl mx-4">
              {filteredExercises.length > 0 ? (
                <div className="py-2">
                  {filteredExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors
                         border-b border-gray-100 last:border-b-0
                      `}
                      onClick={() => {
                        setSearchTerm('');
                        setTimeout(() => {
                          const element = document.getElementById(`exercise-${exercise.id}`);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            element.classList.add('ring-4', 'ring-blue-200');
                            setTimeout(() => {
                              element.classList.remove('ring-4', 'ring-blue-200');
                            }, 2000);
                          }
                        }, 100);
                      }}
                    >
                      <span>
                        {exercise.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-xl">
                  No se encontraron ejercicios que coincidan con "{searchTerm}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;