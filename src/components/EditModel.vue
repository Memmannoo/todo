<template>
  <div class="edit-model flex flexColumn">
    <div
      class="close flex flexCenter box-shadow"
      @click="storeProjects.openEditModel = false"
    >
      <p>x</p>
    </div>
    <form
      @submit.prevent="updateProject"
      class="form flex flexColumn flexCenter"
    >
      <label for=""
        >Edit: {{ storeProjects.editModelData.id }} -
        {{ singleProjectData.project_name }}</label
      >
      <input
        type="text"
        placeholder="Projects Name"
        v-model="singleProjectData.project_name"
      />
      <div
        class=""
        v-if="v$.project_name.$errors[0]"
        style="width: 25rem; margin-bottom: 15px"
      >
        <span style="color: red; margin-left: 10px">{{
          v$.project_name.$errors[0].$message
        }}</span>
      </div>
      <input
        type="text"
        placeholder="Projects Description"
        v-model="singleProjectData.project_description"
      />
      <div
        class=""
        v-if="v$.project_description.$errors[0]"
        style="width: 25rem; margin-bottom: 15px"
      >
        <span style="color: red; margin-left: 10px">{{
          v$.project_description.$errors[0].$message
        }}</span>
      </div>
      <input
        type="date"
        class="box-shadow"
        v-model="singleProjectData.due_to"
      />
      <div
        class=""
        style="width: 25rem; margin-bottom: 15px"
        v-if="v$.due_to.$errors[0]"
      >
        <span
          v-for="error in v$.due_to.$errors"
          :key="error"
          style="color: red; margin-left: 10px; display: block"
          >{{ error.$message }}</span
        >
      </div>

      <button
        type="submit"
        style="width: 5rem; height: 3rem; color: #000; cursor: pointer"
      >
        Update
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "@vue/reactivity";
import { computed, onMounted } from "@vue/runtime-core";
import { useProjectsStore } from "../store/projects";

import useVuelidate from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";

const storeProjects = useProjectsStore();

const singleProjectData = ref({
  project_name: null,
  project_description: "",
  due_to: null,
  updated_at: new Date(Date.now()).toLocaleDateString(),
});

const maxDate = (val) => val > new Date().toISOString(); //for validating due_to

const rules = computed(() => {
  return {
    project_name: {
      required: helpers.withMessage("Project name is required", required),
    },
    project_description: {
      required: helpers.withMessage("Desc name is required", required),
    },
    due_to: {
      required: helpers.withMessage("Project name is required", required),
      maxDate: helpers.withMessage("due date is greater than today!!", maxDate),
    },
  };
});

const v$ = useVuelidate(rules, singleProjectData);

onMounted(async () => {
  await storeProjects.getProjectById(storeProjects.editModelData.id);
  singleProjectData.value = {
    ...JSON.parse(JSON.stringify(storeProjects.project)),
  };
});

const updateProject = async () => {
  const validateResult = await v$.value.$validate();

  if (validateResult) {
    
    await storeProjects.updateProject(
      storeProjects.editModelData.id,
      singleProjectData.value
    );

    await storeProjects.projects.map((project, i) => {
      if (project.id === storeProjects.editModelData.id) {
        storeProjects.projects[i] = singleProjectData.value;
      }
    });

    storeProjects.openEditModel = false;
  }
};
</script>

<style>
.edit-model {
  width: 30rem;
  min-height: 60vh;
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(to left, rgba(0, 0, 55, 0.5), rgb(114, 34, 34));
  backdrop-filter: blur(2px);
  overflow-y: auto;
  padding-bottom: 10px;
}

.close {
  margin-left: 92%;
  width: 30px;
  height: 30px;
  background-color: #573232;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
}

.form {
  margin-top: 50px;
  row-gap: 20px;
}

.form input[type="date"] {
  width: 22rem;
  margin-bottom: 15px;
  height: 2rem;
  color: gray;
  border: none;
  outline: none;
  padding: 0px 10px;
  border-radius: 4px;
  font-size: 15px;
}
</style>
