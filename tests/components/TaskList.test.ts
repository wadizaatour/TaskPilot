import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import TaskList from '@/components/TaskList.vue'
import type { Task } from '@/stores/task'

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'First Task',
    category: 'Work',
    status: 'pending',
    date: '2025-09-09',
    points: 10
  },
  {
    id: '2',
    title: 'Second Task',
    category: 'Personal',
    status: 'done',
    date: '2025-09-09',
    points: 15,
    completedAt: '2025-09-09T10:00:00.000Z'
  },
  {
    id: '3',
    title: 'Third Task',
    category: 'Health',
    status: 'missed',
    date: '2025-09-09',
    points: 5
  }
]

describe('TaskList.vue', () => {
  it('renders a list of tasks', () => {
    render(TaskList, {
      props: {
        tasks: mockTasks
      }
    })

    expect(screen.getByText('First Task')).toBeInTheDocument()
    expect(screen.getByText('Second Task')).toBeInTheDocument()
    expect(screen.getByText('Third Task')).toBeInTheDocument()
  })

  it('displays correct number of tasks', () => {
    render(TaskList, {
      props: {
        tasks: mockTasks
      }
    })

    // Should have 3 task cards
    const taskCards = screen.getAllByRole('button', { name: /mark as|undo/i })
    expect(taskCards.length).toBeGreaterThanOrEqual(3)
  })

  it('renders empty state when no tasks provided', () => {
    render(TaskList, {
      props: {
        tasks: []
      }
    })

    expect(screen.getByText(/no tasks/i)).toBeInTheDocument()
  })

  it('emits update-status event when task status is updated', async () => {
    const { emitted } = render(TaskList, {
      props: {
        tasks: mockTasks
      }
    })

    // Find the mark done button for the first (pending) task
    const markDoneButtons = screen.getAllByRole('button', { name: /mark as done/i })
    if (markDoneButtons[0]) {
      await fireEvent.click(markDoneButtons[0])
    }

    expect(emitted()).toHaveProperty('update-status')
    expect(emitted()['update-status']?.[0]).toEqual(['1', 'done'])
  })

  it('displays different task statuses correctly', () => {
    render(TaskList, {
      props: {
        tasks: mockTasks
      }
    })

    // Check for different action buttons based on status
    expect(screen.getAllByRole('button', { name: /mark as done/i })).toHaveLength(2) // pending and missed tasks
    expect(screen.getAllByRole('button', { name: /reset to pending/i })).toHaveLength(2) // done and missed tasks
  })

  it('shows task categories correctly', () => {
    render(TaskList, {
      props: {
        tasks: mockTasks
      }
    })

    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getByText('Personal')).toBeInTheDocument()
    expect(screen.getByText('Health')).toBeInTheDocument()
  })

  it('updates when a task is marked done', async () => {
    const updatedTasks: Task[] = [...mockTasks]
    updatedTasks[0] = { 
      ...updatedTasks[0]!, 
      status: 'done', 
      completedAt: '2025-09-09T12:00:00.000Z' 
    } as Task

    const { rerender } = render(TaskList, {
      props: {
        tasks: mockTasks
      }
    })

    // Initially should have multiple mark done buttons
    expect(screen.getAllByRole('button', { name: /mark as done/i })).toHaveLength(2)

    // Update props to mark first task as done
    await rerender({
      tasks: updatedTasks
    })

    // Should now have one less mark done button and one more reset button
    expect(screen.getAllByRole('button', { name: /mark as done/i })).toHaveLength(1)
    expect(screen.getAllByRole('button', { name: /reset to pending/i })).toHaveLength(3)
  })

  it('handles single task correctly', () => {
    const singleTask: Task[] = [mockTasks[0]!]

    render(TaskList, {
      props: {
        tasks: singleTask
      }
    })

    expect(screen.getByText('First Task')).toBeInTheDocument()
    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /mark as done/i })).toHaveLength(1)
  })

  it('displays task information correctly', () => {
    render(TaskList, {
      props: {
        tasks: mockTasks
      }
    })

    // Check that task titles are displayed (points not shown in current implementation)
    expect(screen.getByText('First Task')).toBeInTheDocument()
    expect(screen.getByText('Second Task')).toBeInTheDocument()
    expect(screen.getByText('Third Task')).toBeInTheDocument()
  })

  it('displays correct status styling', () => {
    const { container } = render(TaskList, {
      props: {
        tasks: mockTasks
      }
    })

    // Check for status indicator colors based on task status
    expect(container.querySelector('.bg-yellow-500')).toBeTruthy() // pending
    expect(container.querySelector('.bg-green-500')).toBeTruthy() // done
    expect(container.querySelector('.bg-red-500')).toBeTruthy() // missed
  })

  it('maintains task order', () => {
    render(TaskList, {
      props: {
        tasks: mockTasks
      }
    })

    const taskTitles = screen.getAllByText(/Task/)
    expect(taskTitles[0]).toHaveTextContent('First Task')
    expect(taskTitles[1]).toHaveTextContent('Second Task')
    expect(taskTitles[2]).toHaveTextContent('Third Task')
  })
})
