import type { Exercise } from '../types/globalTypes';
import { useState, useEffect, useCallback } from 'react';
import { getAllTasks, getCompletedTasks, createTask, updateTask, deleteTask } from '../utility/api';

export const useExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);

  const getAllExercises = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllTasks();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching all exercises:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllExercises();
  }, [getAllExercises]);

  const getCompletedExercises = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCompletedTasks();
      setExercises(data);
    } catch (error) {
      console.error('Error fetching completed exercises:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const addExercise = useCallback(async (name: string): Promise<boolean> => {
    if (!name.trim()) return false;
    
    try {
      const newExercise = await createTask(name.trim());
      setExercises(prev => [...prev, newExercise]);
      return true;
    } catch (error) {
      console.error('Error creating exercise:', error);
      return false;
    }
  }, []);

  const toggleComplete = useCallback(async (id: number): Promise<boolean> => {
    const exercise = exercises.find(ex => ex.id === id);
    if (!exercise) return false;

    const optimisticExercise = { ...exercise, completed: !exercise.completed };
    
    setExercises(prev => prev.map(ex => ex.id === id ? optimisticExercise : ex));

    try {
      const updatedExercise = await updateTask(id, { 
        completed: !exercise.completed 
      });
      
      setExercises(prev => prev.map(ex => ex.id === id ? updatedExercise : ex));
      return true;
    } catch (error) {
      setExercises(prev => prev.map(ex => ex.id === id ? exercise : ex));
      console.error('Error toggling exercise:', error);
      return false;
    }
  }, [exercises]);

  const deleteExercise = useCallback(async (id: number): Promise<boolean> => {
    try {
      await deleteTask(id);
      setExercises(prev => prev.filter(ex => ex.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting exercise:', error);
      return false;
    }
  }, []);

  const updateExercise = useCallback(async (id: number, newName: string): Promise<boolean> => {
    if (!newName.trim()) return false;
    
    try {
      const updatedExercise = await updateTask(id, { name: newName.trim() });
      setExercises(prev => prev.map(ex => ex.id === id ? updatedExercise : ex));
      return true;
    } catch (error) {
      console.error('Error updating exercise:', error);
      return false;
    }
  }, []);

  const getExerciseStats = useCallback(() => {
    const completedCount = exercises.filter(exercise => exercise.completed).length;
    const totalCount = exercises.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    return {
      completedCount,
      totalCount,
      progressPercentage
    };
  }, [exercises]);

  return {
    exercises,
    loading,
    addExercise,
    toggleComplete,
    deleteExercise,
    updateExercise,
    getAllExercises,
    getExerciseStats,
    getCompletedExercises,
  };
};