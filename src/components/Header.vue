<template>
  <header>
    <h2>Расписание</h2>

    <select v-on:change="selectGroup">
      <option selected hidden>Группа</option>
      <optgroup v-for="courseGroups of groups"
                v-bind:key="courseGroups.course"
                v-bind:label="`${courseGroups.course} курс`">
        <option v-for="group of courseGroups.groups"
                v-bind:key="group.id" v-bind:value="group.id"
                v-bind:selected="parseInt(group.id, 10) === selectedGroup">
          {{ group.name }}
        </option>
      </optgroup>
    </select>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    selectedGroup: Number,
    groups: Array
  },
  methods: {
    selectGroup(event) {
      this.$emit('groupselect', event.target.value)
    }/*,
    changeWeek() {
      this.$emit('weekchange',)
    }*/
  }
}
</script>

<style lang="scss" scoped>
header {
  width: calc(100vw - 40px);
  height: 50px;
  background-color: #2c3e50;
  color: whitesmoke;
  padding: 0 20px;
  display: flex;
  align-items: center;
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

option {
  cursor: pointer;
}
</style>