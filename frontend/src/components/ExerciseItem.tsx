import type { Exercise } from '../types/globalTypes';
import React from 'react';
import { CheckCircle, Circle, Trash2, Edit3 } from 'lucide-react';

interface ExerciseItemProps {
  id?: string;
  exercise: Exercise;
  onToggleComplete: (id: number) => void;
  onDelete: (exercise: Exercise) => void;
  onEdit: (exercise: Exercise) => void;
}

export const ExerciseItem: React.FC<ExerciseItemProps> = ({
  id,
  exercise,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  return (
    <div
      onClick={() => onToggleComplete(exercise.id)}
      id={id}
      className={`
        group flex flex-col max-[400px]:gap-3 max-[400px]:items-start min-[401px]:flex-row min-[401px]:items-center hover:cursor-pointer gap-4 p-4 rounded-xl border-2 transition-all duration-200
        ${exercise.completed 
          ? 'bg-green-50 border-green-200 shadow-sm' 
          : 'bg-white border-gray-200 shadow-md hover:shadow-lg'
        }
      `}
    >
      
      <div className="flex items-center gap-4 min-[401px]:flex-1 w-full"
         onClick={() => onToggleComplete(exercise.id)}
        >
        <button
          onClick={() => onToggleComplete(exercise.id)}
          className={`
            flex-shrink-0 transition-all duration-200 hover:scale-110
            ${exercise.completed ? 'text-green-500' : 'text-gray-400 hover:text-blue-500'}
          `}
        >
          {exercise.completed ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </button>

        <span
          onClick={() => onToggleComplete(exercise.id)}
          className={`
            flex-1 font-medium transition-all duration-200 cursor-pointer select-none
            ${exercise.completed 
              ? 'text-green-700 line-through opacity-75' 
              : 'text-gray-800'
            }
          `}
        >
          {exercise.name}
        </span>
      </div>

      <div className="flex gap-2 max-[400px]:w-full max-[400px]:justify-end min-[401px]:flex-shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(exercise);
          }}
          className="
            p-2 rounded-lg text-gray-400 hover:text-blue-500 
            hover:bg-blue-50 transition-all duration-200 hover:scale-110
            opacity-100
          "
        >
          <Edit3 className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(exercise);
          }}
          className="
            p-2 rounded-lg text-gray-400 hover:text-red-500 
            hover:bg-red-50 transition-all duration-200 hover:scale-110
            opacity-100
          "
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ExerciseItem;