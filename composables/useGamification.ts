import { computed } from 'vue'
import { useTaskStore } from '../stores/task'

export const useGamification = () => {
  const store = useTaskStore()

  // Points and streaks
  const userStats = computed(() => store.userStats)
  const totalPoints = computed(() => store.userStats.totalPoints)
  const currentStreak = computed(() => store.userStats.currentStreak)
  const longestStreak = computed(() => store.userStats.longestStreak)

  // Badges
  const earnedBadges = computed(() => store.earnedBadges)
  const availableBadges = computed(() => store.availableBadges)
  const nextBadge = computed(() => {
    const available = store.availableBadges
    if (available.length === 0) return null
    
    // Find the closest badge to unlock
    return available.reduce((closest, badge) => {
      const currentProgress = getBadgeProgress(badge.id)
      const closestProgress = getBadgeProgress(closest.id)
      
      return currentProgress.percentage > closestProgress.percentage ? badge : closest
    })
  })

  // Badge progress calculation
  const getBadgeProgress = (badgeId: string) => {
    const badge = store.badges.find(b => b.id === badgeId)
    if (!badge) return { current: 0, target: 0, percentage: 0 }

    let current = 0
    const target = badge.requirement.value

    switch (badge.requirement.type) {
      case 'tasks':
        current = store.userStats.tasksCompleted
        break
      case 'points':
        current = store.userStats.totalPoints
        break
      case 'streak':
        current = store.userStats.currentStreak
        break
      case 'category_streak':
        current = store.userStats.categoryStreaks[badge.requirement.category!] || 0
        break
    }

    return {
      current,
      target,
      percentage: Math.min(100, (current / target) * 100)
    }
  }

  // Level system based on points
  const userLevel = computed(() => {
    const points = store.userStats.totalPoints
    return Math.floor(points / 100) + 1
  })

  const levelProgress = computed(() => {
    const points = store.userStats.totalPoints
    const currentLevelPoints = (userLevel.value - 1) * 100
    const nextLevelPoints = userLevel.value * 100
    const progressPoints = points - currentLevelPoints
    
    return {
      current: progressPoints,
      target: 100,
      percentage: (progressPoints / 100) * 100
    }
  })

  // Daily goal progress
  const dailyProgress = computed(() => store.dailyProgress)

  // Streak status
  const streakStatus = computed(() => {
    const streak = store.userStats.currentStreak
    if (streak === 0) return { message: 'Start your streak!', color: 'gray' }
    if (streak < 3) return { message: `${streak} day streak`, color: 'blue' }
    if (streak < 7) return { message: `${streak} days on fire! 🔥`, color: 'orange' }
    return { message: `${streak} days unstoppable! ⚡`, color: 'green' }
  })

  // Recent achievements
  const recentAchievements = computed(() => {
    return store.earnedBadges
      .filter(badge => badge.unlockedAt)
      .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
      .slice(0, 3)
  })

  return {
    // Stats
    userStats,
    totalPoints,
    currentStreak,
    longestStreak,
    userLevel,
    levelProgress,
    dailyProgress,
    streakStatus,

    // Badges
    earnedBadges,
    availableBadges,
    nextBadge,
    getBadgeProgress,
    recentAchievements,

    // Methods
    markTask: store.markTask,
    checkBadges: store.checkBadges
  }
}
