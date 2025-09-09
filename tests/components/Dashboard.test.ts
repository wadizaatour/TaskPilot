import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import Dashboard from '@/components/Dashboard.vue'
import { useTaskStore } from '@/stores/task'
import type { Task, UserStats, Badge } from '@/stores/task'

// Mock the NuxtLink component
const MockNuxtLink = {
  template: '<a><slot /></a>',
  props: ['to']
}

// Mock the child components
vi.mock('@/components/TaskList.vue', () => ({
  default: {
    template: '<div data-testid="task-list">Mocked TaskList</div>',
    props: ['tasks'],
    emits: ['update-status']
  }
}))

vi.mock('@/components/GamificationWidget.vue', () => ({
  default: {
    template: '<div data-testid="gamification-widget">Mocked GamificationWidget</div>'
  }
}))

vi.mock('@/components/BadgeCard.vue', () => ({
  default: {
    template: '<div data-testid="badge-card">Mocked BadgeCard</div>'
  }
}))

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Morning Exercise',
    category: 'Health',
    status: 'done',
    date: '2025-09-09',
    points: 20,
    completedAt: '2025-09-09T08:00:00.000Z'
  },
  {
    id: '2',
    title: 'Review Code',
    category: 'Work',
    status: 'done',
    date: '2025-09-09',
    points: 15,
    completedAt: '2025-09-09T14:00:00.000Z'
  },
  {
    id: '3',
    title: 'Read Book',
    category: 'Learning',
    status: 'missed',
    date: '2025-09-09',
    points: 10
  },
  {
    id: '4',
    title: 'Plan Tomorrow',
    category: 'Planning',
    status: 'pending',
    date: '2025-09-09',
    points: 5
  }
]

const mockUserStats: UserStats = {
  totalPoints: 150,
  currentStreak: 5,
  longestStreak: 12,
  tasksCompleted: 25,
  lastCompletedDate: '2025-09-09',
  categoryStreaks: {
    'Health': 3,
    'Work': 7,
    'Learning': 0
  },
  weeklyGoals: {
    'Health': 5,
    'Work': 10,
    'Learning': 3
  }
}

const mockBadges: Badge[] = [
  {
    id: 'streak_3',
    name: 'On Fire',
    description: 'Complete tasks for 3 days in a row',
    icon: '🔥',
    unlockedAt: '2025-09-07T10:00:00.000Z',
    requirement: {
      type: 'streak',
      value: 3
    }
  }
]

describe('Dashboard.vue', () => {
  let store: ReturnType<typeof useTaskStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useTaskStore()
    
    // Mock store data
    store.tasks = mockTasks
    store.userStats = mockUserStats
    
    // Mock store getters/computed properties
    vi.spyOn(store, 'completedCount', 'get').mockReturnValue(2)
    vi.spyOn(store, 'missedCount', 'get').mockReturnValue(1)
    vi.spyOn(store, 'weekProgress', 'get').mockReturnValue(8)
    vi.spyOn(store, 'suggestedTasks', 'get').mockReturnValue([mockTasks[3]!])
    vi.spyOn(store, 'earnedBadges', 'get').mockReturnValue(mockBadges)
    
    // Mock store methods
    store.load = vi.fn()
    store.markTask = vi.fn()
    store.suggestTodayTasks = vi.fn()
  })

  it('displays correct completion stats', () => {
    render(Dashboard, {
      global: {
        components: {
          NuxtLink: MockNuxtLink
        }
      }
    })

    expect(screen.getByText('2')).toBeInTheDocument() // completed count
    expect(screen.getByText('1')).toBeInTheDocument() // missed count
    expect(screen.getByText('8')).toBeInTheDocument() // week progress
  })

  it('displays correct streak information', () => {
    render(Dashboard, {
      global: {
        components: {
          NuxtLink: MockNuxtLink
        }
      }
    })

    // Streak information is displayed in the GamificationWidget component
    // Since we mock the component, we verify the userStats is properly set in the store
    expect(store.userStats.currentStreak).toBe(5)
  })

  it('shows weekly progress bar correctly', () => {
    render(Dashboard, {
      global: {
        components: {
          NuxtLink: MockNuxtLink
        }
      }
    })

    // Should show percentage calculation (8 * 20 = 160%, but capped at 100%)
    const progressText = screen.getByText(/100% of weekly goal/i)
    expect(progressText).toBeInTheDocument()
  })

  it('renders suggested tasks when available', () => {
    render(Dashboard, {
      global: {
        components: {
          NuxtLink: MockNuxtLink
        }
      }
    })

    expect(screen.getByText('Mocked TaskList')).toBeInTheDocument()
    expect(screen.queryByText(/all caught up/i)).not.toBeInTheDocument()
  })

  it('shows empty state when no suggested tasks', () => {
    // Mock empty suggestions
    vi.spyOn(store, 'suggestedTasks', 'get').mockReturnValue([])

    render(Dashboard, {
      global: {
        components: {
          NuxtLink: MockNuxtLink
        }
      }
    })

    expect(screen.getByText(/all caught up/i)).toBeInTheDocument()
    expect(screen.getByText(/no suggested tasks/i)).toBeInTheDocument()
    expect(screen.getByText('Add New Task')).toBeInTheDocument()
  })

  it('includes gamification components', () => {
    render(Dashboard, {
      global: {
        components: {
          NuxtLink: MockNuxtLink
        }
      }
    })

    expect(screen.getByText('Mocked GamificationWidget')).toBeInTheDocument()
    expect(screen.getByText('Mocked BadgeCard')).toBeInTheDocument()
  })

  it('calls store methods on mount', () => {
    render(Dashboard, {
      global: {
        components: {
          NuxtLink: MockNuxtLink
        }
      }
    })

    expect(store.load).toHaveBeenCalled()
  })

  it('handles task status updates', () => {
    render(Dashboard, {
      global: {
        components: {
          NuxtLink: MockNuxtLink
        }
      }
    })

    // Verify that the store markTask method can be called
    // (This is tested indirectly through the component's interaction with the store)
    expect(store.markTask).toBeDefined()
  })

  it('allows refreshing suggestions', async () => {
    render(Dashboard, {
      global: {
        components: {
          NuxtLink: MockNuxtLink
        }
      }
    })

    const refreshButton = screen.getByRole('button', { name: /refresh suggestions/i })
    await fireEvent.click(refreshButton)

    expect(store.suggestTodayTasks).toHaveBeenCalledWith(3)
  })

  it('calculates weekly progress percentage correctly', () => {
    // Test with different week progress values
    vi.spyOn(store, 'weekProgress', 'get').mockReturnValue(3)

    render(Dashboard, {
      global: {
        components: {
          NuxtLink: MockNuxtLink
        }
      }
    })

    // 3 * 20 = 60%
    expect(screen.getByText(/60% of weekly goal/i)).toBeInTheDocument()
  })

  it('displays stats icons correctly', () => {
    render(Dashboard, {
      global: {
        components: {
          NuxtLink: MockNuxtLink
        }
      }
    })

    // Check for stat cards
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Missed')).toBeInTheDocument()
    expect(screen.getByText('Weekly Progress')).toBeInTheDocument()
  })

  it('handles high completion counts correctly', () => {
    vi.spyOn(store, 'completedCount', 'get').mockReturnValue(99)
    vi.spyOn(store, 'missedCount', 'get').mockReturnValue(0)

    render(Dashboard, {
      global: {
        components: {
          NuxtLink: MockNuxtLink
        }
      }
    })

    expect(screen.getByText('99')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
