<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="label"
    :title="label"
    @click="onToggle"
  >
    <component :is="icon" class="theme-toggle-icon" />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'
import SunIcon from '@/assets/icons/sun.svg?component'
import MoonIcon from '@/assets/icons/moon.svg?component'

const configStore = useConfigStore()
const isDark = computed(() => configStore.themeMode === 'dark')
const label = computed(() => (isDark.value ? 'Switch to light mode' : 'Switch to dark mode'))
const icon = computed(() => (isDark.value ? SunIcon : MoonIcon))

function onToggle() {
  configStore.toggleThemeMode()
}
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  width: 2.5rem;
  height: 2.5rem;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 999px;
  color: var(--color-accent-alt);
  background-color: var(--color-accent);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgb(0 0 0 / 18%);
  transition:
    color 0.24s ease,
    background-color 0.24s ease,
    transform 0.32s cubic-bezier(0.34, 1.6, 0.64, 1);
}

.theme-toggle-icon {
  width: 1.2rem;
  height: 1.2rem;
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
