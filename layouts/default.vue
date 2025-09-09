<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Desktop sidebar -->
    <aside class="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">TaskPilot</h1>
            <p class="text-sm text-gray-500">Stay organized</p>
          </div>
        </div>
      </div>
      
      <nav class="flex-1 p-4 space-y-2">
        <NuxtLink 
          to="/" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          active-class="bg-blue-50 text-blue-700 font-medium"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          Dashboard
        </NuxtLink>
        
        <NuxtLink 
          to="/tasks" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          active-class="bg-blue-50 text-blue-700 font-medium"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
          All Tasks
        </NuxtLink>
        
        <NuxtLink 
          to="/add" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          active-class="bg-blue-50 text-blue-700 font-medium"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Task
        </NuxtLink>

        <NuxtLink 
          to="/analytics" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          active-class="bg-blue-50 text-blue-700 font-medium"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          Analytics
        </NuxtLink>

        <NuxtLink 
          to="/profile" 
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          active-class="bg-blue-50 text-blue-700 font-medium"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          Profile
        </NuxtLink>
      </nav>
      
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
          <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900">User</p>
            <p class="text-xs text-gray-500 truncate">Keep it up!</p>
          </div>
        </div>
      </div>
    </aside>
    
    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Mobile header -->
      <header class="lg:hidden bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 class="text-lg font-bold text-gray-900">TaskPilot</h1>
          </div>
          <div class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      </header>
      
      <main class="flex-1 overflow-y-auto overflow-x-hidden pb-24 lg:pb-0">
        <div class="h-full">
          <slot />
        </div>
      </main>
      
      <!-- Mobile bottom navigation -->
      <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-2 shadow-lg z-50" style="padding-bottom: max(0.5rem, env(safe-area-inset-bottom))">
        <div class="flex items-center justify-around">
          <NuxtLink 
            to="/" 
            class="flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-colors"
            active-class="text-blue-600"
            inactive-class="text-gray-500"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span class="text-xs font-medium">Home</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/tasks" 
            class="flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-colors"
            active-class="text-blue-600"
            inactive-class="text-gray-500"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            <span class="text-xs font-medium">Tasks</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/add" 
            class="flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-colors"
            active-class="text-blue-600"
            inactive-class="text-gray-500"
          >
            <div class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center mb-1">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="text-xs font-medium text-blue-600">Add</span>
          </NuxtLink>

          <NuxtLink 
            to="/analytics" 
            class="flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-colors"
            active-class="text-blue-600"
            inactive-class="text-gray-500"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            <span class="text-xs font-medium">Charts</span>
          </NuxtLink>

          <NuxtLink 
            to="/profile" 
            class="flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-colors"
            active-class="text-blue-600"
            inactive-class="text-gray-500"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            <span class="text-xs font-medium">Profile</span>
          </NuxtLink>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
// Navigation layout
</script>
