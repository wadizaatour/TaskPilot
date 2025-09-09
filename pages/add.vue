<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6">
    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Add New Task</h1>
      <p class="text-gray-600 text-sm sm:text-base">Create a new task to stay organized and productive</p>
    </div>

    <!-- Form Container -->
    <div class="max-w-md mx-auto">
      <TaskForm @add="onAdd" />
      
      <!-- Success Message -->
      <div v-if="showSuccess" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="text-green-800 font-medium">Task added successfully!</span>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="mt-8 space-y-3">
        <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Quick Actions</h3>
        <div class="grid grid-cols-2 gap-3">
          <NuxtLink 
            to="/tasks" 
            class="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            <span class="text-sm font-medium text-gray-700">View Tasks</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/" 
            class="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span class="text-sm font-medium text-gray-700">Dashboard</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTaskStore } from '../stores/task'
import TaskForm from '../components/TaskForm.vue'

const store = useTaskStore()
const showSuccess = ref(false)

function onAdd(task: any) {
  store.addTask(task)
  
  // Show success message
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}
</script>
