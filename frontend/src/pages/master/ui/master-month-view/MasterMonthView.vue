<template>
  <MasterSlotManagement
    v-if="view === 'slot-management'"
    @create-work-days="view = 'work-slot-creation'"
  />
  <MasterWorkSlotCreation
    v-else
    @cancel="view = 'slot-management'"
    @completed="view = 'slot-management'"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MasterSlotManagement from './MasterSlotManagement.vue';
import MasterWorkSlotCreation from './MasterWorkSlotCreation.vue';

type View = 'slot-management' | 'work-slot-creation';

const view = ref<View>('slot-management');
</script>
