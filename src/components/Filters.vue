<template>
  <div class="filters-block">
    <button class="filter-show" type="button">Фильтры</button>
  </div>
</template>

<script>
export default {
  name: 'Filters'
}
</script>

<style scoped>
.filters-block {
  margin: 20px;
}

.filter-show {
  outline: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>