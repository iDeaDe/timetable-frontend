<template>
  <main>
    <div class="timetable-container"
         v-for="chunk of chunkedList"
         :key="chunk[0].day">
      <div class="day-block"
           v-for="day of chunk"
           :key="day.day">
        <div class="day-title">{{ day.day }}</div>
        <table class="day-table">
          <tbody class="lesson-info"
                 v-for="lesson of day.lessons"
                 :key="lesson.number">
            <tr class="day-row"
                v-for="(info, index) in lesson.info"
                :key="Math.random() + info.cabinet">

              <td class="lesson-number">
                <span v-if="index === 0 || lesson.info.length === 1">
                  {{ lesson.number }}
                </span>
              </td>
              <td class="lesson-time">
                <span v-if="index === 0 || lesson.info.length === 1">
                  <div>{{ lesson.start }}</div>
                  <div>{{ lesson.end }}</div>
                </span>
              </td>
              <td class="lesson-name"
                  :class="info.canceled ? 'lesson-canceled' : ''">
                {{ info.name }}<span class="lesson-teacher" v-if="info.teacher !== ''">({{ info.teacher }})</span>
              </td>
              <td class="lesson-cabinet"
                  :class="info.canceled ? 'lesson-canceled' : ''">{{ info.cabinet }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { chunk } from 'lodash';
import { computed } from 'vue';
import { WeekDayInterface } from '../lib/timetable/TimetableInterface';

const props = defineProps<{
  list?: Array<WeekDayInterface>
}>();

const chunkedList = computed(() => chunk(props.list, 3) as Array<Array<WeekDayInterface>>);

</script>

<style lang="scss">

$mainBorder: #2c3e50;
$innerBorder: #6782b5;

.timetable-container {
  margin-top: 10px;
  width: 100vw;
  display: flex;
  justify-content: space-around;
}

.day-block {
  flex: 1;
  border: 1px solid $mainBorder;
  border-radius: 4px;
  width: 26%;
  margin: 0 10px 15px;

  .day-title {
    display: block;
    margin: 0;
    padding: 5px 10px;
    border-bottom: 1px solid $mainBorder;
    border-radius: 4px 4px 0 0;
  }
}

.day-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

td {
  padding: 5px 0;
  border: none;
}

td:first-child {
  padding-left: 10px;
}

tr:last-child {
  padding-right: 10px;
  border-radius: 0 0 4px 4px;
}

.day-row {
  padding: 10px;

  &:last-child {
    border: none;
  }
}

.lesson-info {
  border-bottom: 1px solid $innerBorder;

  &:last-child {
    border: none;
  }
}

.lesson-canceled {
  background-color: #ff8282;
  border: none;
}

.lesson-time {
  display: inline-flex;
  flex-direction: column;
  font-size: 12px;
}

.lesson-name {
  padding-left: 3px;
}

.lesson-teacher {
  font-size: 12px;
}

.lesson-cabinet {
  text-align: center;
}

@media screen and (max-width: 900px) {
  .timetable-container {
    flex-direction: column;
    align-items: center;
  }

  .lesson-teacher {
    display: block;
  }

  .day-block {
    width: 80%;
    margin: 10px 0;
  }
}
</style>