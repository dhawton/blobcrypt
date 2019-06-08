<template>
  <div style="text-align: center;">
    <amplify-authenticator v-if="!signedIn" v-bind:authConfig="signupconfig"></amplify-authenticator>
    <b-modal
      id="processingModal"
      size="xl"
      title="Processing..."
      ok-only
      :busy="saving"
      :no-close-on-esc="saving"
      :no-close-on-backdrop="saving"
      :hide-header-close="saving"
      v-model="modalProcessingShow"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
    >
      <Spinner dark large style="text-align: center"/>
      <p style="text-align: center; margin-top: 1em;">
        <b>Processing request...</b>
      </p>
    </b-modal>
  </div>
</template>

<script>
import { components, AmplifyEventBus } from "aws-amplify-vue";
import { Auth } from "aws-amplify";
import ajax from "../Api";

export default {
  name,
  components: {
    ...components
  },
  computed: {
    signedIn() {
      if (this.$store.getters.user === undefined) return false;

      return true;
    }
  },
  created() {
    this.findUser();
    AmplifyEventBus.$on("authState", newState => {
      if (this.lastState === "confirmSignUp" && newState === "signedIn") {
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
      } else if (newState === "signedIn") {
        this.findUser();
        this.$router.push({ path: "/" });
      }
    });
  },
  data() {
    return {
      lastState: null,
      processing: false,
      modalProcessingShow: false,
      saving: false,
      signupconfig: {
        signUpConfig: {
          signUpFields: [
            {
              label: this.$Amplify.I18n.get("Username"),
              key: "username",
              required: true,
              type: "text",
              displayOrder: 1
            },
            {
              label: this.$Amplify.I18n.get("Password"),
              key: "password",
              required: true,
              type: "password",
              displayOrder: 2
            },
            {
              label: this.$Amplify.I18n.get("Email"),
              key: "email",
              required: true,
              type: "text",
              displayOrder: 3
            },
            {
              label: "First Name",
              key: "given_name",
              required: true,
              type: "text",
              displayOrder: 5
            },
            {
              label: "Last Name",
              key: "family_name",
              required: true,
              type: "text",
              displayOrder: 6
            }
          ],
          hiddenDefaults: ["phone_number"]
        }
      }
    };
  },
  methods: {
    async findUser() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        this.$store.commit("user", user);
        this.$router.push({ path: "/" });
      } catch (err) {
        this.$store.commit("user", undefined);
      }
    }
  }
};
</script>

<style>
</style>