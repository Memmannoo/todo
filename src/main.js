import { createApp } from "vue";
import "./style.css";

import App from "./App.vue";
import router from "./router/router";
import { createPinia } from "pinia";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons"; 
library.add(fas, fab);

createApp(App)
  .use(createPinia())
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .mount("#app");
