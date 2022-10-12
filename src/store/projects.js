// stores/counter.js
import { defineStore, acceptHMRUpdate } from "pinia";
import axiosClient from "../axios";

export const useProjectsStore = defineStore("projects", {
  state: () => ({
    projects: null,
    project: null,
    projectLoader: true,
    openEditModel: false,
    editModelData: {
      id: null,
      projectName: "",
    },
    zoom: 1,

    //End of State
  }),

  getters: {
    //End of Getters
  },

  actions: {
    async getAllProjects() {
      return axiosClient
        .get(import.meta.env.VITE_BASE_URL + "/projects")
        .then(({ data }) => {
          // return axiosClient.get(import.meta.env.VITE_BASE_URL+"/projects/0?_embed=todos").then(({ data }) => {
          // return axiosClient.get(import.meta.env.VITE_BASE_URL+"/todos/0?_expand=project").then(({ data }) => {
          this.projects = data;
          this.projectLoader = false;
        });
    },

    async saveProject(projectData) {
      return axiosClient
        .post(import.meta.env.VITE_BASE_URL + "/projects", {
          ...projectData,
        })
        .then(({ data }) => {
          this.projects.push(data);
          this.project = data;
        });
    },

    async getProjectById(id) {
      return axiosClient
        .get(`${import.meta.env.VITE_BASE_URL}/projects/${id}`)
        .then(({ data }) => {
          this.project = data;
        });
    },

    async updateProject(id, projectData) {
      return axiosClient
        .put(import.meta.env.VITE_BASE_URL + "/projects/" + id, {
          ...projectData,
        })
        .then(({ data }) => {
          this.project = data;
        });
    },

    async deleteProject(id) {
      return axiosClient
        .delete(import.meta.env.VITE_BASE_URL + "/projects/" + id)
        .then(() => true);
    },

    //End of Actions
  },
});


if (import.meta.hot) {
  //update without reloading the page if any state or actions of getters naming change
  import.meta.hot.accept(acceptHMRUpdate(useProjectsStore, import.meta.hot));
}
