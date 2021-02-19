<template>
  <div id="app">
    <Header v-bind:groups="groups.courses"
            v-bind:selected-group="selectedGroup"
            v-on:groupselect="groupChanged" />
    <div v-if="!isNaN(selectedGroup)">
      <Filters />
      <div v-for="day of timetable.days"
           v-bind:key="day.day">
        {{ day.day }}
        <table>
          <tr v-for="lesson of day.lessons"
              v-bind:key="lesson.number">
            <div v-if="lesson.info.length > 0">
              <td>{{ lesson.number }}</td>
              <td>{{ lesson.start }} - {{ lesson.end }}</td>
              <td>{{ lesson.info[0].name }}</td>
              <td>{{ lesson.info[0].cabinet }}</td>
            </div>
          </tr>
        </table>

      </div>
    </div>
    <div v-else>
    </div>
  </div>
</template>

<script>
import Header from './components/Header'
import Filters from './components/Filters'

const API_URL = 'http://localhost:9000'

export default {
  name: 'App',
  components: {
    Header,
    Filters
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
