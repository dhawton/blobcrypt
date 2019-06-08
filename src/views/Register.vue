<template>
  <div style="text-align: center;">
    <amplify-authenticator v-bind:authConfig="signupconfig"></amplify-authenticator>
  </div>
</template>

<script>
import { components, AmplifyEventBus } from "aws-amplify-vue";

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
    setTimeout(() => AmplifyEventBus.$emit("authState", "signUp"), 10);
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
              displayOrder: 4
            },
            {
              label: "Last Name",
              key: "family_name",
              required: true,
              type: "text",
              displayOrder: 5
            }
          ]
        }
      }
    };
  },
  methods: {}
};
</script>

<style>
</style>