import '@testing-library/jest-dom'
import { beforeEach, vi } from 'vitest'

beforeEach(() => {
  vi.clearAllMocks()
})

const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})