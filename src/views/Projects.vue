<template>
  <div :style="{ zoom: storeProjects.zoom }">
    <div class="project-create flexCenter">
      <router-link :to="{ name: 'CreateProject' }"
        ><p class="box-shadow">Create</p></router-link
      >
      <input
        type="checkbox"
        v-model="checked"
        style="display: none"
        name=""
        id="edit"
      />
      <label for="edit" class="check-box box-shadow flexCenter">Edit</label>
    </div>
    <div v-if="!storeProjects.projectLoader">
      <div class="" v-if="projects.length">
        <div
          class="projects-wrapper flex justify-center box-shadow"
          style="flex-wrap: wrap"
          @click.self="storeProjects.openEditModel = false"
        >
          <div
            class="flex flexCenter"
            style="flex-wrap: wrap; gap: 20px; position: relative"
            v-for="(project, i) in projects"
            :key="i"
          >
            <router-link :to="{ name: 'Todo', params: { id: project.id } }">
              <div class="project-number flexCenter box-shadow">
                <p>{{ i + 1 }}</p>
              </div>
              <div
                class="project-card box-shadow background-transparent flexColumn"
                :style="{ 'animation-delay': `${0.2 * i}s` }"
              >
                <div class="project-header">
                  <p>Project Name: {{ project.project_name }}</p>
                </div>
                <div class="project-body">
                  <p>Descript: {{ project.project_description }}</p>
                </div>
                <div class="project-footer">
                  <p>Created at: {{ project.created_at }}</p>
                  <p>Due to: {{ project.due_to }}</p>
                </div>
              </div>
            </router-link>
            <div
              class="edit-delete flexCenter"
              :class="[checked ? 'show-edit-delete' : '']"
              :style="{ transition: `all ${0.1 * i}s ease` }"
            >
              <div
                style="cursor: pointer"
                @click="openEditModel(project.id, project.project_name)"
              >
                <font-awesome-icon
                  class="icons edit"
                  :icon="['fa', 'pen-to-square']"
                />
              </div>
              <div style="cursor: pointer" @click="deleteProject(project.id)">
                <font-awesome-icon
                  class="icons delete"
                  :icon="['fa', 'trash-can']"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="" v-else>
        <div class="projects-wrapper flex justify-center">
          No Projects Found
        </div>
      </div>
    </div>

    <div class="" v-else>
      <div class="projects-wrapper flex justify-center">Loading...</div>
    </div>
  </div>
  <asycnEditModel v-if="storeProjects.openEditModel" />
</template>

<script setup>
import {
  defineAsyncComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "@vue/runtime-core";
import { useRouter } from "vue-router";
import { useProjectsStore } from "../store/projects";
import { useTodosStore } from "../store/todos";
import LoadingComponen from "../components/LoadingComponen.vue";
const router = useRouter();

const storeProjects = useProjectsStore();
const storeTodos = useTodosStore();

const projects = ref([]);
const checked = ref(false);

onMounted(async () => {
  await storeProjects.getAllProjects();
  projects.value = storeProjects.projects.reverse();
});

watch(
  () => storeProjects.projects,
  (newVal, oldVal) => {
    projects.value = newVal;
  }
);

onUnmounted(() => {
  storeProjects.projectLoader = true;
});

const asycnEditModel = defineAsyncComponent({
  // the loader function
  loader: () => import("../components/EditModel.vue"),

  // A component to use while the async component is loading
  loadingComponent: LoadingComponen,
  // Delay before showing the loading component. Default: 200ms.
  delay: 100,

  // A component to use if the load fails
  // errorComponent: ErrorComponent,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  // timeout: 3000
});

const openEditModel = (id, projectName) => {
  storeProjects.openEditModel = true;
  storeProjects.editModelData = { id: id, projectName: projectName };
};

const deleteProject = async (id) => {
  if (confirm("are you sure")) {
    await storeProjects.deleteProject(id);
    storeProjects.projects = storeProjects.projects.filter((project) => {
      return project.id != id;
    });
  }
};
</script>

<style>
body {
  overflow-x: hidden !important;
}

.project-create {
  margin-top: 20px;
}

.project-create p {
  margin-right: 20px;
  padding: 10px 20px;
  background-color: transparent;
  min-width: 90px;
  text-align: center;
  cursor: pointer;
}

.check-box {
  margin-right: 20px;
  /* padding: 10px 20px; */
  height: 40px;
  background-color: transparent;
  min-width: 90px;
  text-align: center;
  cursor: pointer;
  border-radius: 50px;
  position: relative;
}

.check-box::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 40px;
  background: linear-gradient(to right, rgb(114, 34, 34), rgba(0, 0, 55, 0.5));
  border-radius: 50%;
  box-shadow: 1px 2px 10px black;
  transition: transform 0.5s ease;
}

#edit:checked ~ .check-box::before {
  transform: translateX(calc(90px - 100%));
  background: linear-gradient(to right, rgba(0, 0, 55, 0.5), rgb(114, 34, 34));
}

.projects-wrapper {
  width: 85%;
  margin: 0 auto;
  padding: 2rem 0;
  flex-wrap: wrap;
  gap: 20px;
}
.project-card {
  width: 15rem;
  padding: 20px 14px;
  cursor: pointer;
  min-height: 10rem;
  max-height: 10rem;
  overflow-y: auto;
  padding-bottom: 20px;
  opacity: 1;
  animation: showCard 0.2s;
  /* animation: name duration timing-function delay iteration-count direction fill-mode; */
}

@keyframes showCard {
  /* 0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  } */
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.project-card::-webkit-scrollbar {
  width: 5px;
  border-radius: 50%;
}

.project-card::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(0, 0, 55, 0.5), rgb(114, 34, 34));
  border-top-right-radius: 50%;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 80%;
  border-bottom-left-radius: 40%;
}
.project-number {
  position: absolute;
  top: 0;
  left: 50%;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: transparent;
  transform: translate(-50%, -50%);
  font-size: 15px;
}

.project-header,
.project-body {
  margin: 10px 0;
  border-bottom: 1px dashed gray;
  padding-bottom: 2px;
  width: 100%;
  white-space: wrap;
  word-wrap: break-word;
  text-justify: inter-word;
}

.edit-delete {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-70%, -50%);
  gap: 100px;
  opacity: 0;
  pointer-events: none;
  transition: all 0.5s ease;
}

.show-edit-delete {
  transform: translate(-50%, -50%);
  opacity: 1;
  pointer-events: all;
  transition: all 0.5s ease;
}
.icons {
  margin: 0 10px;
  border-radius: 50%;
  color: transparent;
  width: 20px;
  height: 20px;
}

.icons:hover {
  color: black;
}
</style>