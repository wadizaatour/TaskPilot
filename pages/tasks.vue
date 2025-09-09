<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">All Tasks</h1>
      <p class="text-gray-600 text-sm sm:text-base">Manage your daily tasks and track progress</p>
    </div>

    <!-- Tasks Container -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div v-if="todayTasks.length > 0">
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Today's Tasks ({{ todayTasks.length }})</h2>
          <div class="flex gap-2 text-sm">
            <span class="px-2 py-1 bg-green-100 text-green-700 rounded-full">
              {{ completedToday }} completed
            </span>
            <span class="px-2 py-1 bg-red-100 text-red-700 rounded-full">
              {{ missedToday }} missed
            </span>
            <span class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
              {{ pendingToday }} pending
            </span>
          </div>
        </div>
        <TaskList :tasks="todayTasks" @update-status="onUpdateStatus" />
      </div>
      
      <div v-else class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No tasks for today</h3>
        <p class="text-gray-600 mb-6">Start by adding some tasks to stay organized and productive!</p>
        <NuxtLink 
          to="/add" 
          class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Your First Task
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTaskStore } from '../stores/task'
import TaskList from '../components/TaskList.vue'

const store = useTaskStore()

// Load data only on client side
onMounted(() => {
  store.load()
})

const todayTasks = computed(() => store.todayTasks)
const completedToday = computed(() => todayTasks.value.filter(t => t.status === 'done').length)
const missedToday = computed(() => todayTasks.value.filter(t => t.status === 'missed').length)
const pendingToday = computed(() => todayTasks.value.filter(t => t.status === 'pending').length)

function onUpdateStatus(id: string, status: 'done' | 'missed' | 'pending') {
  store.markTask(id, status)
}
</script>
