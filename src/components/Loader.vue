<template>
  <div class="loader-container">
    <div class="lds-dual-ring"></div>
    <div class="loader-title">{{ loaderText }}</div>
  </div>
</template>

<script setup lang="ts">

defineProps<{
  loaderText: string
}>();

</script>

<style lang="scss">

.loader-container {
  transition: visibility .3s;
}

// from loading.io
.lds-dual-ring {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20vh;
  height: 20vh;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 60%;
  height: 60%;
  margin: 8px;
  border-radius: 50%;
  border: 10px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
// from loading.io

.loader-container {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(44, 62, 80, .8);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.loader-title {
  color: white;
  user-select: none;
}
</style>
