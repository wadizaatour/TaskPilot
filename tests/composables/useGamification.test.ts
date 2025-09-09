import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGamification } from '@/composables/useGamification'
import { useTaskStore } from '@/stores/task'
import type { Task, UserStats, Badge } from '@/stores/task'

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
    title: 'Code Review',
    category: 'Work',
    status: 'done',
    date: '2025-09-09',
    points: 15,
    completedAt: '2025-09-09T10:00:00.000Z'
  },
  {
    id: '3',
    title: 'Read Documentation',
    category: 'Learning',
    status: 'done',
    date: '2025-09-08',
    points: 10,
    completedAt: '2025-09-08T20:00:00.000Z'
  },
  {
    id: '4',
    title: 'Team Meeting',
    category: 'Work',
    status: 'missed',
    date: '2025-09-09',
    points: 5
  },
  {
    id: '5',
    title: 'Grocery Shopping',
    category: 'Personal',
    status: 'pending',
    date: '2025-09-10',
    points: 8
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
    'Learning': 2
  },
  weeklyGoals: {
    'Health': 5,
    'Work': 10,
    'Learning': 3
  }
}

const mockBadges: Badge[] = [
  {
    id: 'first_task',
    name: 'Getting Started',
    description: 'Complete your first task',
    icon: '🎯',
    unlockedAt: '2025-09-01T10:00:00.000Z',
    requirement: {
      type: 'tasks',
      value: 1
    }
  },
  {
    id: 'streak_5',
    name: 'Consistent',
    description: 'Maintain a 5-day streak',
    icon: '🔥',
    unlockedAt: '2025-09-09T10:00:00.000Z',
    requirement: {
      type: 'streak',
      value: 5
    }
  },
  {
    id: 'points_100',
    name: 'Century',
    description: 'Earn 100 points',
    icon: '💯',
    requirement: {
      type: 'points',
      value: 100
    }
  }
]

const mockAvailableBadges: Badge[] = [
  {
    id: 'streak_10',
    name: 'Dedicated',
    description: 'Maintain a 10-day streak',
    icon: '⚡',
    requirement: {
      type: 'streak',
      value: 10
    }
  },
  {
    id: 'health_streak_5',
    name: 'Health Champion',
    description: 'Complete 5 health tasks in a row',
    icon: '💪',
    requirement: {
      type: 'category_streak',
      value: 5,
      category: 'Health'
    }
  }
]

describe('useGamification composable', () => {
  let store: ReturnType<typeof useTaskStore>
  let gamification: ReturnType<typeof useGamification>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useTaskStore()
    
    // Mock store data
    store.tasks = mockTasks
    store.userStats = mockUserStats
    
    // Mock store getters
    vi.spyOn(store, 'earnedBadges', 'get').mockReturnValue(mockBadges.filter(b => b.unlockedAt))
    vi.spyOn(store, 'availableBadges', 'get').mockReturnValue(mockAvailableBadges)
    vi.spyOn(store, 'badges', 'get').mockReturnValue([...mockBadges, ...mockAvailableBadges])
    
    // Mock store methods
    store.markTask = vi.fn()
    store.checkBadges = vi.fn()
    
    gamification = useGamification()
  })

  describe('User Stats', () => {
    it('returns correct user statistics', () => {
      expect(gamification.userStats.value).toEqual(mockUserStats)
    })

    it('calculates total points correctly', () => {
      expect(gamification.totalPoints.value).toBe(150)
    })

    it('tracks current streak correctly', () => {
      expect(gamification.currentStreak.value).toBe(5)
    })

    it('tracks longest streak correctly', () => {
      expect(gamification.longestStreak.value).toBe(12)
    })
  })

  describe('Level System', () => {
    it('calculates user level correctly based on points', () => {
      // Level = floor(150 / 100) + 1 = 2
      expect(gamification.userLevel.value).toBe(2)
    })

    it('calculates level progress correctly', () => {
      const progress = gamification.levelProgress.value
      
      // Points in current level: 150 - (1 * 100) = 50
      expect(progress.current).toBe(50)
      expect(progress.target).toBe(100)
      expect(progress.percentage).toBe(50)
    })

    it('handles level progression correctly for different point values', () => {
      // Mock different point values
      vi.spyOn(store, 'userStats', 'get').mockReturnValue({
        ...mockUserStats,
        totalPoints: 250
      })

      const level = gamification.userLevel.value
      const progress = gamification.levelProgress.value

      // Level = floor(250 / 100) + 1 = 3
      expect(level).toBe(3)
      // Points in level: 250 - (2 * 100) = 50
      expect(progress.current).toBe(50)
    })
  })

  describe('Badge System', () => {
    it('returns earned badges correctly', () => {
      const earnedBadges = gamification.earnedBadges.value
      expect(earnedBadges).toHaveLength(2)
      expect(earnedBadges.every(badge => badge.unlockedAt)).toBe(true)
    })

    it('returns available badges correctly', () => {
      const availableBadges = gamification.availableBadges.value
      expect(availableBadges).toEqual(mockAvailableBadges)
    })

    it('calculates badge progress correctly', () => {
      const streakBadgeProgress = gamification.getBadgeProgress('streak_10')
      
      // Current streak is 5, target is 10
      expect(streakBadgeProgress.current).toBe(5)
      expect(streakBadgeProgress.target).toBe(10)
      expect(streakBadgeProgress.percentage).toBe(50)
    })

    it('calculates points badge progress correctly', () => {
      const pointsBadgeProgress = gamification.getBadgeProgress('points_100')
      
      // Current points 150, target 100 (should be 100% since achieved)
      expect(pointsBadgeProgress.current).toBe(150)
      expect(pointsBadgeProgress.target).toBe(100)
      expect(pointsBadgeProgress.percentage).toBe(100)
    })

    it('calculates category streak badge progress correctly', () => {
      const categoryBadgeProgress = gamification.getBadgeProgress('health_streak_5')
      
      // Health streak is 3, target is 5
      expect(categoryBadgeProgress.current).toBe(3)
      expect(categoryBadgeProgress.target).toBe(5)
      expect(categoryBadgeProgress.percentage).toBe(60)
    })

    it('returns next badge to unlock', () => {
      const nextBadge = gamification.nextBadge.value
      expect(nextBadge).toBeDefined()
      expect(nextBadge?.unlockedAt).toBeUndefined()
    })

    it('handles badges with different requirement types', () => {
      const tasksBadgeProgress = gamification.getBadgeProgress('first_task')
      
      // Tasks completed is 25, target is 1
      expect(tasksBadgeProgress.current).toBe(25)
      expect(tasksBadgeProgress.target).toBe(1)
      expect(tasksBadgeProgress.percentage).toBe(100)
    })
  })

  describe('Streak Status', () => {
    it('shows correct streak status for no streak', () => {
      vi.spyOn(store, 'userStats', 'get').mockReturnValue({
        ...mockUserStats,
        currentStreak: 0
      })

      const status = gamification.streakStatus.value
      expect(status.message).toBe('Start your streak!')
      expect(status.color).toBe('gray')
    })

    it('shows correct streak status for short streak', () => {
      vi.spyOn(store, 'userStats', 'get').mockReturnValue({
        ...mockUserStats,
        currentStreak: 2
      })

      const status = gamification.streakStatus.value
      expect(status.message).toBe('2 day streak')
      expect(status.color).toBe('blue')
    })

    it('shows correct streak status for medium streak', () => {
      vi.spyOn(store, 'userStats', 'get').mockReturnValue({
        ...mockUserStats,
        currentStreak: 5
      })

      const status = gamification.streakStatus.value
      expect(status.message).toBe('5 days on fire! 🔥')
      expect(status.color).toBe('orange')
    })

    it('shows correct streak status for long streak', () => {
      vi.spyOn(store, 'userStats', 'get').mockReturnValue({
        ...mockUserStats,
        currentStreak: 10
      })

      const status = gamification.streakStatus.value
      expect(status.message).toBe('10 days unstoppable! ⚡')
      expect(status.color).toBe('green')
    })
  })

  describe('Recent Achievements', () => {
    it('returns recent achievements sorted by date', () => {
      const recentAchievements = gamification.recentAchievements.value
      expect(recentAchievements).toHaveLength(2)
      
      // Should be sorted by most recent first
      expect(recentAchievements[0]?.unlockedAt).toBe('2025-09-09T10:00:00.000Z')
      expect(recentAchievements[1]?.unlockedAt).toBe('2025-09-01T10:00:00.000Z')
    })

    it('limits recent achievements to 3', () => {
      const manyBadges = Array.from({ length: 5 }, (_, i) => ({
        ...mockBadges[0]!,
        id: `badge_${i}`,
        unlockedAt: `2025-09-0${i + 1}T10:00:00.000Z`
      }))

      vi.spyOn(store, 'earnedBadges', 'get').mockReturnValue(manyBadges)

      const recentAchievements = gamification.recentAchievements.value
      expect(recentAchievements).toHaveLength(3)
    })
  })

  describe('Methods', () => {
    it('calls store markTask method correctly', () => {
      gamification.markTask('task-1', 'done')
      expect(store.markTask).toHaveBeenCalledWith('task-1', 'done')
    })

    it('calls store checkBadges method correctly', () => {
      gamification.checkBadges()
      expect(store.checkBadges).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('handles missing badge gracefully', () => {
      const progress = gamification.getBadgeProgress('non-existent-badge')
      expect(progress.current).toBe(0)
      expect(progress.target).toBe(0)
      expect(progress.percentage).toBe(0)
    })

    it('handles empty available badges', () => {
      vi.spyOn(store, 'availableBadges', 'get').mockReturnValue([])
      
      const nextBadge = gamification.nextBadge.value
      expect(nextBadge).toBe(null)
    })

    it('handles category badge without category streak data', () => {
      const progress = gamification.getBadgeProgress('health_streak_5')
      expect(progress.current).toBe(3) // Should get from categoryStreaks
    })
  })
})
