import { defineStore } from 'pinia'

export type Task = {
  id: string
  title: string
  category: string
  status: 'pending' | 'done' | 'missed'
  date: string // ISO date string for when the task is scheduled
  points?: number // Points earned for completion
  completedAt?: string // ISO timestamp when completed
}

export type Badge = {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt?: string
  requirement: {
    type: 'streak' | 'points' | 'tasks' | 'category_streak'
    value: number
    category?: string
  }
}

export type UserStats = {
  totalPoints: number
  currentStreak: number
  longestStreak: number
  tasksCompleted: number
  lastCompletedDate?: string
  categoryStreaks: Record<string, number>
  weeklyGoals: Record<string, number>
}

export type UserSettings = {
  dailyGoal: number
  weeklyGoals: Record<string, number>
  customCategories: Array<{
    name: string
    icon: string
    color: string
  }>
}

export type TaskState = {
  tasks: Task[]
  todaySuggestions: string[] // array of task ids
  userStats: UserStats
  badges: Badge[]
  unlockedBadges: string[]
  settings: UserSettings
}

function getTodayISO() {
  return new Date().toISOString().slice(0, 10)
}

const defaultBadges: Badge[] = [
  { id: 'first_task', name: 'Getting Started', description: 'Complete your first task', icon: '🎯', requirement: { type: 'tasks', value: 1 } },
  { id: 'streak_3', name: 'On Fire', description: 'Complete tasks 3 days in a row', icon: '🔥', requirement: { type: 'streak', value: 3 } },
  { id: 'streak_7', name: 'Week Warrior', description: 'Complete tasks 7 days in a row', icon: '⚔️', requirement: { type: 'streak', value: 7 } },
  { id: 'points_100', name: 'Century', description: 'Earn 100 points', icon: '💯', requirement: { type: 'points', value: 100 } },
  { id: 'health_streak', name: 'Health Champion', description: 'Complete health tasks 5 days in a row', icon: '🏥', requirement: { type: 'category_streak', value: 5, category: 'Health' } },
  { id: 'fitness_streak', name: 'Fitness Guru', description: 'Complete fitness tasks 7 days in a row', icon: '💪', requirement: { type: 'category_streak', value: 7, category: 'Fitness' } }
]

export const useTaskStore = defineStore('task', {
  state: (): TaskState => ({
    tasks: [],
    todaySuggestions: [],
    userStats: {
      totalPoints: 0,
      currentStreak: 0,
      longestStreak: 0,
      tasksCompleted: 0,
      categoryStreaks: {}
    },
    badges: defaultBadges,
    unlockedBadges: [],
    settings: {
      dailyGoal: 3,
      weeklyGoals: {},
      customCategories: [
        { name: 'Health', icon: '🏥', color: 'green' },
        { name: 'Fitness', icon: '💪', color: 'blue' },
        { name: 'Work', icon: '💼', color: 'gray' },
        { name: 'Study', icon: '📚', color: 'purple' },
        { name: 'Cleaning', icon: '🧹', color: 'yellow' },
        { name: 'Cooking', icon: '🍳', color: 'orange' },
        { name: 'Shopping', icon: '🛒', color: 'pink' },
        { name: 'Social', icon: '👥', color: 'indigo' },
        { name: 'Personal', icon: '👤', color: 'teal' },
        { name: 'Hobbies', icon: '🎨', color: 'red' }
      ]
    }
  }),
  actions: {
    addTask(task: Omit<Task, 'id'>) {
      const points = this.calculateTaskPoints(task.category)
      this.tasks.push({ 
        ...task, 
        id: crypto.randomUUID(),
        points 
      })
      this.save()
    },
    markTask(id: string, status: 'done' | 'missed' | 'pending') {
      const task = this.tasks.find(t => t.id === id)
      if (task) {
        const oldStatus = task.status
        task.status = status
        
        if (status === 'done' && oldStatus !== 'done') {
          task.completedAt = new Date().toISOString()
          this.updateUserStats(task)
          this.checkBadges()
        } else if (oldStatus === 'done' && status !== 'done') {
          // If unmarking a completed task, recalculate stats
          this.recalculateStats()
        }
        
        this.save()
      }
    },
    updateUserStats(completedTask: Task) {
      this.userStats.tasksCompleted++
      this.userStats.totalPoints += completedTask.points || 0
      
      // Update streaks
      const today = getTodayISO()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayISO = yesterday.toISOString().slice(0, 10)
      
      if (!this.userStats.lastCompletedDate || this.userStats.lastCompletedDate === yesterdayISO) {
        this.userStats.currentStreak++
      } else if (this.userStats.lastCompletedDate !== today) {
        this.userStats.currentStreak = 1
      }
      
      this.userStats.lastCompletedDate = today
      this.userStats.longestStreak = Math.max(this.userStats.longestStreak, this.userStats.currentStreak)
      
      // Update category streaks
      const category = completedTask.category
      if (!this.userStats.categoryStreaks[category]) {
        this.userStats.categoryStreaks[category] = 0
      }
      this.userStats.categoryStreaks[category]++
    },
    recalculateStats() {
      // Reset stats and recalculate from completed tasks
      this.userStats = {
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        tasksCompleted: 0,
        categoryStreaks: {}
      }
      
      const completedTasks = this.tasks
        .filter(t => t.status === 'done')
        .sort((a, b) => new Date(a.completedAt || a.date).getTime() - new Date(b.completedAt || b.date).getTime())
      
      for (const task of completedTasks) {
        this.updateUserStats(task)
      }
    },
    calculateTaskPoints(category: string): number {
      const basePoints = 10
      const categoryMultipliers: Record<string, number> = {
        'Health': 1.5,
        'Fitness': 1.5,
        'Study': 1.3,
        'Work': 1.2,
        'Cleaning': 1.1,
        'Cooking': 1.1,
        'Shopping': 1.0,
        'Social': 1.0,
        'Personal': 1.0,
        'Hobbies': 1.0
      }
      
      return Math.round(basePoints * (categoryMultipliers[category] || 1.0))
    },
    checkBadges() {
      for (const badge of this.badges) {
        if (this.unlockedBadges.includes(badge.id)) continue
        
        let unlocked = false
        
        switch (badge.requirement.type) {
          case 'tasks':
            unlocked = this.userStats.tasksCompleted >= badge.requirement.value
            break
          case 'points':
            unlocked = this.userStats.totalPoints >= badge.requirement.value
            break
          case 'streak':
            unlocked = this.userStats.currentStreak >= badge.requirement.value
            break
          case 'category_streak':
            const categoryStreak = this.userStats.categoryStreaks[badge.requirement.category!] || 0
            unlocked = categoryStreak >= badge.requirement.value
            break
        }
        
        if (unlocked) {
          this.unlockedBadges.push(badge.id)
          badge.unlockedAt = new Date().toISOString()
        }
      }
    },
    smartSuggestTasks(count = 3) {
      const today = getTodayISO()
      const availableTasks = this.tasks.filter(t => t.status === 'pending' && t.date === today)
      
      if (availableTasks.length <= count) {
        this.todaySuggestions = availableTasks.map(t => t.id)
        this.save()
        return
      }
      
      // Smart suggestion algorithm
      const suggestions: Task[] = []
      const categoryBalance: Record<string, number> = {}
      
      // Calculate category usage in last 7 days
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const recentTasks = this.tasks.filter(t => {
        const taskDate = new Date(t.date)
        return taskDate >= weekAgo && t.status === 'done'
      })
      
      recentTasks.forEach(task => {
        categoryBalance[task.category] = (categoryBalance[task.category] || 0) + 1
      })
      
      // Sort tasks by priority (less used categories first, then by points)
      const prioritizedTasks = availableTasks.sort((a, b) => {
        const aUsage = categoryBalance[a.category] || 0
        const bUsage = categoryBalance[b.category] || 0
        
        if (aUsage !== bUsage) return aUsage - bUsage
        return (b.points || 0) - (a.points || 0)
      })
      
      this.todaySuggestions = prioritizedTasks.slice(0, count).map(t => t.id)
      this.save()
    },
    suggestTodayTasks(count = 3) {
      // Fallback to simple random suggestions
      const today = getTodayISO()
      const available = this.tasks.filter(t => t.status === 'pending' && t.date === today)
      const shuffled = available.sort(() => Math.random() - 0.5)
      this.todaySuggestions = shuffled.slice(0, count).map(t => t.id)
      this.save()
    },
    save() {
      if (typeof window !== 'undefined') {
        localStorage.setItem('tasks', JSON.stringify(this.tasks))
        localStorage.setItem('todaySuggestions', JSON.stringify(this.todaySuggestions))
        localStorage.setItem('userStats', JSON.stringify(this.userStats))
        localStorage.setItem('unlockedBadges', JSON.stringify(this.unlockedBadges))
        localStorage.setItem('settings', JSON.stringify(this.settings))
      }
    },
    load() {
      if (typeof window !== 'undefined') {
        const t = localStorage.getItem('tasks')
        const s = localStorage.getItem('todaySuggestions')
        const stats = localStorage.getItem('userStats')
        const badges = localStorage.getItem('unlockedBadges')
        const settings = localStorage.getItem('settings')
        
        this.tasks = t ? JSON.parse(t) : []
        this.todaySuggestions = s ? JSON.parse(s) : []
        this.userStats = stats ? { ...this.userStats, ...JSON.parse(stats) } : this.userStats
        this.unlockedBadges = badges ? JSON.parse(badges) : []
        this.settings = settings ? { ...this.settings, ...JSON.parse(settings) } : this.settings
        
        // Initialize with sample tasks if empty
        if (this.tasks.length === 0) {
          this.initializeSampleTasks()
        }
      }
    },
    initializeSampleTasks() {
      const today = getTodayISO()
      const sampleTasks = [
        { title: 'Morning Exercise', category: 'Fitness', status: 'pending' as const, date: today },
        { title: 'Clean Kitchen', category: 'Cleaning', status: 'pending' as const, date: today },
        { title: 'Read for 30 minutes', category: 'Study', status: 'pending' as const, date: today },
        { title: 'Grocery Shopping', category: 'Shopping', status: 'pending' as const, date: today },
        { title: 'Drink 8 glasses of water', category: 'Health', status: 'pending' as const, date: today }
      ]
      
      sampleTasks.forEach(task => this.addTask(task))
      this.smartSuggestTasks(3)
    }
  },
  getters: {
    todayTasks(state) {
      const today = getTodayISO()
      return state.tasks.filter(t => t.date === today)
    },
    completedCount(state) {
      return state.tasks.filter(t => t.status === 'done').length
    },
    missedCount(state) {
      return state.tasks.filter(t => t.status === 'missed').length
    },
    weekProgress(state) {
      const now = new Date()
      const weekAgo = new Date(now)
      weekAgo.setDate(now.getDate() - 6)
      return state.tasks.filter(t => {
        const d = new Date(t.date)
        return d >= weekAgo && d <= now && t.status === 'done'
      }).length
    },
    suggestedTasks(state) {
      return state.todaySuggestions.map(id => state.tasks.find(t => t.id === id)).filter((task): task is Task => !!task)
    },
    availableBadges(state) {
      return state.badges.filter(badge => !state.unlockedBadges.includes(badge.id))
    },
    earnedBadges(state) {
      return state.badges.filter(badge => state.unlockedBadges.includes(badge.id))
    },
    dailyProgress(state) {
      const today = getTodayISO()
      const todayCompleted = state.tasks.filter(t => t.date === today && t.status === 'done').length
      return {
        completed: todayCompleted,
        goal: state.settings.dailyGoal,
        percentage: Math.min(100, (todayCompleted / state.settings.dailyGoal) * 100)
      }
    },
    categoryStats(state) {
      const stats: Record<string, { completed: number, total: number, points: number }> = {}
      
      state.tasks.forEach(task => {
        if (!stats[task.category]) {
          stats[task.category] = { completed: 0, total: 0, points: 0 }
        }
        const categoryData = stats[task.category]!
        categoryData.total++
        if (task.status === 'done') {
          categoryData.completed++
          categoryData.points += task.points || 0
        }
      })
      
      return stats
    },
    weeklyTrends(state) {
      const days = []
      const now = new Date()
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(now.getDate() - i)
        const dateStr = date.toISOString().slice(0, 10)
        
        const dayTasks = state.tasks.filter(t => t.date === dateStr)
        const completed = dayTasks.filter(t => t.status === 'done').length
        const total = dayTasks.length
        
        days.push({
          date: dateStr,
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          completed,
          total,
          percentage: total > 0 ? (completed / total) * 100 : 0
        })
      }
      
      return days
    }
  }
})
