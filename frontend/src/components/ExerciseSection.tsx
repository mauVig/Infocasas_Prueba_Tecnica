import type { Exercise } from '../types/globalTypes';
import React, { useState, useEffect } from 'react';
import { Plus, Dumbbell, Target, X, CheckCircle } from 'lucide-react';
import { ExerciseItem } from './ExerciseItem';
import { useExercises } from '../hooks/useExercises';

interface ExerciseSectionProps {
  searchTerm: string;
  addToast: (message: string, type?: 'success' | 'error') => void;
}

export const ExerciseSection: React.FC<ExerciseSectionProps> = ({ searchTerm, addToast }) => {
  const { 
    exercises, 
    addExercise, 
    toggleComplete, 
    deleteExercise, 
    updateExercise, 
    getAllExercises,
    getExerciseStats,
    getCompletedExercises,
  } = useExercises();
  
  const [newExerciseName, setNewExerciseName] = useState('');
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showOnlyCompleted, setShowOnlyCompleted] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingExercise) {
          cancelEditing();
        }
        if (exerciseToDelete) {
          setExerciseToDelete(null);
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [editingExercise, exerciseToDelete]);
  
  const handlerOnlyCompleted = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setShowOnlyCompleted(isChecked);
        
    if (isChecked) {
      getCompletedExercises();
    } else {
      getAllExercises();
    }
  };

  const handleAddExercise = async () => {
    if (await addExercise(newExerciseName)) {
      setNewExerciseName('');
      addToast(`Ejercicio ${newExerciseName} agregado`, 'success');
    } else {
      addToast('Error al agregar el ejercicio', 'error');
    }
  };

  const handleDeleteClick = (exercise: Exercise) => {
    setExerciseToDelete(exercise);
  };

  const confirmDelete = async () => {
    if (exerciseToDelete) {
      if (await deleteExercise(exerciseToDelete.id)) {
        addToast('Ejercicio eliminado', 'error');
      } else {
        addToast('Error al eliminar el ejercicio', 'error');
      }
      setExerciseToDelete(null);
    }
  };

  const cancelDelete = () => {
    setExerciseToDelete(null);
  };

  const startEditing = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setEditValue(exercise.name);
  };

  const saveEdit = async () => {
    if (editingExercise && await updateExercise(editingExercise.id, editValue)) {
      setEditingExercise(null);
      setEditValue('');
      addToast('Ejercicio editado correctamente', 'success');
    } else {
      addToast('Error al editar el ejercicio', 'error');
    }
  };

  const cancelEditing = () => {
    setEditingExercise(null);
    setEditValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddExercise();
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    }
  };

  const handleToggleComplete = async (id: number) => {
    const exercise = exercises.find(ex => ex.id === id);
    if (!exercise) return;
    
    try {
      await toggleComplete(id);
    } catch (error) {
      addToast('Error al actualizar el ejercicio', 'error');
    }
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { completedCount, totalCount, progressPercentage } = getExerciseStats();

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">
              GYM<span className="text-blue-500">TRACK</span>
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Tu rutina de entrenamiento personalizada</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <Target className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Progreso del Entrenamiento</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ejercicios completados</span>
              <span className="font-bold text-blue-600">{completedCount}/{totalCount}</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="text-center">
              <span className="text-2xl font-bold text-gray-800">{Math.round(progressPercentage)}%</span>
              <span className="text-gray-500 ml-1">completado</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex gap-3 max-[500px]:flex-col">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Agregar nuevo ejercicio..."
                  className="
                    w-full px-4 py-3 border-2 border-green-500 rounded-xl max-[500px]:w-full
                    focus:border-green-500 focus:outline-none transition-all duration-200
                    text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white
                  "
                />
              </div>
              <button
                onClick={handleAddExercise}
                disabled={!newExerciseName.trim()}
                className="
                  px-6 py-3 bg-blue-500 text-white rounded-xl font-medium max-[500px]:w-full
                  hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200
                  transition-all duration-200 flex items-center gap-2
                  disabled:bg-gray-300 disabled:cursor-not-allowed
                  hover:scale-105 active:scale-95 max-[500px]:justify-center
                "
              >
                <Plus className="w-5 h-5" />
                Agregar
              </button>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyCompleted}
                  onChange={handlerOnlyCompleted}
                  className="
                    w-5 h-5 text-blue-500 border-2 border-gray-300 rounded
                    focus:ring-2 focus:ring-blue-200 focus:border-blue-500
                    transition-all duration-200
                  "
                />
                <span className="text-gray-700 font-medium">
                  Mostrar solo ejercicios completados
                </span>
              </label>
              <div className="min-w-0">
                {showOnlyCompleted && (
                  <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {filteredExercises.length} ejercicio{filteredExercises.length !== 1 ? 's' : ''} completado{filteredExercises.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {filteredExercises.length === 0 && exercises.length === 0 ? (
              <div className="text-center py-12">
                <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No hay ejercicios en tu rutina</p>
                <p className="text-gray-400">¡Agrega algunos ejercicios para comenzar!</p>
              </div>
            ) : filteredExercises.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  {showOnlyCompleted 
                    ? 'No hay ejercicios completados' 
                    : 'No se encontraron ejercicios'
                  }
                </p>
                <p className="text-gray-400">
                  {showOnlyCompleted 
                    ? '¡Completa algunos ejercicios para verlos aquí!' 
                    : 'Intenta con otros términos de búsqueda'
                  }
                </p>
              </div>
            ) : (
              exercises.map((exercise) => (
                <ExerciseItem
                  id={`exercise-${exercise.id}`}
                  key={exercise.id}
                  exercise={exercise}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteClick}
                  onEdit={startEditing}
                />
              ))
            )}
          </div>
        </div>
        <div className="text-center mt-8">
          <p className="text-gray-500 italic">
            "El éxito no es final, el fracaso no es fatal: lo que cuenta es el coraje de continuar."
          </p>
        </div>
      </div>
      {exerciseToDelete && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={cancelDelete}
        >
          <div 
            className="bg-white rounded-xl shadow-lg w-full max-w-sm animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-gray-800 font-bold mb-3">
                    ¿Eliminar este ejercicio?
                  </p>
                  <p className="text-gray-700 bg-red-50 p-2 rounded text-sm">
                    "{exerciseToDelete.name}"
                  </p>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={cancelDelete}
                    className="
                      flex-1 px-3 py-2 bg-gray-100 text-gray-600 rounded font-medium text-sm
                      hover:bg-gray-200 transition-colors
                    "
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="
                      flex-1 px-3 py-2 bg-red-500 text-white rounded font-medium text-sm
                      hover:bg-red-600 transition-colors
                    "
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {editingExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Editar Ejercicio</h3>
                <button
                  onClick={cancelEditing}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del ejercicio
                  </label>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyPress={handleEditKeyPress}
                    className="
                      w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                      focus:border-blue-500 focus:outline-none transition-all duration-200
                      text-gray-800 bg-gray-50 focus:bg-white
                    "
                    placeholder="Nombre del ejercicio..."
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={saveEdit}
                    disabled={!editValue.trim()}
                    className="
                      flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium
                      hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-200
                      transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed
                    "
                  >
                    Guardar
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="
                      flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium
                      hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200
                      transition-all duration-200
                    "
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExerciseSection;