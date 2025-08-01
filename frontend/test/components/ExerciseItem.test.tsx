// test/components/ExerciseItem.test.tsx
import { describe, test, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExerciseItem } from '../../src/components/ExerciseItem'
import type { Exercise } from '../../src/types/globalTypes'

const mockExercise: Exercise = {
  id: 1,
  name: 'Push ups',
  completed: false
}

const completedMockExercise: Exercise = {
  id: 2,
  name: 'Squats',
  completed: true
}

const mockHandlers = {
  onToggleComplete: vi.fn(),
  onDelete: vi.fn(),
  onEdit: vi.fn()
}

describe('ExerciseItem Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    test('renders exercise name correctly', () => {
      render(
        <ExerciseItem 
          id="exercise-1"
          exercise={mockExercise} 
          {...mockHandlers} 
        />
      )
      
      expect(screen.getByText('Push ups')).toBeInTheDocument()
    })

    test('renders toggle button for incomplete exercise', () => {
      render(
        <ExerciseItem 
          id="exercise-1"
          exercise={mockExercise} 
          {...mockHandlers} 
        />
      )
      
      const toggleButton = screen.getAllByRole('button')[0]
      expect(toggleButton).toBeInTheDocument()
    })

    test('renders toggle button for completed exercise', () => {
      render(
        <ExerciseItem 
          id="exercise-2"
          exercise={completedMockExercise} 
          {...mockHandlers} 
        />
      )
      
      const toggleButton = screen.getAllByRole('button')[0]
      expect(toggleButton).toBeInTheDocument()
    })

    test('applies completed styling to completed exercise', () => {
      render(
        <ExerciseItem 
          id="exercise-2"
          exercise={completedMockExercise} 
          {...mockHandlers} 
        />
      )
      
      const exerciseName = screen.getByText('Squats')
      expect(exerciseName).toHaveClass('line-through', 'text-green-700', 'opacity-75')
    })

    test('applies normal styling to incomplete exercise', () => {
      render(
        <ExerciseItem 
          id="exercise-1"
          exercise={mockExercise} 
          {...mockHandlers} 
        />
      )
      
      const exerciseName = screen.getByText('Push ups')
      expect(exerciseName).not.toHaveClass('line-through')
      expect(exerciseName).toHaveClass('text-gray-800')
      expect(exerciseName).not.toHaveClass('opacity-75')
    })

    test('renders edit and delete buttons', () => {
      render(
        <ExerciseItem 
          id="exercise-1"
          exercise={mockExercise} 
          {...mockHandlers} 
        />
      )
      
      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(3) // toggle, edit, delete
    })
  })

  describe('Interactions', () => {
    // test('calls onToggleComplete when toggle button is clicked', async () => {
    //   const user = userEvent.setup()
      
    //   render(
    //     <ExerciseItem 
    //       id="exercise-1"
    //       exercise={mockExercise} 
    //       {...mockHandlers} 
    //     />
    //   )
      
    //   const toggleButton = screen.getAllByRole('button')[0]
    //   await user.click(toggleButton)
      
    //   expect(mockHandlers.onToggleComplete).toHaveBeenCalledWith(1)
    //   expect(mockHandlers.onToggleComplete).toHaveBeenCalledTimes(1)
    // })

    test('calls onEdit when edit button is clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <ExerciseItem 
          id="exercise-1"
          exercise={mockExercise} 
          {...mockHandlers} 
        />
      )
      
      const buttons = screen.getAllByRole('button')
      const editButton = buttons[1] // segundo botón es edit
      await user.click(editButton)
      
      expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockExercise)
      expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1)
    })

    test('calls onDelete when delete button is clicked', async () => {
      const user = userEvent.setup()
      
      render(
        <ExerciseItem 
          id="exercise-1"
          exercise={mockExercise} 
          {...mockHandlers} 
        />
      )
      
      const buttons = screen.getAllByRole('button')
      const deleteButton = buttons[2] // tercer botón es delete
      await user.click(deleteButton)
      
      expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockExercise)
      expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge cases', () => {
    test('handles exercise with empty name', () => {
      const emptyNameExercise: Exercise = {
        id: 3,
        name: '',
        completed: false
      }

      const { container } = render(
        <ExerciseItem 
          id="exercise-3"
          exercise={emptyNameExercise} 
          {...mockHandlers} 
        />
      )
      
      expect(container.querySelector('#exercise-3')).toBeInTheDocument()
    })

    test('handles exercise with very long name', () => {
      const longNameExercise: Exercise = {
        id: 4,
        name: 'This is a very long exercise name that should be handled properly without breaking the layout or functionality',
        completed: false
      }

      render(
        <ExerciseItem 
          id="exercise-4"
          exercise={longNameExercise} 
          {...mockHandlers} 
        />
      )
      
      expect(screen.getByText(longNameExercise.name)).toBeInTheDocument()
    })

    test('handles exercise with special characters in name', () => {
      const specialCharExercise: Exercise = {
        id: 5,
        name: 'Push-ups & Sit-ups (3x10) 💪',
        completed: true
      }

      render(
        <ExerciseItem 
          id="exercise-5"
          exercise={specialCharExercise} 
          {...mockHandlers} 
        />
      )
      
      expect(screen.getByText('Push-ups & Sit-ups (3x10) 💪')).toBeInTheDocument()
    })
  })
})