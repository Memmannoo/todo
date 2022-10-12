import { defineStore, acceptHMRUpdate } from "pinia";
import axiosClient from "../axios";

export const useTodosStore = defineStore("todos", {
  state: () => ({
    todos: [],
    todo: {
      id: null,
      projectId: null,
      todo: [
        {
          name: "Component 1",
          data: [],
        },
      ],
      created_at: null,
      updated_at: null,
      depricate: [[]],
    },

    openCategoryIndex: null,
    //end of state
  }),

  getters: {
    allDone: (state) => {
      return () =>
        state.todo.todo.map((singleDone, index) => {
          if (
            state.todo.depricate[index].length ==
            state.todo.todo[index].data.length
          ) {
            return "all-done";
          } else if (!state.todo.depricate[index].length) {
            return "all-undone";
          } else {
            return "";
          }
        });
    },
    //end of getters
  },

  actions: {
    async getTodo(id) {
      return axiosClient
        .get(`${import.meta.env.VITE_BASE_URL}/todos/${id}?_expand=project`)
        .then(({ data }) => {
          this.todo = data;
        });
    },

    async saveTodo(projectId) {
      this.todo.projectId = projectId;
      console.log();
      return axiosClient
        .post(`${import.meta.env.VITE_BASE_URL}/todos`, {
          ...this.todo,
        })
        .then(({ data }) => {
          this.todo = data;
        });
    },

    async addTodo(id, todo) {
      delete todo.project;

      return axiosClient.put(`${import.meta.env.VITE_BASE_URL}/todos/${id}`, {
        ...todo,
      });
    },

    async getAllTodos() {
      return axiosClient
        .get(`${import.meta.env.VITE_BASE_URL}/todos`)
        .then(({ data }) => {
          this.todos = data;
        });
    },
    //end of actions
  },
});

if (import.meta.hot) {
  //update without reloading the page if any state or actions of getters naming change
  import.meta.hot.accept(acceptHMRUpdate(useTodosStore, import.meta.hot));
}
