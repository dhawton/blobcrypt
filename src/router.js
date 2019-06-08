import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/register",
      name: "register",
      component: () => import("./views/Register.vue")
    },
    {
      path: "/about",
      name: "about",
      component: () => import("./views/About.vue")
    },
    {
      path: "/entries",
      name: "blogs",
      component: () => import("./views/Blogs.vue")
    },
    {
      path: "/editor/:id",
      name: "editor",
      component: () => import("./views/Editor.vue")
    },
    {
      path: "/entry/:username/:id",
      name: "entry",
      component: () => import("./views/Entry.vue")
    },
    {
      path: "/error",
      name: "error",
      component: () => import("./views/Error.vue")
    }
  ]
});
