<template>
  <div class="new-category flexCenter" @click.self="closeNewCategory">
    <font-awesome-icon
      class="icon box-shadow"
      :icon="['fa', 'x']"
      @click="closeNewCategory"
    />
    <div class="new-category-content flexColumn align-center box-shadow">
      <p>Enter category name</p>
      <form class="form flexColumn" @submit.prevent="manageCategory">
        <input
          type="text"
          ref="categoryInput"
          v-model="addCategory"
          placeholder="Enter category name here"
          :style="{
            border: v$.addCategory.$error ? '1px solid red' : '1px solid gray',
          }"
          @blur="v$.addCategory.$touch"
        />
        <button v-if="!editMode" class="box-shadow" type="submit">Add</button>
        <div class="" v-else>
          <button class="box-shadow" type="submit">Edit</button>
          <button type="button" style="background-color: red" @click="deleteCategory">
            Delete
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { useTodosStore } from "../store/todos";

import useVuelidate from "@vuelidate/core";
import { required, helpers, minLength } from "@vuelidate/validators";

const addCategory = ref(null); // vmodel

const categoryInput = ref(null); //ref for focus the add input

const rules = computed(() => ({
  addCategory: {
    required: helpers.withMessage("Category Name is required", required),
  },
}));

const v$ = useVuelidate(rules, { addCategory });

const emit = defineEmits([
  "closeNewCategory",
  "addCategory",
  "deleteCategory",
  "editCategory",
]);

const { editMode, categoryName } = defineProps({
  editMode: {
    default: false,
    type: Boolean,
  },

  categoryName: {
    type: String,
    default: "",
  },
});

const route = useRoute();

const closeNewCategory = () => emit("closeNewCategory"); // func to close by emit

onMounted(() => {
  document.querySelector("body").style.overflow = "hidden";
  addCategory.value = categoryName;
  categoryInput.value.focus();
});

onBeforeUnmount(() => (document.querySelector("body").style.overflow = "auto"));

const storeTodo = useTodosStore();

const manageCategory = async () => {
  const validated = await v$.value.addCategory.$validate();
  console.log(editMode, validated)
  if (!editMode && validated) {
    //then it is adding new one
    emit("addCategory", addCategory.value);
  } else if(editMode && validated){
    emit("editCategory", addCategory.value)
  }
};

const deleteCategory = () => {
  if (confirm("are you sure want to delete \n**" + categoryName + "**")) {
    emit("deleteCategory");
  }
};
</script>

<style scoped>
.new-category {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  background-color: rgba(48, 48, 48, 0.5);
  z-index: 1;
}

.icon {
  width: 25px;
  height: 25px;
  padding: 10px;
  border: solid 1px white;
  border-radius: 50%;
  position: absolute;
  top: 90px;
  right: 25px;
}

.new-category-content {
  width: 24rem;
  height: 20rem;
  background-color: rgba(17, 11, 11, 0.5);
  padding: 20px;
}

.new-category-content p {
  font-size: 22px;
  font-weight: 900;
  margin-bottom: 45px;
}

.form {
  gap: 30px;
  width: 100%;
}

input[type=text]{
  width: 100%;
}
button {
  width: 50%;
  margin: 0 auto;
  height: 25px;
  cursor: pointer;
  background: transparent;
}
</style>