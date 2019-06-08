<template>
  <div style="text-align: center;">
    <amplify-authenticator v-if="!signedIn" v-bind:authConfig="signupconfig"></amplify-authenticator>
  </div>
</template>

<script>
import { components, AmplifyEventBus } from "aws-amplify-vue";
import { Auth } from "aws-amplify";

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
      if (newState === "signedIn") {
        this.findUser();
        this.$router.push({ path: "/journal" });
      }
    });
  },
  data() {
    return {
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