import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import TaskCard from '@/components/TaskCard.vue'
import type { Task } from '@/stores/task'

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  category: 'Test',
  status: 'pending',
  date: '2025-09-09',
  points: 10
}

const completedTask: Task = {
  ...mockTask,
  id: '2',
  title: 'Completed Task',
  status: 'done',
  completedAt: '2025-09-09T10:00:00.000Z'
}

const missedTask: Task = {
  ...mockTask,
  id: '3',
  title: 'Missed Task',
  status: 'missed'
}

describe('TaskCard.vue', () => {
  it('renders task title correctly', () => {
    render(TaskCard, {
      props: {
        task: mockTask
      }
    })

    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('shows pending status correctly', () => {
    render(TaskCard, {
      props: {
        task: mockTask
      }
    })

    // Should show mark done button for pending tasks
    const markDoneButton = screen.getByRole('button', { name: /mark as done/i })
    expect(markDoneButton).toBeInTheDocument()
  })

  it('shows completed status correctly', () => {
    render(TaskCard, {
      props: {
        task: completedTask
      }
    })

    // Should show reset to pending button for completed tasks
    const resetButton = screen.getByRole('button', { name: /reset to pending/i })
    expect(resetButton).toBeInTheDocument()
  })

  it('shows missed status correctly', () => {
    render(TaskCard, {
      props: {
        task: missedTask
      }
    })

    // Should show reset to pending button for missed tasks
    const resetButton = screen.getByRole('button', { name: /reset to pending/i })
    expect(resetButton).toBeInTheDocument()
  })

  it('emits update-status event when marking task as done', async () => {
    const { emitted } = render(TaskCard, {
      props: {
        task: mockTask
      }
    })

    const markDoneButton = screen.getByRole('button', { name: /mark as done/i })
    await fireEvent.click(markDoneButton)

    expect(emitted()).toHaveProperty('update-status')
    expect(emitted()['update-status']?.[0]).toEqual(['done'])
  })

  it('emits update-status event when marking task as missed', async () => {
    const { emitted } = render(TaskCard, {
      props: {
        task: mockTask
      }
    })

    const markMissedButton = screen.getByRole('button', { name: /mark as missed/i })
    await fireEvent.click(markMissedButton)

    expect(emitted()).toHaveProperty('update-status')
    expect(emitted()['update-status']?.[0]).toEqual(['missed'])
  })

  it('emits update-status event when resetting completed task', async () => {
    const { emitted } = render(TaskCard, {
      props: {
        task: completedTask
      }
    })

    const resetButton = screen.getByRole('button', { name: /reset to pending/i })
    await fireEvent.click(resetButton)

    expect(emitted()).toHaveProperty('update-status')
    expect(emitted()['update-status']?.[0]).toEqual(['pending'])
  })

  it('emits update-status event when resetting missed task', async () => {
    const { emitted } = render(TaskCard, {
      props: {
        task: missedTask
      }
    })

    const resetButton = screen.getByRole('button', { name: /reset to pending/i })
    await fireEvent.click(resetButton)

    expect(emitted()).toHaveProperty('update-status')
    expect(emitted()['update-status']?.[0]).toEqual(['pending'])
  })

  it('displays the correct date formatting', () => {
    render(TaskCard, {
      props: {
        task: mockTask
      }
    })

    // Should display "Today" for today's date
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('applies correct CSS classes for different statuses', () => {
    const { container: pendingContainer } = render(TaskCard, {
      props: {
        task: mockTask
      }
    })

    const { container: completedContainer } = render(TaskCard, {
      props: {
        task: completedTask
      }
    })

    // Task status should be displayed correctly
    expect(pendingContainer.querySelector('.text-yellow-700')).toBeTruthy()
    expect(completedContainer.querySelector('.text-green-700')).toBeTruthy()
  })

  it('displays task information correctly', () => {
    render(TaskCard, {
      props: {
        task: mockTask
      }
    })

    // Should show basic task information (points not displayed in current implementation)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
    expect(screen.getByText('pending')).toBeInTheDocument()
  })
})
