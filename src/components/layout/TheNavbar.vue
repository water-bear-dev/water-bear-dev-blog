<script setup>
import ThemeToggle from '@/components/layout/ThemeToggle.vue'
</script>

<template>
  <div class="nav-container">
    <hr class="split-line motion-slide-layer" data-motion-scope="route" data-motion="slide" />
    <ul>
      <li class="motion-slide-layer" data-motion-scope="route" data-motion="slide">
        <RouterLink :to="{ name: 'Home' }"> Home... </RouterLink>
      </li>
      <li class="motion-slide-layer" data-motion-scope="route" data-motion="slide">
        <RouterLink :to="{ name: 'Timeline' }"> Timeline... </RouterLink>
      </li>
      <li
        class="motion-slide-layer nav-theme d-md-none"
        data-motion-scope="route"
        data-motion="slide"
      >
        <ThemeToggle />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.nav-container {
  margin: 0;
  padding: 0 0 1rem;
}

.nav-container ul {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  margin: 0;
  padding: 0;
}

.nav-container ul li {
  margin: 0;
  padding: 0;
  font-weight: bold;
  list-style-type: none;
}

.nav-theme :deep(.theme-toggle) {
  width: auto;
  padding: 0.2rem 0.7rem;
}
</style>
