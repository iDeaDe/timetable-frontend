<template>
  <div id="app">
    <Loader v-if="isLoaderVisible" v-bind:loader-text="loaderText" />
    <Header v-bind:groups="groups.courses"
            v-bind:selected-group="selectedGroup"
            v-on:groupselect="groupChanged" />
    <div v-if="!isNaN(selectedGroup)">
      <Timetable v-bind:list="timetable.days" />
    </div>
    <div v-else>
      Группа не выбрана
    </div>
  </div>
</template>

<script>
import axios from 'axios'
//import isEmpty from 'lodash'

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
  beforeMount() {
    this.showLoader()
  },
  methods: {
    showLoader() {
      let vm = this

      let interval = setInterval(() => {
        vm.loaderText = 'Загрузка '

        if (vm.dataLoad.groups && vm.dataLoad.timetable) {
          console.log('Hello')
          vm.isLoaderVisible = false
          clearInterval(interval)
        }

        if (vm.dataLoad.groups && !vm.dataLoad.timetable) {
          console.log('Groups')
          vm.loaderText += 'групп'
          vm.isLoaderVisible = true
        }
        else if (!vm.dataLoad.groups && vm.dataLoad.timetable) {
          console.log('Timetable')
          vm.loaderText += 'расписания'
          vm.isLoaderVisible = true
        }
        else {
          vm.loaderText += 'данных'
          vm.isLoaderVisible = true
        }
      })
    },

    // Событие изменения группы
    groupChanged(group) {
      localStorage.setItem('selectedgroup', group)
      this.selectedGroup = parseInt(group, 10)
      this.loadTimetable()

    },

    onDataLoad() {
      let vm = this

      if (vm.groupsLoaded && vm.selectedGroup !== 0) {
        vm.dataLoaded = true
      }
      if (vm.groupsLoaded && vm.timetableLoaded) {
        vm.dataLoaded = true
      }
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
            }
          })
          .catch(err => console.log(err.toJSON()))
      }
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
</style>
