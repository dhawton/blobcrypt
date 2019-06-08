<template>
  <div>
    <b-navbar toggleable="lg" type="dark" class="navbarbg">
      <b-navbar-brand to="/">
        <img
          src="../assets/emblem.png"
          class="d-inline-block"
          style="height: 40px;"
          alt="BlobCrypt"
        >
        BlobCrypt
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/about">About</b-nav-item>
          <div v-if="this.$store.getters.user !== undefined">
            <b-nav-item to="/entries">Writings</b-nav-item>
          </div>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right v-if="this.$store.getters.user !== undefined">
            <!-- Using 'button-content' slot -->
            <template
              slot="button-content"
            >{{ this.$store.getters.user.attributes.given_name }} {{ this.$store.getters.user.attributes.family_name }}</template>
            <b-dropdown-item @click="signout">Logout</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item right v-if="this.$store.getters.user === undefined" to="/login">Login/Register</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { AmplifyEventBus } from "aws-amplify-vue";
export default {
  name: "NavBar",
  data() {
    return {
      logger: undefined
    };
  },
  async mounted() {
    this.logger = new this.$Amplify.Logger(this.$options.name);
  },
  methods: {
    signout() {
      this.$Amplify.Auth.signOut()
        .then(() => {
          this.logger.info("signout success");
          AmplifyEventBus.$emit("authState", "signedOut");
          this.$store.commit("user", undefined);
          this.$router.push({ path: "/" });
        })
        .catch(e => this.setError(e));
    },
    setError(e) {
      let error = this.$Amplify.I18n.get(e.message || e);
      this.logger.error(error);
    }
  }
};
</script>

<style>
.navbar-dark .navbar-nav .nav-link,
.navbar-dark .navbar-brand {
  color: rgb(255, 255, 255) !important;
  text-decoration: none !important;
}
.navbarbg {
  background-color: #1565c0;
}
</style>
