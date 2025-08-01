// test/utility/hooks/useExercises.test.ts
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useExercises } from '../../../src/hooks/useExercises'
import type { Exercise } from '../../../src/types/globalTypes'

vi.mock('../../../src/utility/api', () => ({
  getAllTasks: vi.fn(),
  getCompletedTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}))

import * as api from '../../../src/utility/api'
const mockApi = vi.mocked(api)

describe('useExercises Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initial load', () => {
    test('should load exercises on mount', async () => {
      const mockExercises: Exercise[] = [
        { id: 1, name: 'Push ups', completed: false },
        { id: 2, name: 'Squats', completed: true }
      ]
      
      mockApi.getAllTasks.mockResolvedValue(mockExercises)

      const { result } = renderHook(() => useExercises())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(mockApi.getAllTasks).toHaveBeenCalledTimes(1)
      expect(result.current.exercises).toEqual(mockExercises)
    })

    test('should handle error on initial load', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockApi.getAllTasks.mockRejectedValue(new Error('API Error'))

      const { result } = renderHook(() => useExercises())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching all exercises:', expect.any(Error))
      expect(result.current.exercises).toEqual([])
      
      consoleSpy.mockRestore()
    })
  })

  describe('addExercise', () => {
    test('should add exercise successfully', async () => {
      const newExercise: Exercise = { id: 2, name: 'Squats', completed: false }
      
      mockApi.getAllTasks.mockResolvedValue([])
      mockApi.createTask.mockResolvedValue(newExercise)

      const { result } = renderHook(() => useExercises())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      await act(async () => {
        const success = await result.current.addExercise('Squats')
        expect(success).toBe(true)
      })

      expect(mockApi.createTask).toHaveBeenCalledWith('Squats')
      expect(result.current.exercises).toContainEqual(newExercise)
    })

    test('should handle add exercise error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      mockApi.getAllTasks.mockResolvedValue([])
      mockApi.createTask.mockRejectedValue(new Error('API Error'))

      const { result } = renderHook(() => useExercises())

      await act(async () => {
        const success = await result.current.addExercise('Failed Exercise')
        expect(success).toBe(false)
      })

      expect(mockApi.createTask).toHaveBeenCalledWith('Failed Exercise')
      expect(consoleSpy).toHaveBeenCalledWith('Error creating exercise:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    test('should not add exercise with empty name', async () => {
      mockApi.getAllTasks.mockResolvedValue([])

      const { result } = renderHook(() => useExercises())

      await act(async () => {
        const success = await result.current.addExercise('')
        expect(success).toBe(false)
      })

      expect(mockApi.createTask).not.toHaveBeenCalled()
    })
  })

  describe('toggleComplete', () => {
    test('should toggle exercise completion successfully', async () => {
      const initialExercises: Exercise[] = [
        { id: 1, name: 'Push ups', completed: false }
      ]
      const updatedExercise: Exercise = { id: 1, name: 'Push ups', completed: true }
      
      mockApi.getAllTasks.mockResolvedValue(initialExercises)
      mockApi.updateTask.mockResolvedValue(updatedExercise)

      const { result } = renderHook(() => useExercises())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      await act(async () => {
        const success = await result.current.toggleComplete(1)
        expect(success).toBe(true)
      })

      expect(mockApi.updateTask).toHaveBeenCalledWith(1, { completed: true })
      expect(result.current.exercises[0].completed).toBe(true)
    })
  })

  describe('deleteExercise', () => {
    test('should delete exercise successfully', async () => {
      const initialExercises: Exercise[] = [
        { id: 1, name: 'Push ups', completed: false },
        { id: 2, name: 'Squats', completed: false }
      ]
      
      mockApi.getAllTasks.mockResolvedValue(initialExercises)
      mockApi.deleteTask.mockResolvedValue(undefined)

      const { result } = renderHook(() => useExercises())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      await act(async () => {
        const success = await result.current.deleteExercise(1)
        expect(success).toBe(true)
      })

      expect(mockApi.deleteTask).toHaveBeenCalledWith(1)
      expect(result.current.exercises).toHaveLength(1)
      expect(result.current.exercises[0].id).toBe(2)
    })
  })

  describe('updateExercise', () => {
    test('should update exercise name successfully', async () => {
      const initialExercises: Exercise[] = [
        { id: 1, name: 'Push ups', completed: false }
      ]
      const updatedExercise: Exercise = { id: 1, name: 'Modified Push ups', completed: false }
      
      mockApi.getAllTasks.mockResolvedValue(initialExercises)
      mockApi.updateTask.mockResolvedValue(updatedExercise)

      const { result } = renderHook(() => useExercises())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      await act(async () => {
        const success = await result.current.updateExercise(1, 'Modified Push ups')
        expect(success).toBe(true)
      })

      expect(mockApi.updateTask).toHaveBeenCalledWith(1, { name: 'Modified Push ups' })
      expect(result.current.exercises[0].name).toBe('Modified Push ups')
    })
  })

  describe('getExerciseStats', () => {
    test('should calculate stats correctly', async () => {
      const mockExercises: Exercise[] = [
        { id: 1, name: 'Push ups', completed: true },
        { id: 2, name: 'Squats', completed: false },
        { id: 3, name: 'Burpees', completed: true }
      ]
      
      mockApi.getAllTasks.mockResolvedValue(mockExercises)

      const { result } = renderHook(() => useExercises())

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      const stats = result.current.getExerciseStats()
      
      expect(stats.totalCount).toBe(3)
      expect(stats.completedCount).toBe(2)
      expect(stats.progressPercentage).toBeCloseTo(66.67, 2)
    })
  })
})