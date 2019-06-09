<template>
  <div>
    <SignIn v-if="displayMap.showSignIn" v-bind:signInConfig="options.signInConfig"></SignIn>
    <SignUp v-if="displayMap.showSignUp" v-bind:signUpConfig="options.signUpConfig"></SignUp>
    <ConfirmSignUp
      v-if="displayMap.showConfirmSignUp"
      v-bind:confirmSignUpConfig="options.confirmSignUpConfig"
    ></ConfirmSignUp>
    <ConfirmSignIn
      v-if="displayMap.showConfirmSignIn"
      v-bind:confirmSignInConfig="options.confirmSignInConfig"
    ></ConfirmSignIn>
    <ForgotPassword
      v-if="displayMap.showForgotPassword"
      v-bind:forgotPasswordConfig="options.forgotPasswordConfig"
    ></ForgotPassword>
    <RequireNewPassword
      v-if="displayMap.requireNewPassword"
      v-bind:requireNewPasswordConfig="options.requireNewPasswordConfig"
    ></RequireNewPassword>
    <SetMfa v-if="displayMap.showMfa" v-bind:mfaConfig="options.mfaConfig"></SetMfa>
  </div>
</template>

<script>
import SignIn from "./SignIn.vue";
import SignUp from "./SignUp.vue";
import ConfirmSignUp from "./ConfirmSignUp.vue";
import ConfirmSignIn from "./ConfirmSignIn.vue";
import ForgotPassword from "./ForgotPassword.vue";
import SetMfa from "./SetMFA.vue";
import RequireNewPassword from "./RequireNewPassword.vue";
import AmplifyEventBus from "aws-amplify-vue/src/events/AmplifyEventBus";
import GetUser from "aws-amplify-vue/src/services/getUser";
import ajax from "@/Api";

export default {
  name: "Authenticator",
  props: ["authConfig"],
  components: {
    SignIn,
    SignUp,
    ConfirmSignUp,
    ConfirmSignIn,
    ForgotPassword,
    SetMfa,
    RequireNewPassword
  },
  data() {
    return {
      user: {
        username: null
      },
      displayMap: {},
      error: "",
      logger: {},
      lastState: null
    };
  },
  computed: {
    options() {
      const defaults = {
        signInConfig: {},
        signUpConfig: {},
        confirmSignUpConfig: {},
        confirmSignInConfig: {},
        forgotPasswordConfig: {},
        mfaConfig: {},
        requireNewPasswordConfig: {}
      };
      return Object.assign(defaults, this.authConfig || {});
    }
  },
  async mounted() {
    this.logger = new this.$Amplify.Logger(this.$options.name);
    AmplifyEventBus.$on("localUser", user => {
      this.user = user;
      this.options.signInConfig.username = this.user.username;
      this.options.confirmSignInConfig.user = this.user;
      this.options.confirmSignUpConfig.username = this.user.username;
      this.options.requireNewPasswordConfig.user = this.user;
    });
    AmplifyEventBus.$on("authState", async data => {
      if (this.lastState === "confirmSignUp" && data === "signedIn") {
        this.modalProcessingShow = true;
        this.saving = true;
        ajax
          .post("/register")
          .then(() => {
            this.modalProcessingShow = false;
            this.saving = false;
            this.$router.push({ path: "/" });
          })
          .catch(() => {
            this.$store.commit("error", {
              message: "Failed to generate encryption keys"
            });
            this.$router.push({ path: "/error" });
          });
      } else if (data === "signedIn") {
        const user = await this.$Amplify.Auth.currentAuthenticatedUser();
        this.$store.commit("user", user);
        this.$router.push({ path: "/" });
      }
      this.lastState = data;
      this.displayMap = this.updateDisplayMap(data);
    });
    GetUser(this.$Amplify)
      .then(val => {
        if (val instanceof Error) {
          return (this.displayMap = this.updateDisplayMap("signedOut"));
        }
        this.user = val;
        return (this.displayMap = this.updateDisplayMap("signedIn"));
      })
      .catch(e => this.setError(e));
  },
  methods: {
    updateDisplayMap: state => {
      return {
        showSignIn: state === "signedOut" || state === "signIn",
        showSignUp: state === "signUp",
        showConfirmSignUp: state === "confirmSignUp",
        showConfirmSignIn: state === "confirmSignIn",
        showForgotPassword: state === "forgotPassword",
        showSignOut: state === "signedIn",
        showMfa: state === "setMfa",
        requireNewPassword: state === "requireNewPassword"
      };
    },
    setError: function(e) {
      this.error = this.$Amplify.I18n.get(e.message || e);
      this.logger.error(this.error);
    }
  }
};
</script>
