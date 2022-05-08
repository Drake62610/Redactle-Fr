import '@babel/polyfill'
import 'mutationobserver-shim'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import { createApp } from "vue";
import axios from 'axios'
import VueSmoothScroll from 'vue3-smooth-scroll'
import VueAxios from 'vue-axios'
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);
app.use(VueAxios, axios)
app.use(VueSmoothScroll)
app.mount("#app");

