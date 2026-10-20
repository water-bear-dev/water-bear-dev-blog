const STORAGE_KEY = 'water-bear-theme'
const MODES = ['dark', 'light']

let currentMode = null

function isThemeToken(key, value) {
  return (
    typeof key === 'string' &&
    key.startsWith('--') &&
    (typeof value === 'string' || typeof value === 'number')
  )
}

function hasThemeTokens(theme) {
  return (
    theme &&
    typeof theme === 'object' &&
    Object.entries(theme).some(([key, value]) => isThemeToken(key, value))
  )
}

function getStoredMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (MODES.includes(stored)) return stored
  } catch {
    /* ignore */
  }
  return null
}

function getPreferredMode() {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

export function resolveThemeTokens(themes, mode) {
  if (!themes) return null

  if (!Array.isArray(themes) && typeof themes === 'object') {
    return themes[mode] || themes.dark || themes.light || null
  }

  if (Array.isArray(themes)) {
    return mode === 'light' ? themes[1] || themes[0] : themes[0]
  }

  return null
}

export function applyTheme(theme, root) {
  const target = root ?? (typeof document === 'undefined' ? null : document.documentElement)
  if (!hasThemeTokens(theme) || !target?.style) return false

  for (const [key, value] of Object.entries(theme)) {
    if (isThemeToken(key, value)) {
      target.style.setProperty(key, String(value))
    }
  }

  return true
}

export function getCurrentMode() {
  return currentMode || getStoredMode() || getPreferredMode()
}

export function applyThemeMode(themes, mode) {
  const next = MODES.includes(mode) ? mode : 'dark'
  applyTheme(resolveThemeTokens(themes, next))
  currentMode = next

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = next
    document.documentElement.style.colorScheme = next
  }

  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    /* ignore */
  }

  return next
}

export function applyInitialTheme(themes) {
  return applyThemeMode(themes, getStoredMode() || getPreferredMode())
}

export function toggleTheme(themes) {
  const next = getCurrentMode() === 'dark' ? 'light' : 'dark'
  return applyThemeMode(themes, next)
}

export function resetThemeState() {
  currentMode = null
}
