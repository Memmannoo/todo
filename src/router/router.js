import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "projects" */ "../views/Projects.vue"),
    name: "Projects",
  },
  {
    path: "/create/project",
    component: () =>
      import(
        /* webpackChunkName: "createProjects" */ "../views/CreateProject.vue"
      ),
    name: "CreateProject",
  },
  {
    path: "/todo/:id",
    component: () => import(/* webpackChunkName: "todo" */ "../views/Todo.vue"),
    name: "Todo",
  },
  {
    path: "/:pathMatch(.*)*",
    component: () =>
      import(/* webpackChunkName: "projects" */ "../views/Projects.vue"),
    name: "Projects",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
