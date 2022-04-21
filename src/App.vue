<template>
  <div id="app">
    <Loader v-show="loader.isLoading" :loader-text="'Загрузка данных'"/>
    <Header :groups="groups.courses"
            :selectedGroup="selectedGroup"
            @group-select="groupChanged"
            @week-change="weekChanged"/>
    <div v-if="!isNaN(selectedGroup)">
      <Timetable :list="timetable.days"/>
    </div>
    <div class="start-screen" v-else>
      Группа не выбрана
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue';
import axios from 'axios';

import Loader from './components/Loader.vue';
import Header from './components/Header.vue';
import Timetable from './components/Timetable.vue';
import { TimetableInterface } from './lib/timetable/TimetableInterface';
import { GroupsInterface } from './lib/groups/GroupsInterface';
import { DataLoader } from "./lib/data/DataLoader";

const API_URL = 'https://api.ashutov.rocks/timetable';

const loader = ref(new DataLoader(
    API_URL,
    [
      {
        name: 'groups',
        address: '/groups',
        data: {}
      },
      {
        name: 'timetable',
        address: '/timetable',
        data: {}
      }
    ]
));

// Событие изменения группы
const groupChanged = (group: any) => {
  localStorage.setItem('selectedgroup', group);
  selectedGroup.value = parseInt(group, 10);
  selectedWeek.value = 0;
  loadTimetable();
  window.history.pushState(
      { group: group },
      'Расписание',
      `/?group=${ group }`
  );
}

const weekChanged = (week: any) => {
  selectedWeek.value += week;
  loadTimetable();
}

const loadTimetable = () => {
  if (!isNaN(selectedGroup.value)) {
    let params = {
      group: selectedGroup.value.toString()
    } as Record<string, string>;
    if (!isNaN(selectedWeek.value)) {
      params.week = selectedWeek.value.toString();
    }

    loader.value
      .load('timetable', params)
      .then(() => {
        timetable.value = loader.value.getData('timetable') as TimetableInterface;
        selectedWeek.value = timetable.value.week;
      });
  }
}

const groups = ref({} as GroupsInterface);
const timetable = ref({} as TimetableInterface);
const selectedGroup = ref(0);
const selectedWeek = ref(0);

selectedGroup.value = parseInt(localStorage.getItem('selectedgroup') || '', 10);
if (window.location.search !== '') {
  let group = parseInt((new URLSearchParams(window.location.search)).get('group') || '', 10);
  if (!isNaN(group)) {
    selectedGroup.value = group;
  }
} else if (!isNaN(selectedGroup.value)) {
  window.history.replaceState(
      { group: selectedGroup.value },
      'Расписание',
      `/?group=${ selectedGroup.value }`
  );
}

loader.value
  .load('groups')
  .then(() => {
    groups.value = loader.value.getData('groups') as GroupsInterface;

    loadTimetable();
  });
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

$mainColor: #2c3e50;

*,
body,
html {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
}

body {
  background-color: whitesmoke;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $mainColor;
}

button {
  background-color: $mainColor;
}

.start-screen {
  width: 100vw;
  height: calc(100vh - 50px);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
</style>
