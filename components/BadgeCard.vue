<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Achievements</h3>
      <div class="text-sm text-gray-500">{{ earnedBadges.length }}/{{ totalBadges }} unlocked</div>
    </div>

    <!-- Recent Achievements -->
    <div v-if="recentAchievements.length > 0" class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Recently Unlocked</h4>
      <div class="space-y-2">
        <div 
          v-for="badge in recentAchievements" 
          :key="badge.id"
          class="flex items-center gap-3 p-2 bg-green-50 rounded-lg border border-green-200"
        >
          <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span class="text-lg">{{ badge.icon }}</span>
          </div>
          <div class="flex-1">
            <div class="text-sm font-medium text-green-800">{{ badge.name }}</div>
            <div class="text-xs text-green-600">{{ badge.description }}</div>
          </div>
          <div class="text-xs text-green-600">
            {{ formatDate(badge.unlockedAt!) }}
          </div>
        </div>
      </div>
    </div>

    <!-- All Badges Grid -->
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      <div 
        v-for="badge in allBadges" 
        :key="badge.id"
        class="relative group"
      >
        <div 
          class="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all"
          :class="badgeClasses(badge)"
        >
          <span 
            class="text-lg transition-all"
            :class="{ 'opacity-30': !isBadgeUnlocked(badge.id) }"
          >
            {{ badge.icon }}
          </span>
        </div>
        
        <!-- Tooltip -->
        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div class="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 min-w-max">
            <div class="font-medium">{{ badge.name }}</div>
            <div class="text-gray-300">{{ badge.description }}</div>
            <div v-if="!isBadgeUnlocked(badge.id)" class="text-blue-300 mt-1">
              Progress: {{ getBadgeProgress(badge.id).current }}/{{ getBadgeProgress(badge.id).target }}
            </div>
          </div>
          <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>

    <!-- Progress for next badges -->
    <div v-if="nextBadges.length > 0" class="mt-6 pt-4 border-t border-gray-100">
      <h4 class="text-sm font-medium text-gray-700 mb-3">In Progress</h4>
      <div class="space-y-3">
        <div 
          v-for="badge in nextBadges" 
          :key="badge.id"
          class="flex items-center gap-3"
        >
          <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span class="text-lg opacity-50">{{ badge.icon }}</span>
          </div>
          <div class="flex-1">
            <div class="text-sm font-medium text-gray-900">{{ badge.name }}</div>
            <div class="text-xs text-gray-600 mb-1">{{ badge.description }}</div>
            <div class="w-full bg-gray-200 rounded-full h-1">
              <div 
                class="bg-blue-500 h-1 rounded-full transition-all duration-500"
                :style="{ width: getBadgeProgress(badge.id).percentage + '%' }"
              ></div>
            </div>
          </div>
          <div class="text-xs text-gray-500">
            {{ getBadgeProgress(badge.id).current }}/{{ getBadgeProgress(badge.id).target }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGamification } from '../composables/useGamification'
import { useTaskStore } from '../stores/task'

const store = useTaskStore()
const {
  earnedBadges,
  availableBadges,
  getBadgeProgress,
  recentAchievements
} = useGamification()

const allBadges = computed(() => store.badges)
const totalBadges = computed(() => store.badges.length)

const nextBadges = computed(() => {
  return availableBadges.value
    .map(badge => ({
      ...badge,
      progress: getBadgeProgress(badge.id)
    }))
    .filter(badge => badge.progress.percentage > 0)
    .sort((a, b) => b.progress.percentage - a.progress.percentage)
    .slice(0, 3)
})

const isBadgeUnlocked = (badgeId: string) => {
  return store.unlockedBadges.includes(badgeId)
}

const badgeClasses = (badge: any) => {
  const isUnlocked = isBadgeUnlocked(badge.id)
  return isUnlocked
    ? 'border-yellow-300 bg-yellow-50'
    : 'border-gray-200 bg-gray-50'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}
</script>
