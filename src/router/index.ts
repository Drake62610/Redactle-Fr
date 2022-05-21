import RedactleInterface from "@/components/RedactleInterface.vue"
import { createRouter, createWebHistory } from "vue-router";
console.log(import.meta.env.BASE_URL)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: RedactleInterface,
    },
    {
      path: "/custom/:customName",  // <-- notice the colon
      name: "Custom",
      component: RedactleInterface,
    },
  ],
});

export default router;
