import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchOk } from '@/utils/http'
import { sanitizeHtml } from '@/utils/sanitizeHtml'
import { applyInitialTheme, resetThemeState, toggleTheme } from '@/utils/theme'

export const useConfigStore = defineStore('config', () => {
  const config = ref(null)
  const themeMode = ref('dark')

  const title = computed(() => config.value?.title ?? 'NONE')
  const subTitle = computed(() => config.value?.sub_title ?? 'NONE')
  const introduction = computed(() => config.value?.introduction ?? 'NONE')
  const copyright = computed(() =>
    sanitizeHtml(
      config.value?.copyright ??
        '2026 powered by <a href="https://github.com/tropical-algae">tropical algae</a>\'s cat (Mia).'
    )
  )
  const colors = computed(
    () =>
      config.value?.colors ?? {
        dark: {
          '--color-bg': '#142a31',
          '--color-primary': '#c0c7ca',
          '--color-primary-alt': '#8aa0aa',
          '--color-accent': '#9d4022',
          '--color-accent-alt': '#cfa789'
        },
        light: {
          '--color-bg': '#e8e6e1',
          '--color-primary': '#2f2a28',
          '--color-primary-alt': '#6d635e',
          '--color-accent': '#8a4a32',
          '--color-accent-alt': '#fff8f0'
        }
      }
  )
  const labelMap = computed(
    () =>
      config.value?.label_map ?? {
        created_time: 'created_time',
        tags: 'tags'
      }
  )
  const pageSize = computed(() => config.value?.page_size ?? 12)
  const links = computed(
    () =>
      config.value?.links ?? {
        github: '',
        linkedin: '',
        website: ''
      }
  )

  const load = async (sourcePath) => {
    if (!config.value) {
      const res = await fetchOk(sourcePath)
      config.value = await res.json()
      themeMode.value = applyInitialTheme(colors.value)
    }
  }

  const toggleThemeMode = () => {
    themeMode.value = toggleTheme(colors.value)
  }

  const reset = () => {
    config.value = null
    themeMode.value = 'dark'
    resetThemeState()
  }

  return {
    config,
    themeMode,
    title,
    subTitle,
    introduction,
    copyright,
    colors,
    labelMap,
    pageSize,
    links,
    load,
    toggleThemeMode,
    reset
  }
})
