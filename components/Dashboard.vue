<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-600 text-sm sm:text-base">Track your daily progress and achievements</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
      <!-- Completed Tasks -->
      <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{{ completed }}</div>
        <div class="text-sm text-green-600 font-medium">Completed</div>
      </div>

      <!-- Missed Tasks -->
      <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <div class="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{{ missed }}</div>
        <div class="text-sm text-red-600 font-medium">Missed</div>
      </div>

      <!-- Weekly Progress -->
      <div class="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 col-span-2 lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-gray-900">Weekly Progress</h3>
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </div>
        </div>
        <div class="mb-3">
          <div class="flex items-end justify-between mb-2">
            <span class="text-2xl sm:text-3xl font-bold text-gray-900">{{ weekProgress }}</span>
            <span class="text-sm text-gray-500">tasks this week</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              :style="{ width: Math.min(100, weekPercent) + '%' }"
            ></div>
          </div>
        </div>
        <div class="text-sm text-gray-600">
          {{ Math.round(weekPercent) }}% of weekly goal
        </div>
      </div>
    </div>

    <!-- Today's Suggestions -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div class="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Today's Suggestions</h2>
          <p class="text-sm text-gray-600">Recommended tasks for today</p>
        </div>
        <button 
          @click="refreshSuggestions"
          class="flex items-center justify-center w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-600 transition-colors"
          title="Refresh suggestions"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div v-if="suggestedTasks.length > 0">
        <TaskList :tasks="suggestedTasks" @update-status="onUpdateStatus" />
      </div>
      <div v-else class="text-center py-8 sm:py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 8.207a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L13.707 9.793z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
        <p class="text-gray-600 mb-4">No suggested tasks for today. Great work!</p>
        <NuxtLink 
          to="/add" 
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          Add New Task
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTaskStore } from '../stores/task'
import TaskList from './TaskList.vue'

const store = useTaskStore()

// Load data only on client side
onMounted(() => {
  store.load()
})

const completed = computed(() => store.completedCount)
const missed = computed(() => store.missedCount)
const weekProgress = computed(() => store.weekProgress)
const weekPercent = computed(() => Math.min(100, weekProgress.value * 20))
const suggestedTasks = computed(() => store.suggestedTasks)

function onUpdateStatus(id: string, status: 'done' | 'missed' | 'pending') {
  store.markTask(id, status)
}

function refreshSuggestions() {
  store.suggestTodayTasks(3)
}
</script>
