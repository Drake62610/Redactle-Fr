import RedactleInterface from "@/components/RedactleInterface.vue"
import { createRouter, createWebHistory } from "vue-router";
console.log(import.meta.env)
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
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
