<template>
  <div style="position: relative">
    <NavBar />
    <router-view :key="$route.fullPath"></router-view>
    <div v-if="scrollLocation" class="up box-shadow" @click="goUp">
      <p>^</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import NavBar from "./components/NavBar.vue";

const scrollLocation = ref(false);

onMounted(() => {
  document.addEventListener("scroll", () => {
    var top = window.pageYOffset || document.documentElement.scrollTop;

    scrollLocation.value = top > 250 ? true : false;
  });
});

const goUp = () => {
  window.scrollTo(0, 0);
};

const zoomPage = (num) => {
  zoomTo.value = num / 100;
};
</script>

<style>
.up {
  position: fixed;
  right: 60px;
  bottom: 20px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 40px;
  text-align: center;
  transform: translateY(0);
  animation: bounce 1s linear infinite;
}

.up p {
  margin-top: 5px;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(50%);
  }
  100% {
    transform: translateY(0);
  }
}

input[type="text"] {
  width: 22rem;
  height: 2rem;
  padding: 1px 10px;
  color: gray;
  outline: none;
  box-shadow: 1px 4px 10px black;
  border-radius: 4px;
  border: none;
}
</style>