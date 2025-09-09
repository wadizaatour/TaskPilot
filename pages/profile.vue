<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Profile</h1>
          <p class="text-sm text-gray-600 mt-1">Customize your experience</p>
        </div>
        <button 
          @click="saveSettings"
          class="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>

    <div class="px-4 sm:px-6 py-6 space-y-6">
      <!-- User Stats Card -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h2 class="text-xl font-bold">{{ userName }}</h2>
            <p class="text-blue-100">Level {{ currentLevel }} • {{ currentPoints }} points</p>
          </div>
        </div>
        
        <!-- Achievement Summary -->
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold">{{ userStats.tasksCompleted }}</div>
            <div class="text-sm text-blue-100">Tasks Done</div>
          </div>
          <div>
            <div class="text-2xl font-bold">{{ userStats.currentStreak }}</div>
            <div class="text-sm text-blue-100">Current Streak</div>
          </div>
          <div>
            <div class="text-2xl font-bold">{{ earnedBadgesCount }}</div>
            <div class="text-sm text-blue-100">Badges Earned</div>
          </div>
        </div>
      </div>

      <!-- Personal Settings -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Personal Settings</h3>
        
        <div class="space-y-4">
          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
            <input 
              v-model="settings.userName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <!-- Daily Goal -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Daily Task Goal ({{ settings.dailyGoal }} tasks)
            </label>
            <input 
              v-model="settings.dailyGoal"
              type="range"
              min="1"
              max="20"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          <!-- Notification Preferences -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Preferences</label>
            <div class="space-y-3">
              <label class="flex items-center">
                <input 
                  v-model="settings.smartSuggestions"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Enable smart task suggestions</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="settings.streakReminders"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Show streak reminders</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="settings.badgeNotifications"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">Badge unlock notifications</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Categories -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Task Categories</h3>
          <button 
            @click="addCategory"
            class="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            + Add Category
          </button>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            v-for="(category, index) in settings.categories" 
            :key="index"
            class="p-4 border border-gray-200 rounded-xl"
          >
            <div class="flex items-center gap-3 mb-3">
              <button 
                @click="category.showEmojiPicker = !category.showEmojiPicker"
                class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl hover:bg-gray-200 transition-colors"
              >
                {{ category.icon }}
              </button>
              <input 
                v-model="category.name"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Category name"
              />
              <button 
                @click="removeCategory(index)"
                class="text-red-500 hover:text-red-600 p-1"
              >
                ×
              </button>
            </div>

            <!-- Color picker -->
            <div class="flex gap-2 mb-3">
              <button 
                v-for="color in colorOptions" 
                :key="color"
                @click="category.color = color"
                :class="[
                  'w-6 h-6 rounded-full border-2 transition-all',
                  category.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                ]"
                :style="{ backgroundColor: color }"
              ></button>
            </div>

            <!-- Weekly Goal -->
            <div>
              <label class="block text-xs text-gray-600 mb-1">
                Weekly Goal: {{ category.weeklyGoal }} tasks
              </label>
              <input 
                v-model="category.weeklyGoal"
                type="range"
                min="0"
                max="14"
                class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <!-- Emoji Picker -->
            <div 
              v-if="category.showEmojiPicker"
              class="mt-3 p-3 bg-gray-50 rounded-lg grid grid-cols-6 gap-2"
            >
              <button 
                v-for="emoji in emojiOptions" 
                :key="emoji"
                @click="selectEmoji(category, emoji)"
                class="w-8 h-8 text-lg hover:bg-gray-200 rounded transition-colors"
              >
                {{ emoji }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Theme Settings -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
        
        <div class="space-y-4">
          <!-- Theme Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">Theme</label>
            <div class="grid grid-cols-2 gap-3">
              <label class="relative">
                <input 
                  v-model="settings.theme"
                  type="radio"
                  value="light"
                  class="sr-only"
                />
                <div 
                  :class="[
                    'p-4 border-2 rounded-xl cursor-pointer transition-all',
                    settings.theme === 'light' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 bg-white border border-gray-300 rounded"></div>
                    <span class="font-medium">Light</span>
                  </div>
                </div>
              </label>
              
              <label class="relative">
                <input 
                  v-model="settings.theme"
                  type="radio"
                  value="dark"
                  class="sr-only"
                />
                <div 
                  :class="[
                    'p-4 border-2 rounded-xl cursor-pointer transition-all',
                    settings.theme === 'dark' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-6 h-6 bg-gray-800 border border-gray-600 rounded"></div>
                    <span class="font-medium">Dark</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Management -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <div class="font-medium text-gray-900">Export Data</div>
              <div class="text-sm text-gray-600">Download your tasks and progress</div>
            </div>
            <button 
              @click="exportData"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Export
            </button>
          </div>
          
          <div class="flex items-center justify-between p-4 bg-red-50 rounded-xl">
            <div>
              <div class="font-medium text-red-900">Reset All Data</div>
              <div class="text-sm text-red-600">This will delete all your tasks and progress</div>
            </div>
            <button 
              @click="resetData"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useTaskStore } from '../stores/task'
import { useGamification } from '../composables/useGamification'

const taskStore = useTaskStore()
const { userStats, userLevel, earnedBadges } = useGamification()

// User data
const userName = computed(() => taskStore.settings.userName || 'TaskPilot User')
const currentLevel = computed(() => userLevel.value)
const currentPoints = computed(() => userStats.value.totalPoints)
const earnedBadgesCount = computed(() => earnedBadges.value.length)

// Settings
const settings = reactive({
  userName: '',
  dailyGoal: 5,
  smartSuggestions: true,
  streakReminders: true,
  badgeNotifications: true,
  theme: 'light',
  categories: [] as Array<{
    name: string
    icon: string
    color: string
    weeklyGoal: number
    showEmojiPicker?: boolean
  }>
})

// Color options for categories
const colorOptions = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E'
]

// Emoji options for categories
const emojiOptions = [
  '🏠', '💼', '💪', '🍳', '🛒', '📚', '🎮', '🎨',
  '🧘', '🏃', '💡', '🔧', '🌱', '💰', '🎵', '📝',
  '🎯', '🔥', '⭐', '🚀', '💎', '🏆', '🎪', '🌟'
]

// Load settings on mount
onMounted(() => {
  const savedSettings = taskStore.settings
  if (savedSettings) {
    Object.assign(settings, savedSettings)
  }
  
  // Initialize default categories if none exist
  if (settings.categories.length === 0) {
    settings.categories = [
      { name: 'Home', icon: '🏠', color: '#3B82F6', weeklyGoal: 7 },
      { name: 'Work', icon: '💼', color: '#059669', weeklyGoal: 5 },
      { name: 'Exercise', icon: '💪', color: '#DC2626', weeklyGoal: 3 },
      { name: 'Learning', icon: '📚', color: '#7C3AED', weeklyGoal: 4 }
    ]
  }
})

// Methods
const saveSettings = () => {
  taskStore.updateSettings(settings)
  // Show success message or toast
  console.log('Settings saved!')
}

const addCategory = () => {
  settings.categories.push({
    name: 'New Category',
    icon: '📝',
    color: '#6366F1',
    weeklyGoal: 3
  })
}

const removeCategory = (index: number) => {
  settings.categories.splice(index, 1)
}

const selectEmoji = (category: any, emoji: string) => {
  category.icon = emoji
  category.showEmojiPicker = false
}

const exportData = () => {
  const data = {
    tasks: taskStore.tasks,
    settings: taskStore.settings,
    userStats: taskStore.userStats,
    badges: taskStore.earnedBadges
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `taskpilot-data-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const resetData = () => {
  if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
    taskStore.resetAllData()
    // Redirect to home or reload
    window.location.reload()
  }
}
</script>
