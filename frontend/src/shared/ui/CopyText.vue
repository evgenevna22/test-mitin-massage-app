<template>
  <span class="copyable-text">
    <button
      class="copy-button"
      type="button"
      v-tooltip.focus="{ value: 'Copied', hideDelay: TOOLTIP_DELAY_IN_MS }"
      tabindex="0"
      :aria-label="`Copy ${text}`"
      @click="handleCopyText"
    >
      <span>{{ text }}</span>
      <i class="pi pi-copy" aria-hidden="true" />
    </button>
  </span>
</template>

<script setup lang="ts">
import { copyText } from '@shared/lib';

const props = defineProps<{
  text: string;
}>();

const TOOLTIP_DELAY_IN_MS = 300;

const handleCopyText = async () => {
  await copyText(props.text);
};
</script>

<style scoped>
.copyable-text {
  position: relative;
  display: inline-flex;
}

.copy-button {
  display: inline-flex;
  align-items: center;
  gap: var(--gap);
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
</style>
