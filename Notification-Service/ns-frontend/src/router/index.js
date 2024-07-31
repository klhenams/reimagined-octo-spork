import { createRouter, createWebHistory } from "vue-router";
import DashBoardView from "../views/DashBoardView.vue";
import MessagesView from "../views/MessagesView.vue";
import ProfileView from "../views/ProfileView.vue";
import StudentsView from "../views/StudentsView.vue";
import LogInPage from "../views/LogInPage.vue";
import StudentsTable from "../views/Table.vue";
import PageNotFound from '../views/PageNotFound.vue'

const routes = [
  {
    path: "/",
    name: "Login",
    component: LogInPage,
  },
  {
    path: "/students",
    name: "DashBoard",
    component: DashBoardView,
    children: [
      {
        path: "/profile",
        name: "Profile",
        component: ProfileView,
      },
      {
        path: "/messages",
        name: "Messages",
        component: MessagesView,
      },
      {
        path: "/students",
        name: "Students",
        component: StudentsView,
      },
      {
        path: "/table",
        name: "Table",
        component: StudentsTable,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'PageNotFound',
    component: PageNotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
