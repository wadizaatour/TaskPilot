<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    <form @submit.prevent="submit" class="space-y-6">
      <div>
        <label for="title" class="block text-sm font-semibold text-gray-900 mb-2">
          Task Title *
        </label>
        <input 
          id="title"
          v-model="title" 
          required 
          placeholder="What do you need to do?" 
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
        />
      </div>
      
      <div>
        <label for="category" class="block text-sm font-semibold text-gray-900 mb-2">
          Category
        </label>
        <select 
          id="category"
          v-model="category" 
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <option value="">Select a category</option>
          <option value="Health">🏥 Health</option>
          <option value="Fitness">💪 Fitness</option>
          <option value="Work">💼 Work</option>
          <option value="Study">📚 Study</option>
          <option value="Cleaning">🧹 Cleaning</option>
          <option value="Cooking">🍳 Cooking</option>
          <option value="Shopping">🛒 Shopping</option>
          <option value="Social">👥 Social</option>
          <option value="Personal">👤 Personal</option>
          <option value="Hobbies">🎨 Hobbies</option>
        </select>
      </div>
      
      <div>
        <label for="date" class="block text-sm font-semibold text-gray-900 mb-2">
          Scheduled Date *
        </label>
        <input 
          id="date"
          v-model="date" 
          type="date" 
          required 
          class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>
      
      <button 
        type="submit" 
        class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <span class="flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Task
        </span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['add'])
const title = ref('')
const category = ref('')
const date = ref(new Date().toISOString().slice(0, 10))

function submit() {
  if (!title.value.trim()) return
  
  emit('add', { 
    title: title.value.trim(), 
    category: category.value || 'Personal', 
    date: date.value, 
    status: 'pending' 
  })
  
  // Reset form
  title.value = ''
  category.value = ''
  date.value = new Date().toISOString().slice(0, 10)
}
</script>
