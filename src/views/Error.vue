<template>
  <b-container fluid>
    <h1>Uh Oh!</h1>
    <p>An fatal error has occurred that prevents this application from continuing. Please try again later. If this error continues, please contact the website administrator.</p>
    <p>Error data: {{ $store.getters.error }}</p>
  </b-container>
</template>

<script>
import Base64 from "../Base64";

export default {
  data() {
    return {
      Base64
    };
  },
  created() {
    if (this.$store.getters.error === null) this.$router.push({ path: "/" });
  }
};
</script>

<style>
body,
html {
  background-color: rgb(150, 0, 0);
  color: #fff;
}
</style>
