// test/components/ExerciseSection.test.tsx
import { describe, test, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExerciseSection } from '../../src/components/ExerciseSection'
import type { Exercise } from '../../src/types/globalTypes'

vi.mock('../../src/hooks/useExercises')
vi.mock('../../src/components/ExerciseItem', () => ({
  ExerciseItem: ({ exercise, onToggleComplete, onDelete, onEdit }: any) => (
    <div data-testid={`exercise-item-${exercise.id}`}>
      <span>{exercise.name}</span>
      <input
        type="checkbox"
        checked={exercise.completed}
        onChange={() => onToggleComplete(exercise.id)}
        data-testid={`checkbox-${exercise.id}`}
      />
      <button onClick={() => onDelete(exercise)} data-testid={`delete-${exercise.id}`}>
        Delete
      </button>
      <button onClick={() => onEdit(exercise)} data-testid={`edit-${exercise.id}`}>
        Edit
      </button>
    </div>
  )
}))

import * as useExercisesHook from '../../src/hooks/useExercises'
const mockUseExercises = vi.mocked(useExercisesHook)

interface MockAddToast {
  (message: string, type?: 'success' | 'error'): void
}

const mockAddToast: MockAddToast = vi.fn()

const defaultMockHookReturn = {
  exercises: [
    { id: 1, name: 'Push ups', completed: false },
    { id: 2, name: 'Squats', completed: true }
  ] as Exercise[],
  addExercise: vi.fn().mockResolvedValue(true),
  toggleComplete: vi.fn().mockResolvedValue(true),
  deleteExercise: vi.fn().mockResolvedValue(true),
  updateExercise: vi.fn().mockResolvedValue(true),
  getAllExercises: vi.fn(),
  getCompletedExercises: vi.fn(),
  getExerciseStats: vi.fn().mockReturnValue({
    totalCount: 2,
    completedCount: 1,
    progressPercentage: 50
  })
}

describe('ExerciseSection Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseExercises.useExercises.mockReturnValue(defaultMockHookReturn)
  })

  describe('Rendering', () => {
    test('renders component with title and progress', () => {
      render(<ExerciseSection searchTerm="" addToast={mockAddToast} />)
      
      expect(screen.getByText('GYM')).toBeInTheDocument()
      expect(screen.getByText('TRACK')).toBeInTheDocument()
      expect(screen.getByText('Tu rutina de entrenamiento personalizada')).toBeInTheDocument()
      expect(screen.getByText('Progreso del Entrenamiento')).toBeInTheDocument()
      expect(screen.getByText('1/2')).toBeInTheDocument()
      expect(screen.getByText('50%')).toBeInTheDocument()
    })

    test('renders exercise items', () => {
      render(<ExerciseSection searchTerm="" addToast={mockAddToast} />)
      
      expect(screen.getByTestId('exercise-item-1')).toBeInTheDocument()
      expect(screen.getByTestId('exercise-item-2')).toBeInTheDocument()
      expect(screen.getByText('Push ups')).toBeInTheDocument()
      expect(screen.getByText('Squats')).toBeInTheDocument()
    })

    test('displays empty state when no exercises', () => {
      mockUseExercises.useExercises.mockReturnValue({
        ...defaultMockHookReturn,
        exercises: [],
        getExerciseStats: vi.fn().mockReturnValue({
          totalCount: 0,
          completedCount: 0,
          progressPercentage: 0
        })
      })

      render(<ExerciseSection searchTerm="" addToast={mockAddToast} />)
      
      expect(screen.getByText('No hay ejercicios en tu rutina')).toBeInTheDocument()
      expect(screen.getByText('¡Agrega algunos ejercicios para comenzar!')).toBeInTheDocument()
    })
  })



  describe('Add Exercise functionality', () => {
    test('adds exercise on Enter key press', async () => {
      const user = userEvent.setup()

      render(<ExerciseSection searchTerm="" addToast={mockAddToast} />)
      
      const input = screen.getByPlaceholderText('Agregar nuevo ejercicio...')

      await user.type(input, 'Keyboard Exercise')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(defaultMockHookReturn.addExercise).toHaveBeenCalledWith('Keyboard Exercise')
      })
    })

    test('shows error toast when add exercise fails', async () => {
      const user = userEvent.setup()
      const failingMockHook = {
        ...defaultMockHookReturn,
        addExercise: vi.fn().mockResolvedValue(false)
      }
      mockUseExercises.useExercises.mockReturnValue(failingMockHook)

      render(<ExerciseSection searchTerm="" addToast={mockAddToast} />)
      
      const input = screen.getByPlaceholderText('Agregar nuevo ejercicio...')
      const button = screen.getByText('Agregar')

      await user.type(input, 'Failed Exercise')
      await user.click(button)

      await waitFor(() => {
        expect(mockAddToast).toHaveBeenCalledWith('Error al agregar el ejercicio', 'error')
      })
    })

    test('prevents adding empty exercises', async () => {
      render(<ExerciseSection searchTerm="" addToast={mockAddToast} />)
      
      const button = screen.getByText('Agregar')
      expect(button).toBeDisabled()
    })
  })

  describe('Checkbox toggle functionality', () => {
    test('toggles between all and completed exercises', async () => {
      const user = userEvent.setup()
      
      render(<ExerciseSection searchTerm="" addToast={mockAddToast} />)
      
      const checkbox = screen.getByRole('checkbox', { 
        name: /mostrar solo ejercicios completados/i 
      })
      
      await user.click(checkbox)
      expect(defaultMockHookReturn.getCompletedExercises).toHaveBeenCalled()
      
      await user.click(checkbox)
      expect(defaultMockHookReturn.getAllExercises).toHaveBeenCalled()
    })

    test('shows completed exercises count when checkbox is checked', async () => {
      const user = userEvent.setup()
      
      render(<ExerciseSection searchTerm="" addToast={mockAddToast} />)
      
      const checkbox = screen.getByRole('checkbox', { 
        name: /mostrar solo ejercicios completados/i 
      })
      
      await user.click(checkbox)
      
      expect(screen.getByText('2 ejercicios completados')).toBeInTheDocument()
    })
  })

  describe('Exercise interactions', () => {
    test('handles exercise toggle completion', async () => {
      const user = userEvent.setup()

      render(<ExerciseSection searchTerm="" addToast={mockAddToast} />)
      
      const checkbox = screen.getByTestId('checkbox-1')
      await user.click(checkbox)

      await waitFor(() => {
        expect(defaultMockHookReturn.toggleComplete).toHaveBeenCalledWith(1)
      })
    })
  })

  describe('Delete functionality', () => {
    test('opens delete confirmation modal', async () => {
      const user = userEvent.setup()
      
      render(<ExerciseSection searchTerm="" addToast={mockAddToast} />)
      
      const deleteButton = screen.getByTestId('delete-1')
      await user.click(deleteButton)
      
      expect(screen.getByText('¿Eliminar este ejercicio?')).toBeInTheDocument()
      expect(screen.getByText('"Push ups"')).toBeInTheDocument()
    })
    
    test('cancels delete operation', async () => {
      const user = userEvent.setup()
      
      render(<ExerciseSection searchTerm="" addToast={mockAddToast} />)
      
      const deleteButton = screen.getByTestId('delete-1')
      await user.click(deleteButton)
      
      const cancelButton = screen.getByText('Cancelar')
      await user.click(cancelButton)

      expect(screen.queryByText('¿Eliminar este ejercicio?')).not.toBeInTheDocument()
      expect(defaultMockHookReturn.deleteExercise).not.toHaveBeenCalled()
    })
  })

  describe('Edit functionality', () => {
    test('opens edit modal', async () => {
      const user = userEvent.setup()
      
      render(<ExerciseSection searchTerm="" addToast={mockAddToast} />)
      
      const editButton = screen.getByTestId('edit-1')
      await user.click(editButton)
      
      expect(screen.getByText('Editar Ejercicio')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Push ups')).toBeInTheDocument()
    })

    test('saves edited exercise', async () => {
      const user = userEvent.setup()
      
      render(<ExerciseSection searchTerm="" addToast={mockAddToast} />)
      
      const editButton = screen.getByTestId('edit-1')
      await user.click(editButton)
      
      const input = screen.getByDisplayValue('Push ups')
      await user.clear(input)
      await user.type(input, 'Modified Push ups')
      
      const saveButton = screen.getByText('Guardar')
      await user.click(saveButton)

      await waitFor(() => {
        expect(defaultMockHookReturn.updateExercise).toHaveBeenCalledWith(1, 'Modified Push ups')
        expect(mockAddToast).toHaveBeenCalledWith('Ejercicio editado correctamente', 'success')
      })
    })

    test('cancels edit operation', async () => {
      const user = userEvent.setup()
      
      render(<ExerciseSection searchTerm="" addToast={mockAddToast} />)
      
      const editButton = screen.getByTestId('edit-1')
      await user.click(editButton)
      
      const cancelButton = screen.getByText('Cancelar')
      await user.click(cancelButton)

      expect(screen.queryByText('Editar Ejercicio')).not.toBeInTheDocument()
      expect(defaultMockHookReturn.updateExercise).not.toHaveBeenCalled()
    })
  })
})