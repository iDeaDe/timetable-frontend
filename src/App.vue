<template>
  <div id="app">
    <Header v-bind:groups="groups.courses"
            v-bind:selected-group="selectedGroup"
            v-on:groupselect="groupChanged" />
    <div v-if="!isNaN(selectedGroup)">
      <Filters />
      <Timetable v-bind:list="timetable.days" />
    </div>
    <div v-else>
      Группа не выбрана
    </div>
  </div>
</template>

<script>
import Header from './components/Header'
import Filters from './components/Filters'
import Timetable from './components/Timetable'

const API_URL = 'http://localhost:9000'

export default {
  name: 'App',
  components: {
    Header,
    Filters,
    Timetable
  },
  data: () => ({
    groups: {},
    timetable: {},
    selectedGroup: 0,
    selectedWeek: 0
  }),
  created() {
    let vm = this

    vm.selectedGroup = parseInt(localStorage.getItem('selectedgroup'), 10)

    // Fetch groups from API
    fetch(`${API_URL}/api/groups`, { method: 'GET' })
      .then(resp => {
        if (resp.status === 200) {
          return resp.json()
        }
      })
      .then(data => vm.groups = data)
      .catch(err => console.log(err))

    vm.loadTimetable()
  },
  methods: {
    // Событие изменения группы
    groupChanged(group) {
      localStorage.setItem('selectedgroup', group)
      this.selectedGroup = group
    },

    loadTimetable() {
      let vm = this

      if (!isNaN(vm.selectedGroup)) {
        let params = new URLSearchParams()
        params.set('group', vm.selectedGroup.toString())
        if (!isNaN(vm.selectedWeek))
          params.set('week', vm.selectedWeek.toString())

        fetch(`${API_URL}/api/timetable?${params.toString()}`, { method: 'GET' })
          .then(resp => {
            if (resp.status === 200) {
              return resp.json()
            }
          })
          .then(data => vm.timetable = data)
          .catch(err => console.log(err))
      }
    }
  }
}
</script>

<style>
*,
body,
html {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
