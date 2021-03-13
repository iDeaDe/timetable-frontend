<template>
  <div id="app">
    <Loader v-if="isLoaderVisible" v-bind:loader-text="loaderText" />
    <Header v-bind:groups="groups.courses"
            v-bind:selected-group="selectedGroup"
            v-on:groupselect="groupChanged"
            v-on:weekchange="weekChanged" />
    <div v-if="!isNaN(selectedGroup)">
      <Timetable v-bind:list="timetable.days" />
    </div>
    <div class="start-screen" v-else>
      Группа не выбрана
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import Loader from './components/Loader'
import Header from './components/Header'
//import Filters from './components/Filters'
import Timetable from './components/Timetable'

const API_URL = 'https://timetable.ashutov.rocks'

export default {
  name: 'App',
  components: {
    Loader,
    Header,
    //Filters,
    Timetable
  },
  data: () => ({
    groups: {},
    timetable: {},
    selectedGroup: 0,
    selectedWeek: 0,
    // Лоадер
    loaderText: '',
    isLoaderVisible: true,
    // Проверка загрузки данных
    dataLoad: {
      groups: false,
      timetable: false
    }
  }),
  created() {
    let vm = this

    vm.selectedGroup = parseInt(localStorage.getItem('selectedgroup'), 10)
    if (window.location.search !== '') {
      let group = parseInt((new URLSearchParams(window.location.search)).get('group'), 10)
      if (!isNaN(group))
        vm.selectedGroup = group
    }
    else if (!isNaN(vm.selectedGroup))
      window.history.replaceState(
        { group: vm.selectedGroup },
        'Расписание',
        `/?group=${vm.selectedGroup}`
      )

    // Load groups from API
    axios.get(`${API_URL}/api/groups`, { responseType: 'json' })
      .then(resp => {
        if (resp.status === 200)
          vm.groups = resp.data
          vm.dataLoad.groups = true
      })
      .catch(err => console.log(err.toJSON()))

    vm.loadTimetable()
  },
  methods: {
    showLoader() {
      let vm = this
      vm.isLoaderVisible = true

      let interval = setInterval(() => {
        vm.loaderText = 'Загрузка '

        if (vm.dataLoad.groups && vm.dataLoad.timetable) {
          vm.isLoaderVisible = false
          clearInterval(interval)
        }

        if (vm.dataLoad.groups && !vm.dataLoad.timetable)
          vm.loaderText += 'расписания'
        else if (!vm.dataLoad.groups && vm.dataLoad.timetable)
          vm.loaderText += 'групп'
        else
          vm.loaderText += 'данных'
      }, 100)
    },

    // Событие изменения группы
    groupChanged(group) {
      localStorage.setItem('selectedgroup', group)
      this.selectedGroup = parseInt(group, 10)
      this.selectedWeek = 0
      this.loadTimetable()
      window.history.pushState(
        { group: group },
        'Расписание',
        `/?group=${group}`
      )
    },

    weekChanged(week) {
      this.selectedWeek += week
      this.loadTimetable()
    },

    loadTimetable() {
      let vm = this
      vm.dataLoad.timetable = false
      vm.showLoader()

      if (!isNaN(vm.selectedGroup)) {
        let params = new URLSearchParams()
        params.set('group', vm.selectedGroup.toString())
        if (!isNaN(vm.selectedWeek))
          params.set('week', vm.selectedWeek.toString())

        axios.get(`${API_URL}/api/timetable?${params.toString()}`, { responseType: 'json' })
          .then(resp => {
            if (resp.status === 200) {
              vm.timetable = resp.data
              vm.dataLoad.timetable = true
              vm.selectedWeek = vm.timetable.week
            }
          })
          .catch(err => console.log(err.toJSON()))
      }
      else
        vm.dataLoad.timetable = true
    }
  }
}
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
