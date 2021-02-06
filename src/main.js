import Vue from "vue";
import App from "./App";
import axios from "axios";
import VueAxios from "vue-axios";
import Chart from "vue2-frappe";
import { Row, Column } from "vue-grid-responsive";
import Buefy from "buefy";
import "buefy/dist/buefy.css";

Vue.component("row", Row);
Vue.component("column", Column);
Vue.use(Chart);
Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(Buefy);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App)
});
