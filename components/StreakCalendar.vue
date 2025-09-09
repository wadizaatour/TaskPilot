<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Streak Calendar</h3>
      <div class="text-sm text-gray-500">{{ currentMonth }}</div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1 mb-4">
      <!-- Day headers -->
      <div 
        v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" 
        :key="day"
        class="text-center text-xs font-medium text-gray-500 py-2"
      >
        {{ day }}
      </div>

      <!-- Calendar days -->
      <div 
        v-for="day in calendarDays" 
        :key="day.date"
        class="aspect-square flex items-center justify-center text-xs font-medium rounded cursor-pointer transition-all duration-200"
        :class="getDayClass(day)"
        :title="getDayTooltip(day)"
      >
        {{ day.dayNumber }}
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-between text-xs">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-gray-100 rounded"></div>
          <span class="text-gray-600">No tasks</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-red-200 rounded"></div>
          <span class="text-gray-600">Missed</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-green-400 rounded"></div>
          <span class="text-gray-600">Completed</span>
        </div>
      </div>
      <div class="text-gray-500">
        {{ streakInfo.current }} day streak
      </div>
    </div>

    <!-- Streak Stats -->
    <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
      <div class="text-center">
        <div class="text-xl font-bold text-blue-600">{{ streakInfo.current }}</div>
        <div class="text-xs text-gray-600">Current Streak</div>
      </div>
      <div class="text-center">
        <div class="text-xl font-bold text-purple-600">{{ streakInfo.longest }}</div>
        <div class="text-xs text-gray-600">Best Streak</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnalytics } from '../composables/useAnalytics'

const {
  calendarDays,
  currentMonth,
  streakInfo
} = useAnalytics()

const getDayClass = (day: any) => {
  if (!day.hasData) return 'bg-gray-50 text-gray-400'
  if (day.completionRate === 0) return 'bg-red-200 text-red-800 hover:bg-red-300'
  if (day.completionRate === 100) return 'bg-green-400 text-white hover:bg-green-500'
  return 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
}

const getDayTooltip = (day: any) => {
  if (!day.hasData) return 'No tasks'
  return `${day.completed}/${day.total} tasks completed (${Math.round(day.completionRate)}%)`
}
</script>
