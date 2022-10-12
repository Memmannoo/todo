<template>
  <div
    style="
      overflow: hidden;
      position: sticky;
      top: 0;
      z-index: 12;
      min-height: 85px;
    "
  >
    <div
      class="navbar flexColumn justify-center box-shadow"
      @click="storeProjects.openEditModel = false"
    >
      <nav class="nav flex align-center">
        <input
          type="range"
          min="30"
          max="100"
          v-model="zoomPage"
          @input="storeProjects.zoom = (130 - zoomPage) / 100"
        />

        <div class="logo flexCenter">
          <router-link to="/" class="icon-wrapper flexCenter"
            ><div class="icon-wrapper flexCenter">
              <font-awesome-icon
                class="icon"
                :icon="['fas', 'clipboard-check']"
              /></div
          ></router-link>
        </div>
        <div class="nav-links flexCenter">
          <ul class="flex flexCenter">
            <li class="nav-link">
              <router-link
                to="/"
                @click="(searchProject = []), (searchTodo = []), (search = '')"
                class="link"
                >Projects</router-link
              >
            </li>
            <li class="nav-link">
              <input
                type="text"
                v-model="search"
                placeholder="Search a project, todo"
              />
            </li>
          </ul>
        </div>

        <div
          class="toggle-menu flex"
          @click="
            (toggleMenuClicked = !toggleMenuClicked),
              (searchProject = []),
              (searchTodo = []),
              (search = '')
          "
          :class="{ 'change-toggle-menu': toggleMenuClicked }"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </div>
  </div>

  <!-- MOBILE NAV -->
  <div
    class="sidebar flexCenter"
    :class="{ 'show-sidebar': toggleMenuClicked }"
    style="z-index: 1222"
  >
    <div class="flexCenter sidebar-container">
      <ul class="flex flexCenter">
        <li class="nav-link">
          <router-link
            to="/"
            @click="
              (searchProject = []),
                (searchTodo = []),
                (search = ''),
                (toggleMenuClicked = !toggleMenuClicked)
            "
            class="link"
            >Projects</router-link
          >
        </li>
        <li class="nav-link">
          <input
            type="text"
            v-model="search"
            placeholder="Search a project, todo"
          />
        </li>
      </ul>
    </div>
  </div>
  <!-- END MOBILE NAV -->

  <!-- SEARCH CONTENT -->
  <div
    class="search-content flex"
    v-if="searchProject.length || searchTodo.length || search"
    style="z-index: 1223"
  >
    <font-awesome-icon
      @click="(searchProject = []), (searchTodo = []), (search = '')"
      style="
        padding: 10px 10px;
        border: 1px solid white;
        border-radius: 50%;
        cursor: pointer;
        margin: 10px;
      "
      class="close-search"
      :icon="['fa', 'x']"
    />
    <div class="search-project">
      <p class="search-title">Projects found: {{ searchProject.length }}</p>
      <div class="search-project-found" v-if="searchProject.length">
        <div class="" v-for="(project, i) in searchProject" :key="i">
          <router-link
            class="project-link"
            :to="{ name: 'Todo', params: { id: project.id } }"
            @click="(searchProject = []), (searchTodo = []), (search = '')"
          >
            <p>{{ project.project_name }}</p>
          </router-link>
        </div>
      </div>
      <div class="search-project-not-found" v-else>No Projects were found!</div>
    </div>

    <div class="search-todo">
      <p class="search-title">Todos in projects found</p>
      <div>
        <div v-for="(todo, i) in searchTodo" :key="i">
          <div class="search-todo-found" v-if="true">
            <router-link
              :to="{
                name: 'Todo',
                params: { id: todo.id },
              }"
              class="todo-router-link"
              @click="(searchProject = []), (searchTodo = []), (search = '')"
            >
              <p class="todo-project-name">{{ todo.project_name }}:</p>
              <div class="todo-list">
                <div
                  v-for="(singleTodo, index) in todo.todo"
                  :key="index"
                  class="single-todo flex"
                >
                  <div v-if="todo.todo[index].length">
                    <span style="margin-right: 10px"
                      >{{ storeTodos.todos[i].todo[index].name }}:</span
                    >
                    <p style="margin-left: 15px" v-html="singleTodo"></p>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="search-project-not-found" v-if="noTodoFound">
        No todo were found!
      </div>
    </div>
  </div>
  <!-- END SEARCH CONTENT -->
</template>

<script setup>
import { ref } from "@vue/reactivity";
import { onMounted, watch } from "@vue/runtime-core";
import { useProjectsStore } from "../store/projects";
import { useTodosStore } from "../store/todos";

const toggleMenuClicked = ref(false);
const storeProjects = useProjectsStore();
const storeTodos = useTodosStore();

const search = ref(null);
const searchProject = ref([]);
const searchTodo = ref([]);
const noTodoFound = ref(null);
const emtpyTodo = ref([]);

const zoomPage = ref(1)

onMounted(async () => {
  if (!storeProjects.projects) {
    await storeProjects.getAllProjects();
  }

  if (!storeTodos.todos.length) {
    await storeTodos.getAllTodos();
  }
});

watch(search, async (newVal) => {
  if (newVal) {
    searchProject.value = await storeProjects.projects.filter((project) => {
      return project.project_name
        .toLowerCase()
        .trim()
        .includes(newVal.toLowerCase().trim());
    });

    searchTodo.value = await storeTodos.todos.map((allTodos) => {
      let todo = allTodos.todo.map((firstSingleTodo, i) => {
        return firstSingleTodo.data.filter((singleTodo) => {
          if (singleTodo.toLowerCase().includes(newVal.trim().toLowerCase())) {
            return singleTodo;
          }
        });
      });

      let id = allTodos.id;
      let project_name = storeProjects.projects.filter(
        (project) => project.id == id
      );

      project_name = project_name[0].project_name;
      return { todo, id, project_name };
    });
  } else {
    searchProject.value = [];
    searchTodo.value = [];
  }

  document.querySelector("body").style.overflowY =
    searchTodo.value.length || searchProject.value.length || search.value
      ? "hidden"
      : "auto";
});
</script>

<style scoped>
/* Search Content */
.search-content {
  position: fixed;
  top: 84px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(48, 48, 48, 0.8);
  width: 100%;
  height: 95vh;
}

@media screen and (max-width: 830px) {
  .search-content {
    margin-top: 76px;
  }
  .search-content {
    top: 95px;
  }
}

@media screen and (max-width: 700px) {
  .search-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .search-project,
  .search-todo {
    min-width: 100%;
    padding: 0px !important;
  }

  .search-project {
    border-bottom: 3px solid #000;
    min-height: 40%;
    max-height: 40%;
  }

  .close-search {
    display: none;
  }

  .search-title {
    position: sticky;
    top: 0;
    background-color: #580d0d;
    z-index: 11;
    padding: 10px !important;
  }

  .search-project-found {
    width: 70% !important;
    margin: 0 auto !important;
  }

  .project-link {
    padding: 0 !important;
    margin: 0 !important;
  }

  .project-link p {
    padding: 0 !important;
    padding-left: 10px !important;
    max-height: 30px !important;
    font-size: 30px !important;
  }
}

.search-project,
.search-todo {
  width: 50%;
  padding: 40px;
  max-height: 85%;
  overflow: auto;
}

.search-title {
  font-size: 1.7em;
  letter-spacing: 1.2px;
  text-align: center;
  text-shadow: 1px 4px 0px #000;
  margin-bottom: 30px;
  border-bottom: 1px dashed #fff;
  padding-bottom: 20px;
}

.search-project {
  border-right: 1px solid white;
}

.search-project::-webkit-scrollbar,
.search-todo::-webkit-scrollbar {
  width: 9px;
}

.search-project::-webkit-scrollbar-track,
.search-todo::-webkit-scrollbar-track {
  background: #580d0d;
}

.search-project::-webkit-scrollbar-thumb,
.search-todo::-webkit-scrollbar-thumb {
  background: rgb(226, 225, 225);
}

.search-project-not-found {
  text-align: center;
  font-size: 1.4em;
  font-weight: 700;
  margin-top: 40px;
  margin-bottom: 20px;
}

.search-project-found {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.search-project-found .project-link {
  width: 100%;
}

.search-project-found .project-link p {
  font-size: 2em;
  background-color: #30303030;
  box-shadow: 1px 10px 8px #000;
  padding: 20px 40px;
  transition: all 0.2s linear;
}

@media screen and (max-width: 954px) {
  .search-title {
    font-size: 1.2em;
  }
}
.search-project-found .project-link:hover p {
  box-shadow: -3px -10px 12px #000;
  background: linear-gradient(
    to right,
    rgba(0, 0, 55, 0.6),
    rgba(114, 34, 34, 0.8)
  );
  backdrop-filter: blur(2px);
}

.todo-router-link {
  width: 100%;
  height: 200px;
}

.search-todo-found {
  width: 100%;
  height: auto;
  padding: 10px 20px;
  background-color: #30303030;
  box-shadow: 1px 10px 8px #000;
  margin-bottom: 30px;
  transition: all 0.5s linear;
}

.search-todo-found:hover {
  box-shadow: -3px -10px 12px #000;
  background: linear-gradient(
    to right,
    rgba(0, 0, 55, 0.6),
    rgba(114, 34, 34, 0.8)
  );
  backdrop-filter: blur(2px);
}

.todo-project-name {
  font-size: 1.5em;
  font-weight: 900;
  color: rgb(231, 212, 212);
  text-shadow: 2px 5px 2px #000;
  /* margin-bottom: -15px; */
  width: 90%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.todo-list {
  width: 100%;
  padding-left: 30px;
  padding-bottom: 10px;
}

.single-todo {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 5px;
  box-shadow: -15px 2px 55px black;
}

/* End search Content */
.sidebar {
  height: 100%;
  width: 100%;
  background: linear-gradient(to left, rgba(0, 0, 55, 0.5), rgb(114, 34, 34));
  backdrop-filter: blur(2px);
  position: fixed;
  bottom: -5rem;
  right: 0;
  transform: translateX(160%);
  transition: all 0.5s;
}

@media screen and (max-width: 830px) {
  .sidebar {
    height: 100px;
    top: 80px;
  }
}

@media screen and (max-width: 678px) {
  .sidebar-container ul {
    flex-direction: column;
    gap: 20px;
  }

  .sidebar-container ul li {
    margin: 0;
    padding: 0;
  }
}

.toggle-menu {
  width: 38px;
  height: 38px;
  flex-direction: column;
  justify-content: space-around;
  position: absolute;
  right: 30px;
  display: none;
}

.toggle-menu span {
  width: 100%;
  height: 4px;
  background: linear-gradient(
    to right,
    rgb(60, 60, 124) 35%,
    rgb(189, 70, 70) 65%
  );
  transition: all 0.5s;
}

.change-toggle-menu span:first-child {
  transform: rotate(45deg) translateY(18px);
}
.change-toggle-menu span:last-child {
  transform: rotate(-45deg) translateY(-18px);
}
.change-toggle-menu span:nth-child(2) {
  opacity: 0;
}

.show-sidebar {
  transform: translateX(0px);
}

@media screen and (max-width: 830px) {
  .nav-links {
    display: none;
  }
  .toggle-menu {
    display: flex;
  }
}

.navbar {
  height: 5rem;
  width: 100%;
  background: linear-gradient(to left, rgba(0, 0, 55, 0.5), rgb(114, 34, 34));
  backdrop-filter: blur(2px);
  padding: 0 30px;
}

.nav {
  height: 100%;
  width: 100%;
  text-align: center;
  z-index: 122088;
}

.logo {
  width: 9rem;
  height: 80%;
}

.icon-wrapper {
  height: 100%;
  border-radius: 5px;
  width: 4rem;
  height: 100%;
  border-radius: 50%;
  box-shadow: 1px 4px 10px black;
}

.icon {
  height: 70%;
  border-radius: 5px;
  background-color: transparent;
  cursor: pointer;
}

.nav-links {
  margin-left: 80px;
  height: 100%;
}

.nav-link {
  margin-right: 100px;
  letter-spacing: 1px;
}

.link {
  padding: 10px 20px;
  background-color: transparent;
  border-radius: 5px;
  transition: all 0.5s ease;
  box-shadow: 1px 4px 10px black;
}

.link:hover {
  border-radius: 0;
  background-color: rgba(0, 0, 0, 0.8);
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