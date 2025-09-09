<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-3 transition-all hover:shadow-md">
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 text-base sm:text-lg truncate mb-1">
          {{ task.title }}
        </h3>
        <div class="flex items-center gap-2 mb-2">
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            {{ task.category }}
          </span>
          <span class="text-xs text-gray-500">
            {{ formatDate(task.date) }}
          </span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-2 h-2 rounded-full" :class="statusColor"></div>
          <span class="text-xs font-medium capitalize" :class="statusTextColor">
            {{ task.status }}
          </span>
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-1 sm:gap-2">
        <button
          v-if="task.status !== 'done'"
          @click="mark('done')"
          class="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
          title="Mark as done"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button
          v-if="task.status !== 'missed'"
          @click="mark('missed')"
          class="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
          title="Mark as missed"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button
          v-if="task.status !== 'pending'"
          @click="mark('pending')"
          class="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
          title="Reset to pending"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '../stores/task'

const props = defineProps<{ task: Task }>()
const emit = defineEmits(['update-status'])

const statusColor = computed(() => {
  switch (props.task.status) {
    case 'done': return 'bg-green-500'
    case 'missed': return 'bg-red-500'
    case 'pending': return 'bg-yellow-500'
    default: return 'bg-gray-500'
  }
})

const statusTextColor = computed(() => {
  switch (props.task.status) {
    case 'done': return 'text-green-700'
    case 'missed': return 'text-red-700'
    case 'pending': return 'text-yellow-700'
    default: return 'text-gray-700'
  }
})

function mark(status: 'done' | 'missed' | 'pending') {
  emit('update-status', status)
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  
  if (isToday) return 'Today'
  
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()
  
  if (isYesterday) return 'Yesterday'
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>
