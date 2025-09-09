<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Your Progress</h3>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
          <span class="text-lg">⭐</span>
        </div>
        <span class="text-sm font-medium text-gray-700">Level {{ userLevel }}</span>
      </div>
    </div>

    <!-- Points and Level -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">{{ totalPoints }} points</span>
        <span class="text-xs text-gray-500">{{ levelProgress.current }}/{{ levelProgress.target }} to next level</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
          :style="{ width: levelProgress.percentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- Current Streak -->
    <div class="mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="streakStatusColor">
          <span class="text-lg">🔥</span>
        </div>
        <div>
          <div class="font-semibold text-gray-900">{{ currentStreak }} Day Streak</div>
          <div class="text-sm text-gray-600">{{ streakStatus.message }}</div>
        </div>
      </div>
    </div>

    <!-- Daily Goal Progress -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">Daily Goal</span>
        <span class="text-xs text-gray-500">{{ dailyProgress.completed }}/{{ dailyProgress.goal }}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div 
          class="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
          :style="{ width: dailyProgress.percentage + '%' }"
        ></div>
      </div>
    </div>

    <!-- Next Badge -->
    <div v-if="nextBadge" class="border-t border-gray-100 pt-4">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Next Achievement</h4>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <span class="text-lg opacity-50">{{ nextBadge.icon }}</span>
        </div>
        <div class="flex-1">
          <div class="text-sm font-medium text-gray-900">{{ nextBadge.name }}</div>
          <div class="text-xs text-gray-600">{{ nextBadge.description }}</div>
          <div class="w-full bg-gray-200 rounded-full h-1 mt-1">
            <div 
              class="bg-blue-500 h-1 rounded-full transition-all duration-500"
              :style="{ width: nextBadgeProgress.percentage + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGamification } from '../composables/useGamification'

const {
  totalPoints,
  currentStreak,
  userLevel,
  levelProgress,
  dailyProgress,
  streakStatus,
  nextBadge,
  getBadgeProgress
} = useGamification()

const streakStatusColor = computed(() => {
  switch (streakStatus.value.color) {
    case 'green': return 'bg-green-100'
    case 'orange': return 'bg-orange-100'
    case 'blue': return 'bg-blue-100'
    default: return 'bg-gray-100'
  }
})

const nextBadgeProgress = computed(() => {
  return nextBadge.value ? getBadgeProgress(nextBadge.value.id) : { percentage: 0 }
})
</script>
