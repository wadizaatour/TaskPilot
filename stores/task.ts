import { defineStore } from 'pinia'

export type Task = {
  id: string
  title: string
  category: string
  status: 'pending' | 'done' | 'missed'
  date: string // ISO date string for when the task is scheduled
}

export type TaskState = {
  tasks: Task[]
  todaySuggestions: string[] // array of task ids
}

function getTodayISO() {
  return new Date().toISOString().slice(0, 10)
}

export const useTaskStore = defineStore('task', {
  state: (): TaskState => ({
    tasks: [],
    todaySuggestions: []
  }),
  actions: {
    addTask(task: Omit<Task, 'id'>) {
      this.tasks.push({ ...task, id: crypto.randomUUID() })
      this.save()
    },
    markTask(id: string, status: 'done' | 'missed' | 'pending') {
      const t = this.tasks.find(t => t.id === id)
      if (t) {
        t.status = status
        this.save()
      }
    },
    suggestTodayTasks(count = 3) {
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
      }
    },
    load() {
      if (typeof window !== 'undefined') {
        const t = localStorage.getItem('tasks')
        const s = localStorage.getItem('todaySuggestions')
        this.tasks = t ? JSON.parse(t) : []
        this.todaySuggestions = s ? JSON.parse(s) : []
        
        // Initialize with sample tasks if empty
        if (this.tasks.length === 0) {
          this.initializeSampleTasks()
        }
      }
    },
    initializeSampleTasks() {
      const today = getTodayISO()
      const sampleTasks = [
        { title: 'Morning Exercise', category: 'Sports', status: 'pending' as const, date: today },
        { title: 'Clean Kitchen', category: 'Cleaning', status: 'pending' as const, date: today },
        { title: 'Read for 30 minutes', category: 'Study', status: 'pending' as const, date: today },
        { title: 'Grocery Shopping', category: 'Shopping', status: 'pending' as const, date: today },
        { title: 'Drink 8 glasses of water', category: 'Health', status: 'pending' as const, date: today }
      ]
      
      sampleTasks.forEach(task => this.addTask(task))
      this.suggestTodayTasks(3)
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
    }
  }
})
