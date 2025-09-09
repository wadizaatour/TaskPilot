import { computed } from 'vue'
import { useTaskStore } from '../stores/task'

export const useAnalytics = () => {
  const store = useTaskStore()

  // Weekly trends
  const weeklyTrends = computed(() => store.weeklyTrends)

  // Category statistics
  const categoryStats = computed(() => store.categoryStats)

  // Top performing categories
  const topCategories = computed(() => {
    const stats = store.categoryStats
    return Object.entries(stats)
      .map(([category, data]) => ({
        category,
        ...data,
        completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0
      }))
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 5)
  })

  // Performance metrics
  const performanceMetrics = computed(() => {
    const totalTasks = store.tasks.length
    const completedTasks = store.tasks.filter(t => t.status === 'done').length
    const missedTasks = store.tasks.filter(t => t.status === 'missed').length
    
    return {
      totalTasks,
      completedTasks,
      missedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
      missRate: totalTasks > 0 ? (missedTasks / totalTasks) * 100 : 0
    }
  })

  // Weekly goal progress
  const weeklyGoalProgress = computed(() => {
    const goals = store.settings.weeklyGoals
    const stats = store.categoryStats
    const progress: Record<string, { current: number, goal: number, percentage: number }> = {}

    Object.entries(goals).forEach(([category, goal]) => {
      const current = stats[category]?.completed || 0
      progress[category] = {
        current,
        goal,
        percentage: goal > 0 ? Math.min(100, (current / goal) * 100) : 0
      }
    })

    return progress
  })

  // Streak calendar data (last 30 days)
  const streakCalendar = computed(() => {
    const days = []
    const now = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(now.getDate() - i)
      const dateStr = date.toISOString().slice(0, 10)
      
      const dayTasks = store.tasks.filter(t => t.date === dateStr)
      const completed = dayTasks.filter(t => t.status === 'done').length
      const total = dayTasks.length
      
      days.push({
        date: dateStr,
        completed,
        total,
        hasActivity: total > 0,
        completionRate: total > 0 ? (completed / total) * 100 : 0,
        intensity: total > 0 ? Math.min(4, Math.ceil((completed / total) * 4)) : 0
      })
    }
    
    return days
  })

  // Monthly summary
  const monthlySummary = computed(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthTasks = store.tasks.filter(t => {
      const taskDate = new Date(t.date)
      return taskDate >= firstDay && taskDate <= now
    })

    const completed = monthTasks.filter(t => t.status === 'done').length
    const total = monthTasks.length
    const points = monthTasks
      .filter(t => t.status === 'done')
      .reduce((sum, task) => sum + (task.points || 0), 0)

    return {
      month: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      completed,
      total,
      points,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    }
  })

  // Calendar days for current month
  const calendarDays = computed(() => {
    const days = []
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    
    // Add empty days for proper calendar alignment
    const startDay = startOfMonth.getDay()
    for (let i = 0; i < startDay; i++) {
      days.push({
        dayNumber: '',
        date: '',
        hasData: false,
        completed: 0,
        total: 0,
        completionRate: 0
      })
    }
    
    // Add actual month days
    for (let day = 1; day <= endOfMonth.getDate(); day++) {
      const date = new Date(today.getFullYear(), today.getMonth(), day)
      const dateStr = date.toISOString().slice(0, 10)
      
      const dayTasks = store.tasks.filter(task => task.date === dateStr)
      const completed = dayTasks.filter(task => task.status === 'done').length
      const total = dayTasks.length
      
      days.push({
        dayNumber: day.toString(),
        date: dateStr,
        hasData: total > 0,
        completed,
        total,
        completionRate: total > 0 ? (completed / total) * 100 : 0
      })
    }
    
    return days
  })

  // Current month name
  const currentMonth = computed(() => {
    const today = new Date()
    return today.toLocaleDateString('en', { month: 'long', year: 'numeric' })
  })

  // Streak information
  const streakInfo = computed(() => {
    const today = new Date()
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    
    // Check last 100 days for streak calculation
    for (let i = 0; i < 100; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().slice(0, 10)
      
      const dayTasks = store.tasks.filter(task => task.date === dateStr)
      const hasCompletedTasks = dayTasks.some(task => task.status === 'done')
      
      if (hasCompletedTasks) {
        tempStreak++
        if (i === 0 || currentStreak === i) {
          currentStreak = tempStreak
        }
      } else {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak
        }
        tempStreak = 0
        if (i === 0) {
          currentStreak = 0
        }
      }
    }
    
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak
    }
    
    return {
      current: currentStreak,
      longest: longestStreak
    }
  })

  return {
    weeklyTrends,
    categoryStats,
    topCategories,
    performanceMetrics,
    weeklyGoalProgress,
    streakCalendar,
    monthlySummary,
    calendarDays,
    currentMonth,
    streakInfo
  }
}
