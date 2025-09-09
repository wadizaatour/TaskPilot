<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Analytics</h1>
          <p class="text-sm text-gray-600 mt-1">Track your progress and insights</p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              timeRange === 'week' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            @click="timeRange = 'week'"
          >
            Week
          </button>
          <button 
            :class="[
              'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              timeRange === 'month' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            @click="timeRange = 'month'"
          >
            Month
          </button>
        </div>
      </div>
    </div>

    <div class="px-4 sm:px-6 py-6 space-y-6">
      <!-- Performance Overview -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
          <div class="text-2xl font-bold text-blue-600">{{ performanceMetrics.completedTasks }}</div>
          <div class="text-sm text-gray-600">Completed</div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
          <div class="text-2xl font-bold text-green-600">{{ Math.round(performanceMetrics.completionRate) }}%</div>
          <div class="text-sm text-gray-600">Success Rate</div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
          <div class="text-2xl font-bold text-purple-600">{{ currentPoints }}</div>
          <div class="text-sm text-gray-600">Total Points</div>
        </div>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
          <div class="text-2xl font-bold text-orange-600">{{ currentLevel }}</div>
          <div class="text-sm text-gray-600">Level</div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Weekly Trends Chart -->
        <AnalyticsChart />
        
        <!-- Streak Calendar -->
        <StreakCalendar />
      </div>

      <!-- Gamification Progress -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Points & Level Progress -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Level Progress</h3>
          
          <!-- Level Progress Bar -->
          <div class="mb-4">
            <div class="flex items-center justify-between text-sm mb-2">
              <span class="text-gray-600">Level {{ currentLevel }}</span>
              <span class="text-gray-600">{{ pointsInLevel }}/{{ pointsForNextLevel }} XP</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div 
                class="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                :style="{ width: levelProgressPercentage + '%' }"
              ></div>
            </div>
          </div>
          
          <!-- Points Breakdown -->
          <div class="space-y-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Today's Points</span>
              <span class="font-medium text-gray-900">+{{ todayPoints }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">This Week</span>
              <span class="font-medium text-gray-900">+{{ weekPoints }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">This Month</span>
              <span class="font-medium text-gray-900">+{{ monthlySummary.points }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Achievements -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
          
          <div v-if="recentBadges.length > 0" class="space-y-3">
            <div 
              v-for="badge in recentBadges" 
              :key="badge.id"
              class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
            >
              <div class="text-2xl">{{ badge.icon }}</div>
              <div class="flex-1">
                <div class="font-medium text-gray-900">{{ badge.name }}</div>
                <div class="text-sm text-gray-600">{{ badge.description }}</div>
              </div>
              <div class="text-xs text-gray-500">
                {{ formatBadgeDate(badge.unlockedAt!) }}
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <div class="text-4xl mb-2">🏆</div>
            <div class="text-gray-600">No achievements yet</div>
            <div class="text-sm text-gray-500 mt-1">Complete tasks to earn your first badge!</div>
          </div>
        </div>
      </div>

      <!-- Category Performance -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="category in topCategories.slice(0, 6)" 
            :key="category.category"
            class="p-4 bg-gray-50 rounded-xl"
          >
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium text-gray-900">{{ category.category }}</h4>
              <span class="text-sm font-medium text-blue-600">
                {{ Math.round(category.completionRate) }}%
              </span>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: category.completionRate + '%' }"
              ></div>
            </div>
            
            <div class="flex items-center justify-between text-xs text-gray-600">
              <span>{{ category.completed }} completed</span>
              <span>{{ category.points }} pts</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Summary -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ monthlySummary.month }} Summary</h3>
        
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">{{ monthlySummary.completed }}</div>
            <div class="text-sm text-gray-600">Tasks Completed</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">{{ monthlySummary.points }}</div>
            <div class="text-sm text-gray-600">Points Earned</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-600">{{ Math.round(monthlySummary.completionRate) }}%</div>
            <div class="text-sm text-gray-600">Success Rate</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">{{ streakInfo.longest }}</div>
            <div class="text-sm text-gray-600">Best Streak</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAnalytics } from '../composables/useAnalytics'
import { useGamification } from '../composables/useGamification'
import AnalyticsChart from '../components/AnalyticsChart.vue'
import StreakCalendar from '../components/StreakCalendar.vue'

const timeRange = ref('week')

const {
  performanceMetrics,
  topCategories,
  monthlySummary,
  streakInfo
} = useAnalytics()

const {
  userStats,
  userLevel,
  levelProgress,
  recentAchievements
} = useGamification()

// Additional computed properties for analytics
const currentPoints = computed(() => userStats.value.totalPoints)
const currentLevel = computed(() => userLevel.value)
const pointsInLevel = computed(() => levelProgress.value.current)
const pointsForNextLevel = computed(() => levelProgress.value.target)
const levelProgressPercentage = computed(() => levelProgress.value.percentage)

const recentBadges = computed(() => recentAchievements.value)

// Additional computed properties for analytics
const todayPoints = computed(() => {
  // Calculate today's points from completed tasks
  const today = new Date().toISOString().slice(0, 10)
  // This would be calculated based on tasks completed today
  return 25 // Placeholder
})

const weekPoints = computed(() => {
  // Calculate this week's points
  return 180 // Placeholder
})

const formatBadgeDate = (date: string) => {
  return new Date(date).toLocaleDateString('en', { 
    month: 'short', 
    day: 'numeric' 
  })
}
</script>
