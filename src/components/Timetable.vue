<template>
  <main class="timetable-grid">
    <div v-for="chunk of listChunked" v-bind:key="chunk">
      <div class="day-block"
           v-for="day of chunk"
           v-bind:key="day.day">
        {{ day.day }}
        <table>
          <tr v-for="lesson of day.lessons"
              v-bind:key="lesson.number">
            <div class="lesson-info"
                 v-if="lesson.info.length > 0">
              <td>{{ lesson.number }}</td>
              <td>
                <div class="lesson-time">
                  <div>{{ lesson.start }}</div>
                  <div>{{ lesson.end }}</div>
                </div>
              </td>
              <td>{{ lesson.info[0].name }}</td>
              <td>{{ lesson.info[0].cabinet }}</td>
            </div>
          </tr>
        </table>
      </div>
    </div>
  </main>
</template>

<script>
import { chunk } from 'lodash'

export default {
  name: 'Timetable',
  props: {
    list: Array
  },
  data: () => ({
     listChunked: []
  }),
  beforeMount() {
    let vm = this
    console.log(chunk(vm.list, 3))
  },
  mounted() {
    console.log(this.listChunked)
  }
}
</script>

<style scoped>
main {
  width: 100vw;
}

.timetable-grid {
  display: grid;
  grid-template-columns: 300px auto 300px auto 300px;
}

tr {
  margin: 0 10px;
  padding: 5px 0;
  border-bottom: 1px solid #2c3e50;
}

tr:last-child {
  border: none;
}

.day-block {
  display: inline-block;
  border: 1px solid #2c3e50;
  border-radius: 4px;
  padding: 10px;
}

.lesson-time {
  display: inline-flex;
  flex-direction: column;
  font-size: 12px;
}

.lesson-info {
  display: flex;
  align-items: flex-end;
}
</style>