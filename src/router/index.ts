import RedactleInterface from "@/components/RedactleInterface.vue"
import CustomMode from "@/components/CustomMode.vue"
import { createRouter, createWebHistory } from "vue-router";

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
    {
      path: "/custom",  // <-- notice the colon
      name: "CustomInterface",
      component: CustomMode,
    },
  ],
});

export default router;
