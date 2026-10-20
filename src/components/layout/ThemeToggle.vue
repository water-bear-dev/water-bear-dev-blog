<template>
  <button type="button" class="theme-toggle" @click="onToggle">
    {{ label }}
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'

const configStore = useConfigStore()
const label = computed(() =>
  configStore.themeMode === 'dark' ? 'Light mode' : 'Dark mode'
)

function onToggle() {
  configStore.toggleThemeMode()
}
</script>

<style scoped>
.theme-toggle {
  width: 100%;
  margin: 0;
  padding: 0.15rem 0.5rem;
  border: 0;
  border-radius: 7px;
  color: var(--color-accent-alt);
  background-color: var(--color-accent);
  font: inherit;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  transition:
    color 0.24s ease,
    background-color 0.24s ease,
    transform 0.32s cubic-bezier(0.34, 1.6, 0.64, 1);
}

.theme-toggle:hover,
.theme-toggle:focus-visible {
  color: var(--color-accent);
  background-color: var(--color-accent-alt);
  outline: none;
}

.theme-toggle:active {
  transform: scale(0.95);
}
</style>
