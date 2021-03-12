<template>
  <header>
    <div>
      <h2>Расписание</h2>

      <select aria-label="Выбор группы" v-on:change="selectGroup">
        <option selected hidden>Группа</option>
        <optgroup v-for="courseGroups of groups"
                  v-bind:key="courseGroups.course"
                  v-bind:label="`${courseGroups.course} курс`">
          <option v-for="group of courseGroups.groups"
                  v-bind:key="group.id" v-bind:value="group.id"
                  v-bind:selected="group.id === selectedGroup">
            {{ group.name }}
          </option>
        </optgroup>
      </select>
    </div>
    <div>
      <button aria-label="Обновления" class="header-btn"><img class="header-btn-img" src="../assets/notification.svg" alt="Уведомления"></button>
    </div>
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
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #394f69;
  }
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