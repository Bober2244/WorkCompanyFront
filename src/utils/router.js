import { createRouter, createWebHashHistory } from "vue-router";

import SignUp from "../../pages/SignUp.vue";
import SignIn from "../../pages/SignIn.vue";
import EnterScreen from "../components/EnterScreen/EnterScreen.vue";
import HomePage from "../../pages/HomePage.vue";
import Managment from "@/components/ManagmentComponent.vue";
import BrigadeManagement from "@/components/BrigadeManagement.vue";
import MaterialManagment from "@/components/MaterialManagment.vue";
import MaterialForOrder from "@/components/MaterialForOrder.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: EnterScreen, meta: { marginTop: true } },
    { path: "/sign-in", component: SignIn, meta: { marginTop: true } },
    { path: "/sign-up", component: SignUp, meta: { marginTop: true } },
    { path: "/home", component: HomePage, meta: { marginTop: false } },
    {
      path: '/managmentBrigade',
      name: 'managmentComponent',
      component: Managment,
      meta: { marginTop: false },
    },
    {
      path: "/managmentMaterial",
      name: "materialManagment",
      component: MaterialManagment,
      meta: { marginTop: false },
    },
    {
      path: "/brigades/:id",
      name: "brigadeDetail",
      component: BrigadeManagement,
      props: true, // Позволяет передавать параметр ID как пропс
    },
    {
      path: "/materialForOrder/:orderId/materials",
      name: "MaterialForOrder",
      component: MaterialForOrder,
      props: true,
    },

  ],
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/sign-in', '/sign-up'];
  const authRequired = !publicPages.includes(to.path);

  const token = localStorage.getItem('jwt');


  if (authRequired && !token) {
    return next('/');
  }
  next();
});



export default router;
