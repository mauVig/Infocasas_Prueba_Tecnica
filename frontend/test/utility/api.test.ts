// test/utility/api.test.ts
import { describe, test, expect, beforeEach, vi } from 'vitest'
import { getAllTasks, getCompletedTasks, createTask, updateTask, deleteTask } from '../../src/utility/api'
import type { Exercise } from '../../src/types/globalTypes'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Functions', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('getAllTasks', () => {
    test('should retry on network failure', async () => {
      const mockExercises: Exercise[] = []
      
      mockFetch
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockExercises,
        })

      const result = await getAllTasks()
      
      expect(mockFetch).toHaveBeenCalledTimes(3)
      expect(result).toEqual(mockExercises)
    })

    test('should throw error after max retries', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      await expect(getAllTasks()).rejects.toThrow('Failed to fetch after multiple attempts')
      expect(mockFetch).toHaveBeenCalledTimes(3)
    })
  })

  describe('createTask', () => {
    test('should handle server error on create', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      await expect(createTask('Failed Exercise')).rejects.toThrow('Failed to fetch after multiple attempts')
    })
  })

  describe('updateTask', () => {
    test('should update exercise successfully', async () => {
      const updatedExercise: Exercise = { id: 1, name: 'Updated Exercise', completed: true }
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => updatedExercise,
      })

      const result = await updateTask(1, { name: 'Updated Exercise', completed: true })
      
      expect(mockFetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/task/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Accept": "application/json",
        },
        body: JSON.stringify({ name: 'Updated Exercise', completed: true }),
      })
      expect(result).toEqual(updatedExercise)
    })
  })
})