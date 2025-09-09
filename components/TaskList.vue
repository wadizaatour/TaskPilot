<template>
  <div>
    <TaskCard
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @update-status="status => $emit('update-status', task.id, status)"
    />
    <div v-if="!tasks.length" class="text-center text-gray-400 mt-8">No tasks for today.</div>
  </div>
</template>

<script setup lang="ts">
import TaskCard from './TaskCard.vue'
import type { Task } from '../stores/task'

defineProps<{ tasks: Task[] }>()
defineEmits(['update-status'])
</script>
