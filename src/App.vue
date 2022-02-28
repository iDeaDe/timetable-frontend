<template>
  <div id="app">
    <Loader v-if="isLoaderVisible" :loader-text="loaderText"/>
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

const API_URL = 'https://timetable.ashutov.rocks';

const showLoader = () => {
  isLoaderVisible.value = true;

  let interval = setInterval(() => {
    loaderText.value = 'Загрузка ';

    if (dataLoad.value.groups && dataLoad.value.timetable) {
      isLoaderVisible.value = false;
      clearInterval(interval);
    }

    if (dataLoad.value.groups && !dataLoad.value.timetable)
      loaderText.value += 'расписания';
    else if (!dataLoad.value.groups && dataLoad.value.timetable)
      loaderText.value += 'групп';
    else
      loaderText.value += 'данных';
  }, 100);
}

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
  dataLoad.value.timetable = false;
  showLoader();

  if (!isNaN(selectedGroup.value)) {
    let params = new URLSearchParams();
    params.set('group', selectedGroup.value.toString());
    if (!isNaN(selectedWeek.value)) {
      params.set('week', selectedWeek.value.toString());
    }

    axios.get(`${ API_URL }/api/timetable?${ params.toString() }`, { responseType: 'json' })
        .then(resp => {
          if (resp.status === 200) {
            timetable.value = resp.data;
            dataLoad.value.timetable = true;
            // @ts-ignore
            selectedWeek.value = timetable.value.week;
          }
        })
        .catch(err => console.log(err.toJSON()));
  } else
    dataLoad.value.timetable = true;
}

const groups = ref({} as GroupsInterface);
const timetable = ref({} as TimetableInterface);
const selectedGroup = ref(0);
const selectedWeek = ref(0);

const loaderText = ref('');
const isLoaderVisible = ref(true);
const dataLoad = ref({
  groups: false,
  timetable: false
});

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

// Load groups from API
axios.get(`${ API_URL }/api/groups`, { responseType: 'json' })
    .then(resp => {
      if (resp.status === 200)
        groups.value = resp.data;
      dataLoad.value.groups = true;
    })
    .catch(err => console.log(err.toJSON()));

loadTimetable();
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
