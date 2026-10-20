import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchOk } from '@/utils/http'
import { getMarkedWithKatex } from '@/utils/markdown'
import { sanitizeHtml } from '@/utils/sanitizeHtml'

function throwIfAborted(signal) {
  if (signal?.aborted) {
    throw signal.reason || new DOMException('Post loading aborted', 'AbortError')
  }
}

function normalizeCreatedTime(value) {
  if (!value) return ''

  const [year, month, day] = String(value).split('-')
  if (!year || !month || !day) return value

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

function normalizePost(post) {
  return {
    ...post,
    created_time: normalizeCreatedTime(post.created_time),
    tags: Array.isArray(post.tags) ? post.tags : [],
    excerpt: typeof post.excerpt === 'string' ? post.excerpt : ''
  }
}

function sortPostsByCreatedTime(posts) {
  return [...posts].sort((a, b) => new Date(b.created_time || 0) - new Date(a.created_time || 0))
}

function groupPostsByYearMonth(posts) {
  const grouped = new Map()

  for (const post of posts) {
    if (!post.created_time) continue

    const date = new Date(post.created_time)
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    if (!Number.isFinite(year) || !Number.isFinite(month)) continue

    if (!grouped.has(year)) {
      grouped.set(year, new Map())
    }

    const yearGroup = grouped.get(year)
    if (!yearGroup.has(month)) {
      yearGroup.set(month, [])
    }
    yearGroup.get(month).push(post)
  }

  return [...grouped.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, months]) => ({
      year,
      months: [...months.entries()]
        .sort(([a], [b]) => b - a)
        .map(([month, monthPosts]) => ({
          month,
          posts: monthPosts
        }))
    }))
}

function normalizePageSize(pageSize) {
  const size = Number(pageSize)
  return Number.isFinite(size) && size > 0 ? size : 1
}

export const ARCHIVE_TAG = 'archive'

function isArchiveTag(tag) {
  return String(tag).toLowerCase() === ARCHIVE_TAG
}

function hasArchiveTag(post) {
  return post.tags.some(isArchiveTag)
}

function displayTags(tags) {
  return tags.filter((tag) => !isArchiveTag(tag))
}

export const usePostStore = defineStore('post', () => {
  const posts = ref(null)
  const selectedTags = ref([])
  const currentPage = ref(1)
  const postHtmlCache = new Map()

  const postList = computed(() => posts.value ?? [])
  const sortedPosts = computed(() => sortPostsByCreatedTime(postList.value))
  const activePosts = computed(() => sortedPosts.value.filter((post) => !hasArchiveTag(post)))
  const archivedPosts = computed(() => sortedPosts.value.filter(hasArchiveTag))
  const tags = computed(() =>
    [...new Set(postList.value.flatMap((post) => displayTags(post.tags)))].sort()
  )
  const getAllTags = computed(() => tags.value)

  function getScopedPosts(scope) {
    return scope === 'archive' ? archivedPosts.value : activePosts.value
  }

  const getFilteredPosts = computed(() => getFilteredPostsFor('home'))

  function getFilteredPostsFor(scope) {
    const base = getScopedPosts(scope)
    if (selectedTags.value.length === 0) return base

    const selected = new Set(selectedTags.value)
    return base.filter((post) => displayTags(post.tags).some((tag) => selected.has(tag)))
  }

  const timeGroupPosts = computed(() => groupPostsByYearMonth(activePosts.value))

  async function load(sourcePath) {
    if (posts.value) return

    const res = await fetchOk(sourcePath)
    const loadedPosts = await res.json()
    posts.value = loadedPosts.map(normalizePost)
  }

  function selectTag(tag) {
    if (selectedTags.value.includes(tag)) return

    selectedTags.value.push(tag)
    currentPage.value = 1
  }

  function unselectTag(tag) {
    if (!selectedTags.value.includes(tag)) return

    selectedTags.value = selectedTags.value.filter((selectedTag) => selectedTag !== tag)
    currentPage.value = 1
  }

  function getFilteredPaginatedPosts(pageSize, scope = 'home') {
    const size = normalizePageSize(pageSize)
    const start = (currentPage.value - 1) * size
    return getFilteredPostsFor(scope).slice(start, start + size)
  }

  function getFilteredPages(pageSize, scope = 'home') {
    const filtered = getFilteredPostsFor(scope)
    if (filtered.length === 0) return 1

    return Math.ceil(filtered.length / normalizePageSize(pageSize))
  }

  function getPostByTitle(title) {
    return postList.value.find((post) => post.title === title) || null
  }

  function getRelatedPosts(title = '', limit = 8) {
    const post = getPostByTitle(title)
    if (!post) return []

    return displayTags(post.tags)
      .map((tag) => {
        const titles = postList.value
          .filter((candidate) => candidate.tags.includes(tag) && candidate.title !== title)
          .map((candidate) => candidate.title)
          .slice(0, limit)

        return titles.length > 0 ? { tag, titles } : null
      })
      .filter(Boolean)
  }

  async function fetchPostHtml(title, options = {}) {
    const post = getPostByTitle(title)
    if (!post) throw new Error('Post not found')

    if (postHtmlCache.has(title)) {
      return postHtmlCache.get(title)
    }

    const slugPath = `${post.dir}/${post.slug}`
    throwIfAborted(options.signal)

    const res = await fetchOk(slugPath, options)
    const mdText = await res.text()
    throwIfAborted(options.signal)

    const marked = await getMarkedWithKatex()
    const html = sanitizeHtml(marked.parse(mdText))
    throwIfAborted(options.signal)

    postHtmlCache.set(title, html)
    return html
  }

  function reset() {
    posts.value = null
    selectedTags.value = []
    currentPage.value = 1
    postHtmlCache.clear()
  }

  return {
    posts,
    sortedPosts,
    timeGroupPosts,
    tags,
    selectedTags,
    currentPage,
    getAllTags,
    getFilteredPosts,
    load,
    selectTag,
    unselectTag,
    getFilteredPaginatedPosts,
    getFilteredPages,
    getPostByTitle,
    getRelatedPosts,
    fetchPostHtml,
    reset
  }
})
