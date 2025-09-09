<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Weekly Trends</h3>
      <div class="text-sm text-gray-500">Last 7 days</div>
    </div>

    <!-- Weekly Chart -->
    <div class="mb-6">
      <div class="flex items-end justify-between h-32 gap-2">
        <div 
          v-for="day in weeklyTrends" 
          :key="day.date"
          class="flex-1 flex flex-col items-center"
        >
          <div class="flex-1 flex items-end">
            <div 
              class="w-full bg-blue-200 rounded-t transition-all duration-300 hover:bg-blue-300"
              :style="{ height: Math.max(4, day.percentage) + '%' }"
              :title="`${day.completed}/${day.total} tasks (${Math.round(day.percentage)}%)`"
            ></div>
          </div>
          <div class="text-xs text-gray-600 mt-2">{{ day.day }}</div>
        </div>
      </div>
    </div>

    <!-- Performance Summary -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">{{ performanceMetrics.completedTasks }}</div>
        <div class="text-xs text-gray-600">Completed</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-red-500">{{ performanceMetrics.missedTasks }}</div>
        <div class="text-xs text-gray-600">Missed</div>
      </div>
    </div>

    <!-- Top Categories -->
    <div>
      <h4 class="text-sm font-medium text-gray-700 mb-3">Top Categories</h4>
      <div class="space-y-2">
        <div 
          v-for="category in topCategories.slice(0, 3)" 
          :key="category.category"
          class="flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span class="text-sm text-gray-700">{{ category.category }}</span>
          </div>
          <div class="text-sm font-medium text-gray-900">
            {{ Math.round(category.completionRate) }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAnalytics } from '../composables/useAnalytics'

const {
  weeklyTrends,
  performanceMetrics,
  topCategories
} = useAnalytics()
</script>
