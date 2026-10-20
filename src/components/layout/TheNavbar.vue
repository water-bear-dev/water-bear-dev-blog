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
</style>
