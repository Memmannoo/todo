<template>
  <div
    v-if="todoData"
    class="todo flexColumn align-center"
    :style="{ zoom: storeProjects.zoom }"
  >
    <div class="header">
      <p>Project Name: {{ todoData.project.project_name }}</p>
    </div>
    <div class="todo-input box-shadow">
      <form @submit.prevent="addTodo('add')" class="flexColumn">
        <TinyRichText
          v-model="todoToAdd"
          @keydown.ctrl.enter="addTodo('add')"
        />
        <button type="submit" class="button">Save</button>
        <transition name="error">
          <div v-if="v$.todoToAdd.$errors.length" class="todo-error flexCenter">
            {{ v$.todoToAdd.$errors[0].$message }}
          </div>
        </transition>
      </form>
    </div>
    <div class="categories-actions flex flexCenter">
      <div
        class="category-action flexCenter box-shadow"
        v-for="(category, i) in todoData.todo"
        :key="i"
      >
        <input
          type="radio"
          style="display: none"
          :value="i"
          v-model="categorySelected"
          name="category"
          :id="'category' + i"
        />
        <label :for="'category' + i" :class="'category-label-' + i">{{
          category.name
        }}</label>
      </div>
    </div>
    <div
      class="infos box-shadow"
      :style="{
        width: showInfos ? '30rem' : '35px',
        transition: 'width 0.2s, height 0.7s',
        height: showInfos ? '20rem' : '35px',
      }"
    >
      <div
        class="open-infos flexCenter"
        v-if="!showInfos"
        @click="showInfos = true"
      >
        <font-awesome-icon
          class="icon"
          :icon="['fa', 'arrow-up-from-bracket']"
        />
      </div>
      <div class="close-infos" v-if="showInfos" @click="showInfos = false">
        <font-awesome-icon :icon="['fa', 'x']" />
        <p
          style="
            text-align: center;
            color: rgba(255, 255, 255, 0.7);
            font-size: 34px;
            text-shadow: 0px 5px 0 black;
          "
        >
          Infos
        </p>
      </div>
      <div class="infos-content" v-if="showInfos">
        <p style="text-align: center; margin-bottom: 20px; font-size: 22px">
          Done: {{ todoData.depricate.length }} ||
          <span
            >Un-Done: {{ todoData.todo.length - todoData.depricate.length }}
          </span>
        </p>
        <hr />
        <br />
        <label for="all-done" style="margin-right: 62px; cursor: pointer"
          >Mark all as Done</label
        >
        <input
          type="radio"
          value="all-done"
          v-model="done"
          style="cursor: pointer"
          name="done"
          id="all-done"
        />
        <br /><br />
        <label for="all-undone" style="margin-right: 40px; cursor: pointer"
          >Mark all as Un-done</label
        >
        <input
          type="radio"
          style="cursor: pointer"
          name="done"
          value="all-undone"
          id="all-undone"
          v-model="done"
        />
      </div>
      <div class="project-actions flexCenter">
        <button class="box-shadow" @click="deleteAllTodos">
          Delete All todos
        </button>
        <button class="box-shadow" @click="deleteProject">
          Delete This Project
        </button>
      </div>
    </div>
    <div style="margin-bottom: 4px">
      Created at: {{ todoData.project.created_at }}
      {{ todoData.updated_at ? " - updated at: " + todoData.updated_at : "" }}
    </div>
    <div class="todo-list flexColumn" style="zoom: 0.8">
      <!-- Categories -->
      <button class="add-category-top box-shadow" @click="addNewCategory(0)">
        Add New Category
      </button>
      <div
        class="categories box-shadow"
        v-for="(category, indexCategory) in todoData.todo"
        :key="indexCategory"
        ref="openCategory"
        :class="{ 'active-category': indexCategory == categorySelected }"
        :id="'categories-' + indexCategory"
        :style="{
          'background-color':
            todoData.depricate[indexCategory].length ==
            todoData.todo[indexCategory].data.length
              ? 'red'
              : '',
        }"
      >
        <div style="overflow: hidden; height: 100%">
          <div class="category-header flex" @click="openCat(indexCategory)">
            <p>{{ category.name }}</p>
            <div class="category-icon">
              <font-awesome-icon
                class="icon-edit"
                @click.stop="editCategory(indexCategory, true)"
                :icon="['fa', 'pen-to-square']"
              />
              <font-awesome-icon
                class="icon"
                :icon="['fa', 'circle-chevron-down']"
                :id="'chevron' + indexCategory"
                style="transition: all 0.3s"
              />
            </div>
          </div>

          <button
            class="box-shadow"
            style="
            margin: -4px 0 10px 50%;
            transform: translateX(-50%)
            font-size: 12px;
            padding: 8px 12px;
            max-width: 150px;
            background-color: transparent;
            cursor: pointer;
          "
            @click="addNewTodo(indexCategory, -1)"
          >
            Add New
          </button>
          <div
            v-for="(todoCategory, todoCategoryIndex) in category.data"
            :key="todoCategoryIndex"
            :class="'category-' + indexCategory + '-' + todoCategoryIndex"
          >
            <div class="category-todo flex">
              <div
                class="todo-item flexColumn align-center box-shadow"
                :class="[
                  'todo-item' + indexCategory,
                  'todo-item-' + indexCategory + '-' + todoCategoryIndex,
                ]"
                :style="{
                  background: todoData.depricate[indexCategory].includes(
                    todoCategoryIndex
                  )
                    ? 'linear-gradient(to left, rgba(0, 0, 55, 0.5), rgb(114, 34, 34) )'
                    : '',
                  width: '100%',
                }"
                :tabindex="todoCategoryIndex"
                :data-id="todoCategoryIndex"
              >
                <div class="todo-item-header flexCenter">
                  <div
                    class="flexColumn flexCenter h-100"
                    style="padding-top: 10px"
                  >
                    <font-awesome-icon
                      @click="showRangeSize(indexCategory, todoCategoryIndex)"
                      :icon="['fa', 'arrow-up-wide-short']"
                      style="cursor: pointer; margin-bottom: 3px"
                    />
                    <font-awesome-icon
                      class="todo-item-header-icon"
                      :icon="['fa', 'minus']"
                      @click="minimizeTodo(indexCategory, todoCategoryIndex)"
                    />
                  </div>
                  <p class="flexCenter box-shadow">
                    {{ todoCategoryIndex + 1 }}
                  </p>
                  <font-awesome-icon
                    class="todo-item-header-icon"
                    @click="
                      (showTodoInFullScreen = true),
                        (contentInFullScreen =
                          todoData.todo[indexCategory].data[todoCategoryIndex])
                    "
                    :icon="['fa', 'expand']"
                  />
                </div>

                <div
                  :id="
                    'todo-item-container-' +
                    indexCategory +
                    '-' +
                    todoCategoryIndex
                  "
                  style="
                    width: 100%;
                    position: relative;
                    border-radius: 18px;
                    min-height: 100px;
                  "
                >
                  <div
                    v-if="todoToEdit[indexCategory][todoCategoryIndex].enabled"
                    style="height: 100%; width: 100%"
                  >
                    <tinyAsync
                      :id="
                        'todo-item-textarea-' +
                        indexCategory +
                        '-' +
                        todoCategoryIndex
                      "
                      style="
                        padding-top: 25px;
                        height: 100%;
                        min-width: 3000px;
                        max-width: 3000px;
                      "
                      v-model="
                        todoToEdit[indexCategory][todoCategoryIndex].Data
                      "
                      class="box-shadow"
                      @keydown.ctrl.enter="
                        editTodo(indexCategory, todoCategoryIndex)
                      "
                    />
                  </div>
                  <div class="save-cancel">
                    <button
                      @click="editTodo(indexCategory, todoCategoryIndex)"
                      @keydown.ctrl.enter="
                        editTodo(indexCategory, todoCategoryIndex)
                      "
                    >
                      Save
                    </button>
                    <button
                      @click="cancelEdit(indexCategory, todoCategoryIndex)"
                      @keydown.esc="
                        cancelEdit(indexCategory, todoCategoryIndex)
                      "
                    >
                      Cancel
                    </button>
                  </div>

                  <transition name="showTodoItemError">
                    <div
                      v-if="
                        v$.tmpEditData.$errors.length &&
                        todoCategoryIndex == errorIndex
                      "
                      :id="
                        'todo-item-error-' +
                        indexCategory +
                        '-' +
                        todoCategoryIndex
                      "
                    >
                      {{ v$.tmpEditData.$errors[0].$message }}
                    </div>
                  </transition>
                </div>
                <input
                  style="display: none"
                  type="range"
                  min="1"
                  max="100"
                  v-model="todoSizeRange[indexCategory][todoCategoryIndex]"
                  class="slider"
                  :id="`range-${indexCategory}-${todoCategoryIndex}`"
                  orient="vertical"
                  @input="changeSize(indexCategory, todoCategoryIndex)"
                />
                <span
                  :id="
                    'todo-item-text-' + indexCategory + '-' + todoCategoryIndex
                  "
                  style="width: 100%; overflow-y: auto; max-height: 200px"
                  :style="{
                    'text-decoration-line': todoData.depricate.includes(
                      todoCategory
                    )
                      ? 'line-through'
                      : '',
                  }"
                  v-html="todoData.todo[indexCategory].data[todoCategoryIndex]"
                >
                </span>
                <!-- max-height: 30rem; overflow-y: auto -->
                <div class="actions flex">
                  <font-awesome-icon
                    @click="deleteTodo(indexCategory, todoCategoryIndex)"
                    :icon="['fa', 'eraser']"
                  />
                  <font-awesome-icon
                    @click="enableEditTodo(indexCategory, todoCategoryIndex)"
                    :icon="['fa', 'keyboard']"
                  />
                  <font-awesome-icon
                    @click="deprecateTodo(indexCategory, todoCategoryIndex)"
                    :icon="['fa', 'eye-slash']"
                  />
                </div>
                <button
                  class="add-new box-shadow"
                  @click="addNewTodo(indexCategory, todoCategoryIndex)"
                >
                  Add New
                </button>
              </div>
            </div>
          </div>
        </div>
        <button
          class="add-category box-shadow"
          @click="addNewCategory(indexCategory + 1)"
        >
          Add new category
        </button>
      </div>
    </div>
    <transition name="AddCategory">
      <NewCategory
        v-if="openNewCategory"
        :categoryOpened="openNewCategory"
        :editMode="editCategoyrMode"
        :categoryName="categoryName"
        @closeNewCategory="openNewCategory = false"
        @addCategory="addCategory"
        @editCategory="editCategoryData"
        @deleteCategory="deleteCategory"
      />
    </transition>

    <FullScreenTodo
      v-if="showTodoInFullScreen"
      :contentInFullScreen="contentInFullScreen"
      @closeFullScreen="showTodoInFullScreen = false"
    />
    <div class="" v-if="!todoData.todo.length" style="margin-top: 50px">
      No ToDo Added
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import { useProjectsStore } from "../store/projects";
import { useTodosStore } from "../store/todos";

import useVuelidate from "@vuelidate/core";
import { required, helpers, minLength } from "@vuelidate/validators";
import { computed } from "@vue/runtime-core";
import { defineAsyncComponent } from "vue";
import LoadingComponen from "../components/LoadingComponen.vue";
import FullScreenTodo from "../components/FullScreenTodo.vue";
import NewCategory from "../components/NewCategory.vue";

// lodash
import { range as _range, random as _random } from "lodash";

//Tiny mce
import TinyRichText from "../components/TinyRichText.vue";
//////

const showEdit = ref(false);
const showTodoInFullScreen = ref(false);
const contentInFullScreen = ref("");

watch(showTodoInFullScreen, (newVal) => {
  if (newVal) {
    document.querySelector("body").style.overflow = "hidden";
  } else {
    document.querySelector("body").style.overflow = "auto";
  }
});

/////
const show = ref(false);
const storeProjects = useProjectsStore();
const storeTodos = useTodosStore();

const route = useRoute();
const router = useRouter();

const todoData = ref(null);
const todoToAdd = ref("");
const todoToEdit = ref([]);
const enableTinyEdit = ref(false);

const textarea = ref(null);
const tmpEditData = ref(null);

const errorIndex = ref(1);

//Categories

const categorySelected = ref(null);
const openCategory = ref([]);
const openNewCategory = ref(false);
const editCategoyrMode = ref(false);
const categoryName = ref("");

const openCat = (index) => {
  categorySelected.value = index;
  if (openCategory.value[index].offsetHeight == 65) {
    openCategory.value[index].style.height = "auto";

    document.getElementById("chevron" + index).style.transform =
      "rotate(180deg)";
  } else {
    openCategory.value[index].style.height = "65px";
    document.getElementById("chevron" + index).style.transform = "rotate(0deg)";
  }
};

const addNewCategory = (index) => {
  //open model
  editCategoyrMode.value = false;
  openNewCategory.value = true;
  storeTodos.openCategoryIndex = index;
  categoryName.value = "";
};

const editCategory = (categoryIndex) => {
  //open category model, in edit mode

  editCategoyrMode.value = true;
  storeTodos.openCategoryIndex = categoryIndex;
  openNewCategory.value = true;
  categoryName.value = todoData.value.todo[categoryIndex].name;
};

//store to db new category
const addCategory = async (data) => {
  editCategoyrMode.value = false;
  storeTodos.todo.todo.splice(storeTodos.openCategoryIndex, 0, {
    name: data,
    data: [],
  });

  storeTodos.todo.depricate.splice(storeTodos.openCategoryIndex, 0, []);
  todoToEdit.value.splice(storeTodos.openCategoryIndex, 0, []);
  todoSizeRange.value.splice(storeTodos.openCategoryIndex, 0, [0]);

  storeTodos.todos[route.params.id - 1].todo.splice(
    storeTodos.openCategoryIndex,
    0,
    {
      name: data,
      data: [],
    }
  );


  storeTodos.todos[route.params.id - 1].depricate.splice(
    storeTodos.openCategoryIndex,
    0,
    []
  );

  await storeTodos.addTodo(
    //save to db
    route.params.id,
    JSON.parse(JSON.stringify(storeTodos.todo))
  );

  categorySelected.value = storeTodos.openCategoryIndex;
  openCat(storeTodos.openCategoryIndex);
  openNewCategory.value = false;
};

const deleteCategory = async () => {
  storeTodos.todo.todo.splice(storeTodos.openCategoryIndex, 1);
  storeTodos.todo.depricate.splice(storeTodos.openCategoryIndex, 1);
  todoToEdit.value.splice(storeTodos.openCategoryIndex, 1);

  storeTodos.todos[route.params.id - 1].todo.splice(
    storeTodos.openCategoryIndex,
    1
  );
  
  storeTodos.todos[route.params.id - 1].depricate.splice(
    storeTodos.openCategoryIndex,
    1
  );

  todoSizeRange.value.splice(storeTodos.openCategoryIndex, 1);

  await storeTodos.addTodo(
    //save to db
    route.params.id,
    JSON.parse(JSON.stringify(storeTodos.todo))
  );

  categorySelected.value = 0;
  openNewCategory.value = false;
};

const editCategoryData = async (categoryName) => {
  storeTodos.todo.todo[storeTodos.openCategoryIndex].name = categoryName || "";

  await storeTodos.addTodo(
    //save to db
    route.params.id,
    JSON.parse(JSON.stringify(storeTodos.todo))
  );

  categorySelected.value = storeTodos.openCategoryIndex;
  openCat(storeTodos.openCategoryIndex);
  openNewCategory.value = false;
};

//End of Categories

//Todo item header : minimize, maximize and resize
const todoSizeRange = ref([]);
const minimizeTodo = async (categoryIndex, todoIndex) => {
  ///

  if (
    document.querySelector("#todo-item-text-" + categoryIndex + "-" + todoIndex)
      .style.maxHeight == "200px"
  ) {
    // document.querySelector(
    //   "#todo-item-text-" + categoryIndex + "-" + todoIndex
    // ).style.height = "3rem";

    document.querySelector(
      "#todo-item-text-" + categoryIndex + "-" + todoIndex
    ).style.maxHeight = "100%";
  } else {
    // document.querySelector(
    //   "#todo-item-text-" + categoryIndex + "-" + todoIndex
    // ).style.height = "auto";

    document.querySelector(
      "#todo-item-text-" + categoryIndex + "-" + todoIndex
    ).style.maxHeight = "200px";
  }
};

const showRangeSize = (categoryIndex, todoIndex) => {
  let range = document.getElementById(`range-${categoryIndex}-${todoIndex}`);
  range.style.display = range.style.display == "none" ? "flex" : "none";
};

const changeSize = (indexCategory, todoCategoryIndex) => {
  let todoText = document.querySelector(
    "#todo-item-text-" + indexCategory + "-" + todoCategoryIndex
  );

  let rangeSize = 101 - todoSizeRange.value[indexCategory][todoCategoryIndex];

  todoText.style.height =
    Math.round((rangeSize / 100) * todoText.scrollHeight) + "px";

  todoText.style.minHeight = "50px";
  todoText.style.maxHeight = "100%";
};
//End to Todo item header

// Infos
const showInfos = ref(false);

//Done
const done = ref("");

watch(done, async (newVal) => {
  // mark all as done and undoe
  if (todoData.value.todo.length) {
    if (newVal == "all-done") {
      let x = 0;
      for (let i of todoData.value.todo) {
        todoData.value.depricate[x] = [];
        for (let y in i.data) {
          todoData.value.depricate[x].push(parseInt(y));
        }
        x++;
      }

      todoData.value.updated_at = new Date(Date.now()).toLocaleDateString();

      await storeTodos.addTodo(
        route.params.id,
        JSON.parse(JSON.stringify(todoData.value))
      );
    } else if (newVal == "all-undone") {
      let x = 0;
      for (let i of todoData.value.todo) {
        todoData.value.depricate[x] = [];
        x++;
      }

      todoData.value.updated_at = new Date(Date.now()).toLocaleDateString();

      await storeTodos.addTodo(
        route.params.id,
        JSON.parse(JSON.stringify(todoData.value))
      );
    }
  }
});

const deleteAllTodos = async () => {
  if (confirm("You ara about to delete all todos.\n\nAre you sure?")) {
    todoData.value.todo = [];
    todoData.value.depricate = [];
    storeTodos.openCategoryIndex = 0;

    todoData.value.updated_at = new Date(Date.now()).toLocaleDateString();

    await storeTodos.addTodo(
      route.params.id,
      JSON.parse(JSON.stringify(todoData.value))
    );
  }
};

const deleteProject = () => {
  if (confirm("You ara about to delete this project.\n\nAre you sure?")) {
    storeProjects.deleteProject(route.params.id).then(() => router.push("/"));
  }
};
//End of Infos

//New TODO in Middle
const addNewTodo = async (categoryIndex, dataIndex) => {
  categorySelected.value = categoryIndex;
  todoToAdd.value = "<p>In Middle Added</p>";
  addTodo("newInMiddle", dataIndex + 1, categoryIndex);

  // openCategory.value[categoryIndex].style.height =
  //   openCategory.value[categoryIndex].children[0].scrollHeight + 330 + "px";

  todoData.value.depricate[categoryIndex] = todoData.value.depricate[
    categoryIndex
  ].map((item, index) => {
    if (item > dataIndex) {
      return item + 1;
    } else {
      return item;
    }
  });
};
///End New TODO in Middle

const tinyAsync = defineAsyncComponent({
  loader: () => import("../components/TinyRichText.vue"),
  suspensible: false,
});

const rules = computed(() => ({
  todoToAdd: {
    required: helpers.withMessage("Todo can't be emtpy", required),
    minLength: helpers.withMessage("min length 2", minLength(2)),
  },
  tmpEditData: {
    required: helpers.withMessage("Todo can't be emtpy", required),
    minLength: helpers.withMessage("min length 2", minLength(2)),
  },
}));

const v$ = useVuelidate(rules, { todoToAdd, tmpEditData });

onMounted(async () => {
  if (!storeProjects.projects) {
    await storeProjects.getAllProjects();
  }

  const idFound = await storeProjects.projects.some((project) => {
    return project.id == route.params.id;
  });

  if (idFound) {
    await storeTodos
      .getTodo(route.params.id)
      .catch((err) => console.log("Error"));
  } else {
    router.push("/");
  }

  todoData.value = storeTodos.todo;

  for (let i = 0; i < todoData.value.todo.length; i++) {
    todoToEdit.value[i] = [];
    todoSizeRange.value[i] = [];
    for (let y = 0; y < todoData.value.todo[i].data.length; y++) {
      todoToEdit.value[i].push({
        enabled: false,
        Data: "",
        New: false,
      });
      todoSizeRange.value[i][y] = 0;
    }
  }

  categorySelected.value = (await todoData.value.todo.length) - 1;

  done.value = storeTodos.allDone()[0];
});

const addTodo = async (type = "edit", indexToAddNewInMiddle = "", category) => {
  if (!todoData.value.todo.length) {
    editCategoyrMode.value = false;
    alert("create a category first");
    categoryName.value = "";
    openNewCategory.value = true;
    return;
  }

  todoToAdd.value = await todoToAdd.value /// remove spaces and new lines from tinymce first, and to use ctrl.Enter to fire function add
    .replace(/\&nbsp;/g, "")
    .replace(/\<p><\/p>/g, "") //remove empty <p></p>
    .trim();

  let checkForEmptySpacesAndEnters = await todoToAdd.value
    .split("<p>")
    .map((p) => {
      if (p.trim() != "</p>" && p.trim() != "") {
        return true;
      }
      return false;
    });

  checkForEmptySpacesAndEnters = checkForEmptySpacesAndEnters.every(
    (element) => element === false
  ); //if one element in <p> is not empty then validate true and add

  if (checkForEmptySpacesAndEnters) {
    todoToAdd.value = ""; //reset value of empty spaces to put the cursor up on the top again
  }

  if (type == "add") {
    todoToEdit.value[categorySelected.value].push({
      enabled: false,
      Data: "",
      New: false,
    });
  } else if (type == "newInMiddle") {
    await todoToEdit.value[category].splice(indexToAddNewInMiddle, 0, {
      enabled: true,
      Data: "",
      New: true,
    });

    await todoData.value.todo[category].data.splice(
      indexToAddNewInMiddle,
      0,
      ""
    );

    document
      .querySelectorAll(".todo-item" + category)
      .forEach((item, index) => {
        // when create new in between set display of the tinymce to flex, since it is none

        /// as well keep if edit is open in any other ones keep them opened
        if (todoToEdit.value[category][index].enabled) {
          item.children[1].style.display = "flex";
        } else {
          item.children[1].style.display = "none";
        }
      });
  }

  const validated = await v$.value.todoToAdd.$validate();

  if (validated) {
    if (type == "add") {
      storeTodos.todo.todo[categorySelected.value].data.push(todoToAdd.value);
      todoSizeRange.value[categorySelected.value].push(0);

      // openCategory.value[categorySelected.value].style.height =
      //   openCategory.value[categorySelected.value].children[0].scrollHeight +
      //   200 +
      //   "px";

      document.getElementById(
        "chevron" + categorySelected.value
      ).style.transform = "rotate(180deg)";
    }

    storeTodos.todo.updated_at = new Date(Date.now()).toLocaleDateString();

    if (type == "newInMiddle") {
      //dont add the new one to db, only in reactive, save to save, cancel then delete this new one
      if (todoToEdit.value[category][indexToAddNewInMiddle].New) {
        todoToAdd.value = "";

        // todoSizeRange.value[categorySelected.value].splice(
        //   indexToAddNewInMiddle,
        //   0,
        //   0
        // );

        todoSizeRange.value[categorySelected.value].forEach((range, index) => {
          document.getElementById(
            `range-${categorySelected.value}-${index}`
          ).style.display = "none";
        });

        v$.value.todoToAdd.$reset(); // since todoTaAdd is empty, then validation runs
        return;
      }
    }

    await storeTodos.addTodo(
      //save to db
      route.params.id,
      JSON.parse(JSON.stringify(storeTodos.todo))
    );

    done.value = "";

    projectsEditForSearch("add", "", todoToAdd.value);

    v$.value.todoToAdd.$reset();

    todoToAdd.value = "";

    if (type === "add") {
      window.scrollTo(
        0,
        document
          .getElementById("chevron" + categorySelected.value)
          .getBoundingClientRect().top - 150
      );
    }
  }
};

// remove the validate message after 6 seconds
watch(
  () => v$.value.todoToAdd.$errors[0],
  (newVal) => {
    if (newVal) {
      setTimeout(() => {
        v$.value.todoToAdd.$reset();
      }, 6000);
    }
  }
);

const projectsEditForSearch = (type, index, todoData = "") => {
  //switch case is bettter
  if (type == "add") {
    storeTodos.todos[route.params.id - 1].todo[
      categorySelected.value
    ].data.push(todoData);
  } else if (type == "edit") {
    storeTodos.todos[route.params.id - 1].todo[categorySelected.value].data[
      index
    ] = todoData;
  }
};

//delete todo
const deleteTodo = async (categoryIndex, dataIndex) => {
  // if canceling the added new in the middle, it is not in db, only remove it from reactive state
  if (todoToEdit.value[categoryIndex][dataIndex].New) {
    await todoData.value.todo[categoryIndex].data.splice(dataIndex, 1);

    await todoToEdit.value[categoryIndex].splice(dataIndex, 1);
    todoSizeRange.value[categoryIndex].splice(dataIndex, 1);
    return;
  }

  if (confirm("are you sure!")) {
    //remove by index from todoData to insert it all again in db
    todoData.value.todo[categoryIndex].data.splice(dataIndex, 1);

    categorySelected.value = categoryIndex;
    // since depricate might be in different index, re-arrange them in db by decrimenting by 1
    const itemToDepricate =
      todoData.value.depricate[categoryIndex].indexOf(dataIndex);
    if (itemToDepricate > -1) {
      todoData.value.depricate[categoryIndex].splice(itemToDepricate, 1);

      todoData.value.depricate[categoryIndex] = todoData.value.depricate[
        categoryIndex
      ].map((depricatedItems) => {
        if (depricatedItems > dataIndex) {
          return depricatedItems - 1;
        }

        return depricatedItems;
      });
    } else {
      todoData.value.depricate[categoryIndex] = todoData.value.depricate[
        categoryIndex
      ].map((depricatedItems) => {
        if (depricatedItems > dataIndex) {
          return depricatedItems - 1;
        }

        return depricatedItems;
      });
    }

    todoData.value.updated_at = new Date(Date.now()).toLocaleDateString();

    projectsEditForSearch("delete", dataIndex);

    await storeTodos.addTodo(
      route.params.id,
      JSON.parse(JSON.stringify(todoData.value))
    );

    // openCategory.value[categoryIndex].style.height =
    //   openCategory.value[categoryIndex].children[0].scrollHeight - 150 + "px";

    // projectsEditForSearch("delete", index, "");
  }
};

//enable editing todo in the middle
const enableEditTodo = async (categoryIndex, dataIndex) => {
  showEdit.value = true;

  categorySelected.value = categoryIndex;

  const todoTextContainer = document.getElementById(
    "todo-item-container-" + categoryIndex + "-" + dataIndex
  );

  document.getElementById(
    "todo-item-text-" + categoryIndex + "-" + dataIndex
  ).style.display = "none";
  todoTextContainer.style.display = "flex";

  todoToEdit.value[categoryIndex][dataIndex] = {
    enabled: true,
    Data: todoData.value.todo[categoryIndex].data[dataIndex],
    New: false,
  };

  // openCategory.value[categoryIndex].style.height =
  //   openCategory.value[categoryIndex].children[0].scrollHeight + 80 + "px";
};

// when clicking save in the edit mode
const editTodo = async (categoryIndex, dataIndex) => {
  let tmpEditAdd = todoToEdit.value[categoryIndex][dataIndex].Data;

  tmpEditData.value = await todoToEdit.value[categoryIndex][
    dataIndex
  ].Data.replace(/\&nbsp;/g, "")
    .replace(/\<p><\/p>/g, "")
    .trim();

  let checkForEmptySpacesAndEnters = await tmpEditData.value
    .split("<p>")
    .map((p) => {
      if (p.trim() != "</p>" && p.trim() != "") {
        return true;
      }
      return false;
    });

  checkForEmptySpacesAndEnters = checkForEmptySpacesAndEnters.every(
    (element) => element === false
  );

  if (checkForEmptySpacesAndEnters) {
    tmpEditData.value = "";
    todoToEdit.value[categoryIndex][dataIndex].Data = ""; //reset value of empty spaces to put the cursor up on the top again
  }

  const validateResult = await v$.value.tmpEditData.$validate();

  if (!validateResult) {
    errorIndex.value = dataIndex;
    setTimeout(() => {
      v$.value.tmpEditData.$reset();
    }, 3000);

    return;
  }
  //
  //
  //

  todoToEdit.value[categoryIndex][dataIndex].New = false;

  todoData.value.todo[categoryIndex].data = todoData.value.todo[
    categoryIndex
  ].data.map((todo, i) => {
    if (i == dataIndex) {
      // return (todo = todoToEdit.value[index].Data.replace(/\&nbsp;/g, ""));
      return (todo = tmpEditAdd);
    }
    return todo;
  });

  todoData.value.updated_at = new Date(Date.now()).toLocaleDateString();

  if (todoToEdit.value[categoryIndex][dataIndex].New) {
    projectsEditForSearch(
      "addInMiddle",
      dataIndex,
      todoToEdit.value[categoryIndex][dataIndex].Data
    ); //for search, add to storeTodos.Todos
  } else {
    projectsEditForSearch(
      "edit",
      dataIndex,
      todoToEdit.value[categoryIndex][dataIndex].Data
    ); // edit the existing todo, for search
  }

  await storeTodos.addTodo(
    route.params.id,
    JSON.parse(JSON.stringify(todoData.value))
  );

  // done.value = "";
  const todoTextArea = document.getElementById(
    "todo-item-container-" + categoryIndex + "-" + dataIndex
  );
  todoTextArea.style.display = "none";

  document.getElementById(
    "todo-item-text-" + categoryIndex + "-" + dataIndex
  ).style.display = "initial";

  todoTextArea.style.display = "none";

  todoToEdit.value[categoryIndex][dataIndex].enabled = false;

  // openCategory.value[categoryIndex].style.height =
  //   openCategory.value[categoryIndex].scrollHeight - 120 + "px";
};

const cancelEdit = async (categoryIndex, dataIndex) => {
  if (todoToEdit.value[categoryIndex][dataIndex].New == true) {
    await deleteTodo(categoryIndex, dataIndex);

    todoData.value.depricate[categoryIndex] = todoData.value.depricate[
      categoryIndex
    ].map((item) => {
      if (item > dataIndex) {
        return item - 1;
      } else {
        return item;
      }
    });

    document
      .querySelectorAll(".todo-item" + categoryIndex)
      .forEach((element, i) => {
        if (i >= dataIndex) {
          if (todoToEdit.value[categoryIndex][i].enabled == true) {
            element.children[1].style.display = "flex";
            element.children[2].style.display = "flex";
          } else {
            element.children[1].style.display = "none";
            element.children[2].style.display = "none";
          }
        }
      });

    // openCategory.value[categoryIndex].style.height =
    //   openCategory.value[categoryIndex].children[0].scrollHeight - 290 + "px";
  } else {
    todoToEdit.value[categoryIndex][dataIndex] = {
      enabled: false,
      Data: "",
      New: false,
    };

    const todoTextArea = document.getElementById(
      "todo-item-container-" + categoryIndex + "-" + dataIndex
    );
    todoTextArea.style.display = "none";

    document.getElementById(
      "todo-item-text-" + categoryIndex + "-" + dataIndex
    ).style.display = "initial";

    // openCategory.value[categoryIndex].style.height =
    //   openCategory.value[categoryIndex].children[0].scrollHeight - 105 + "px";
  }
};

const deprecateTodo = async (categoryIndex, dataIndex) => {
  categorySelected.value = categoryIndex;
  if (todoData.value.depricate[categoryIndex].includes(dataIndex)) {
    const itemToDeprecate =
      todoData.value.depricate[categoryIndex].indexOf(dataIndex);

    todoData.value.depricate[categoryIndex].splice(itemToDeprecate, 1);
    // todoData.value.depricate[categoryIndex].splice(dataIndex, 1);
  } else {
    todoData.value.depricate[categoryIndex].push(dataIndex);
    todoData.value.depricate[categoryIndex].sort();
  }

  todoData.value.updated_at = new Date(Date.now()).toLocaleDateString();

  await storeTodos.addTodo(
    route.params.id,
    JSON.parse(JSON.stringify(todoData.value))
  );

  let depLength = 0;
  let todoLength = 0;
  for (let x in todoData.value.depricate) {
    todoLength += todoData.value.todo[x].data.length;
    depLength += todoData.value.depricate[x].length;
  }

  if (todoLength == depLength) {
    done.value = "all-done";
  } else if (depLength == 0) {
    done.value = "all-undone";
  } else {
    done.value = "";
  }
};
</script>

<style>
input[type="range"][orient="vertical"] {
  writing-mode: bt-lr; /* IE */
  -webkit-appearance: slider-vertical; /* Chromium */
  width: 8px;
  height: 175px;
  padding: 0 5px;
  position: absolute;
  top: -140px;
  transform: translateX(-150px);
  display: none;
}

.categories-actions {
  margin: 20px 0;
  gap: 20px;
  height: auto;
  flex-wrap: wrap;
  min-height: 50px;
  width: 70%;
}

.category-action {
  cursor: pointer !important;
  height: 100%;
}

label[class^="category-"] {
  padding: 20px !important;
  height: 100%;
  cursor: pointer;
}

input[id^="category"]:checked ~ label[class^="category-"] {
  background: linear-gradient(
    to right,
    rgba(0, 0, 55, 0.6),
    rgba(114, 34, 34, 0.8)
  );
  /* padding: 20px; */
}

/* Categories */
.categories {
  width: 100%;
  height: 65px;
  padding: 10px;
  box-shadow: inset 2px 10px 20px black;
  transition: all 0.3s;
  position: relative;
}

.add-category-top,
.add-category {
  width: 180px;
  height: 30px;
  background-color: transparent;
  margin: 0 auto;
  cursor: pointer;
}

.add-category-top {
  margin-bottom: -48px;
}

.add-category {
  position: absolute;
  bottom: -48px;
  left: 50%;
  transform: translateX(-50%);
}
.category-header {
  box-shadow: 0px 1px 3px rgba(255, 255, 255, 0.2);
  padding: 12px 5px;
  margin-bottom: 20px;
  border-radius: 7px;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(230, 245, 230, 0.1);
  /* -webkit-tap-highlight-color: transparent; */
}

.category-header p {
  font-size: 22px;
  letter-spacing: 1.6px;
}

.category-header .icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  margin-left: auto;
}

.active-category .category-header {
  background: linear-gradient(
    to right,
    rgba(0, 0, 55, 0.6),
    rgba(114, 34, 34, 0.8)
  );
  box-shadow: 1px 1px 10px white;
}

.active-category {
  background: linear-gradient(
    to right,
    rgba(0, 0, 55, 0.6),
    rgba(114, 34, 34, 0.8)
  );
}

.AddCategory-enter-active,
.AddCategory-leave-active {
  transition: all 0.6s;
}

.AddCategory-enter-from,
.AddCategory-leave-to {
  transform: rotate(800deg) scale(0);
  opacity: 0;
}

.category-icon {
  margin-left: auto;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  width: 100px;
}

.icon-edit {
  margin: 0 auto;
  width: 20px;
  height: 20px;
  padding: 5px;
  margin-right: 40px;
}
/* End of Categories */
/* Infos */

.infos {
  width: 35px;
  height: 35px;
  margin-bottom: 15px;
  overflow: hidden;
  margin-bottom: 20px;
}

.infos .open-infos {
  width: 15px;
  height: 35px;
  margin: auto;
}

.close-infos {
  align-self: flex-start;
  justify-self: left;
  width: 100%;
  margin: 10px 20px;
  cursor: pointer;
  font-size: 25px;
}

.infos-content {
  width: 100%;
  padding: 20px;
  align-self: flex-start;
}

.project-actions {
  width: 100%;
  gap: 20px;
}

.project-actions button {
  height: 35px;
  min-width: 150px;
  background-color: transparent;
  border: 0.5px solid rgba(255, 255, 255, 0.4);
  padding: 10px;
  cursor: pointer;
}

/* End of Infos */
div[id^="todo-item-error"] {
  position: absolute;
  color: black;
  bottom: 1px;
  left: 50%;
  transform: translate(-50%, -10px);
}

span[id^="todo-item-text"]::-webkit-scrollbar {
  width: 10px;
}

span[id^="todo-item-text"]::-webkit-scrollbar-track {
  background: #e0dbdb;
}
span[id^="todo-item-text"]::-webkit-scrollbar-thumb {
  background: #888;
}
span[id^="todo-item-text"]::-webkit-scrollbar-thumb:hover {
  background: #555;
}

span[id^="todo-item-text"] ul,
span[id^="todo-item-text"] ol {
  margin-left: 20px;
}

span[id^="todo-item-text"] ul li,
span[id^="todo-item-text"] ol li {
  margin: 10px 25px;
}

p[id^="todo-item-text"] ul {
  /*list-style: disc;*/
}

span[id^="todo-item-text"] p {
  padding: 5px;
  letter-spacing: 1.2px;
  word-break: break-all;
}

span[id^="todo-item-text"] p img {
  max-width: 70%;
}

.showTodoItemError {
  bottom: 2px;

  animation: translateError 1s;
}

@keyframes translateError {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
textarea[id^="todo-item"] {
  display: none;
  pointer-events: none;
}
div[id^="todo-item-container"] {
  display: none;
  overflow: hidden;
}

.todo {
  width: 100%;
  margin-top: 30px;
  padding-bottom: 33px;
}

.add-new {
  position: absolute;
  bottom: -30px;
  background: transparent;
  border: none;
  outline: none;
  padding: 5px 4px;
  cursor: pointer;
  font-size: 10px;
}

.header {
  margin-bottom: 20px;
}

.header p {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 1.2px;
  text-transform: capitalize;
  text-shadow: 0 8px 5px black;
}

.todo-input {
  max-width: 70rem;
  width: 100%;
  min-height: 150px;
  margin-bottom: 20px;
  border-radius: 18px;
  position: relative;
  box-shadow: 0px 0px 20px rgb(114, 34, 34), 0px -0px 20px rgb(114, 34, 34),
    -0px -0px 20px rgb(114, 34, 34), -0px 0px 20px rgb(114, 34, 34);
  overflow: hidden;
}

.todo-input::before {
  content: "";
  position: absolute;
  top: 0%;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 18px;
  z-index: -1;
}

.todo-input form {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  /* position: relative; */
}

.todo-input form .button {
  position: absolute;
  width: 100px;
  height: 20px;
  background: linear-gradient(to right, rgba(9, 9, 97, 0.5), rgb(93, 45, 207));
  border: none;
  border-radius: 8px;
  margin-left: 8px;
  cursor: pointer;
  right: 20px;
  bottom: 0;
  z-index: 1;
}

.todo-input form .button:focus {
  background-color: black;
}

.todo-input form button:hover {
  background: #30303030;
}

.tiny-mce {
  width: 100%;
  height: 100%;
  background-color: #fff;
  color: black;
  resize: none;
  border-color: none;
  outline: none;
  border-radius: 18px;
  padding: 17px 22px;
  padding-bottom: 40px;
  display: none;
}

textarea::placeholder {
  font-size: 17px;
  letter-spacing: 1.5px;
  font-weight: 700;
}

.todo-input form .todo-error {
  width: 80%;
  height: 35px;
  position: absolute;
  bottom: 0px;
  left: 50%;
  background: linear-gradient(to right, rgba(0, 0, 55, 0.5), rgb(114, 34, 34));
  transform: translateX(-50%);
  text-align: center;
  border-radius: 8px;
  z-index: 1123;
}

.error-enter-active {
  transition: all 0.3s ease-out;
}

.error-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.error-enter-from {
  opacity: 0;
}
.error-leave-to {
  opacity: 0;
}

.todo-list {
  width: 90%;
  gap: 70px 0;
  margin: 20px 0;
  padding-left: 0 !important;
}

.todo-item {
  width: 100%;
  padding: 15px;
  padding-top: 8px;
  position: relative;
}
.category-todo {
  margin-bottom: 40px;
}
@media screen and (max-width: 1200px) {
  .todo-list {
    width: 95%;
  }
}

.todo-item-header {
  width: 100%;
  margin-bottom: 20px;
  gap: 0 50px;
}

.todo-item-header p {
  border-radius: 50%;
  min-width: 35px;
  min-height: 35px;
  padding: 8px;
}

.todo-item-header-icon {
  height: 30px;
  width: 30px;
  cursor: pointer;
}

.actions {
  width: 100%;
  margin-top: 20px;
  justify-content: space-around;
}

.actions * {
  cursor: pointer;
}

.save-cancel {
  position: absolute;
  bottom: 5px;
  right: 5px;
  display: flex;
  gap: 2px;
}

.save-cancel * {
  min-width: 100px;
  height: 18px;
  border-start-end-radius: 5px;
  border-start-start-radius: 5px;
  border: none;
  cursor: pointer;
  background: linear-gradient(
    to right,
    rgba(0, 0, 55, 0.5),
    rgba(114, 34, 34, 0.9)
  );
}
</style>