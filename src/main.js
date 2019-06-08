import "@babel/polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BootstrapVue from "bootstrap-vue";
import Amplify, * as AmplifyModules from "aws-amplify";
import { AmplifyPlugin } from "aws-amplify-vue";
import awsmobile from "./aws-exports";
import NewPasswordCustom from "./components/NewPasswordCustom";

import "./app.scss";

Amplify.configure(awsmobile);

import { I18n } from "aws-amplify";

const authScreenLabels = {
  en: {
    "Sign Up": "Create new account",
    "Sign Up Account": "Create a new account",
    "Sign In": "Login",
    given_name: "First Name",
    family_name: "Last Name"
  }
};

I18n.setLanguage("en");
I18n.putVocabularies(authScreenLabels);

Vue.use(AmplifyPlugin, AmplifyModules);

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

Vue.component("amplify-require-new-password", NewPasswordCustom);
//Vue.component("amplify-sign-up", SignUpCustom);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
