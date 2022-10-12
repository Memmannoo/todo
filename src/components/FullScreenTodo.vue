<template>
  <div class="full-screen-wrapper">
    <div class="full-screen-text" v-html="contentInFullScreen"></div>
    <p class="close-full-screen" @click="emit('closeFullScreen')">X</p>
  </div>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core";

const { contentInFullScreen } = defineProps({
  contentInFullScreen: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["closeFullScreen"]);

onMounted(() => {
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      emit("closeFullScreen");
    }
  });
});
</script>

<style scoped>
.full-screen-wrapper{
  width: 100%;
}
.full-screen-text {
  position: fixed;
  width: 100%;
  top: 78px;
  left: 0;
  height: calc(100vh - 78px);
  min-height: 100%;
  background: linear-gradient(to right, rgba(0, 0, 55, 0.5), rgb(114, 34, 34));
  backdrop-filter: blur(10px);
  color: white;
  z-index: 999999;
  width: 100%;
  overflow: auto;
  padding: 20px;
  padding-top: 40px;
}

.close-full-screen {
  position: fixed;
  right: 20px;
  top: 45px;
  font-size: 2em;
  z-index: 99999;
  cursor: pointer;
  border: 1px solid #fff;
  border-radius: 50%;
}





.full-screen-text span ul,
.full-screen-text span ol {
  margin-left: 20px;
}

.full-screen-text span ul li,
.full-screen-text span ol li {
  margin: 10px 25px;
}

.full-screen-text p ul {
  list-style: disc;
}

.full-screen-text span p {
  padding: 5px;
  letter-spacing: 1.2px;
  word-break: break-all;
}

.full-screen-text span p img {
  max-width: 70%;
}

</style>