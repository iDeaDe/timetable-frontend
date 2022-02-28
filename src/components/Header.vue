<template>
  <header>
    <div>
      <h2>Расписание</h2>

      <select aria-label="Выбор группы" v-on:change="selectGroup">
        <option selected hidden>Выбор группы</option>
        <optgroup v-for="courseGroups of groups"
                  :key="courseGroups.course"
                  :label="`${courseGroups.course} курс`">
          <option v-for="group of courseGroups.groups"
                  :key="group.id" :value="group.id"
                  :selected="group.id === selectedGroup">
            {{ group.name }}
          </option>
        </optgroup>
      </select>

      <button class="header-btn header-btn-nav" v-on:click="changeWeek(-1)">&lt;</button>
      <button class="header-btn header-btn-nav" v-on:click="changeWeek(1)">&gt;</button>
    </div>
    <div>
    </div>
  </header>
</template>

<script setup lang="ts">

import { CourseInterface } from '../lib/groups/GroupsInterface';

const emit = defineEmits([
    'group-select',
    'week-change'
]);

defineProps<{
  selectedGroup: number,
  groups?: Array<CourseInterface>
}>();

const selectGroup = (event: Event) => emit('group-select', (<HTMLInputElement>event.target).value);
const changeWeek = (week: number) => emit('week-change', week);

</script>

<style lang="scss">

h2 {
  background-color: #2c3e50;
}

header {
  width: calc(100vw - 40px);
  height: 50px;
  background-color: #2c3e50;
  color: whitesmoke;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    display: inline-flex;
    background-color: #2c3e50;
  }
}

select {
  background-color: #2c3e50;
  color: whitesmoke;
  cursor: pointer;
  outline: none;
  border: 1px solid #354b60;
  border-radius: 4px;
  padding: 5px 10px;
  margin: 0 10px;

  * {
    color: whitesmoke;
  }

  &:focus {
    background-color: #2c5e50;
  }
}

.header-btn {
  outline: none;
  border: 1px solid #354b60;
  border-radius: 4px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  color: whitesmoke;
  font-weight: bold;
  margin: 0 5px;

  &:hover {
    background-color: #394f69;
  }
}

.header-btn-nav {
  color: #ccc;
}

.header-btn-img {
  width: 16px;
  height: 16px;
  fill: whitesmoke;
}

option {
  cursor: pointer;
}
</style>