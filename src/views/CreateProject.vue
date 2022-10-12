<template>
  <div class="create-project-wrapper flex flexColumn align-center">
    <p>Create new project</p>
    <form @submit.prevent="save" class="form flex flexColumn align-center">
      <input
        type="text"
        @blur="v$.project_name.$touch"
        v-model="projectData.project_name"
        placeholder="Projects Name"
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
        @blur="v$.project_description.$touch"
        v-model="projectData.project_description"
        placeholder="Projects Description"
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
        @blur="v$.due_to.$touch"
        type="date"
        v-model="projectData.due_to"
        class="box-shadow"
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

      <button class="save-btn box-shadow">Save</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "@vue/reactivity";
import { useProjectsStore } from "../store/projects";
import { useTodosStore } from "../store/todos";
import { useRouter, useRoute } from "vue-router";

import useVuelidate from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { computed } from "@vue/runtime-core";

const storeProjects = useProjectsStore();
const storeTodos = useTodosStore();
const router = useRouter();

const projectData = reactive({
  project_name: "",
  project_description: "",
  created_at: new Date(Date.now()).toLocaleDateString(),
  due_to: null,
  updated_at: null,
});

const minValue = (value) => value > new Date().toISOString(); //for validating due_to

const rules = computed(() => {
  return {
    project_name: {
      required: helpers.withMessage("Name is required", required),
    },
    project_description: {
      required: helpers.withMessage("Description is required", required),
    },
    created_at: { required },
    due_to: {
      required: helpers.withMessage("Due date is required", required),
      minValue: helpers.withMessage(
        "Date must be today or after today",
        minValue
      ),
    },
  };
});

const v$ = useVuelidate(rules, projectData);

const save = async () => {
  const validateResult = await v$.value.$validate();

  if (validateResult) {
    await storeProjects.saveProject(projectData);

    storeTodos.$reset();

    await storeTodos.saveTodo(storeProjects.project.id).then(() => {
      storeTodos.getAllTodos(); // for search
      storeTodos.getTodo(storeProjects.project.id).then(() => {
        router.push({ name: "Todo", params: { id: storeProjects.project.id } });
      });
    });
  }
};
</script>

<style>
.create-project-wrapper {
  width: 80%;
  margin: 10px auto;
}

.create-project-wrapper p:first-child {
  margin: 20px 0 35px 0;
  font-size: 2rem;
  font-weight: 700;
}

.form {
  width: 100%;
}

.form input {
  width: 25rem;
  margin-bottom: 15px;
}

.form input[type="date"] {
  width: 25rem;
  margin-bottom: 15px;
  height: 2rem;
  color: gray;
  border: none;
  outline: none;
  padding: 0px 10px;
  border-radius: 4px;
  font-size: 15px;
}

.form .save-btn {
  width: 5rem;
  height: 2rem;
  color: #000;
}
</style>