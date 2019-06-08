<template>
  <div id="topcontainer">
    <NavBar v-if="$route.name !== 'error'"/>
    <b-container id="app">
      <router-view/>
    </b-container>
  </div>
</template>

<script>
import NavBar from "./components/NavBar";
import { Auth } from "aws-amplify";
import jwkToPem from "jwk-to-pem";

export default {
  name: "App",
  components: {
    NavBar
  },
  created() {
    Auth.currentAuthenticatedUser({
      bypassCache: false
    })
      .then(user => this.$store.commit("user", user))
      .catch(() => this.$store.commit("user", undefined));

    window.crypto.subtle
      .generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 4096,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-512"
        },
        true,
        ["encrypt", "decrypt"]
      )
      .then(async key => {
        this.$store.commit("keyPair", key);
        let exported = await window.crypto.subtle.exportKey(
          "jwk",
          key.publicKey
        );
        this.$store.commit("publicKey", jwkToPem(exported));
        exported = await window.crypto.subtle.exportKey("jwk", key.privateKey);
        this.$store.commit("privateKey", jwkToPem(exported, { private: true }));
      })
      .catch(err => {
        console.error(err);
        this.$store.commit("error", err);
        this.$router.push({ path: "/error" });
      });
  },
  methods: {}
};
</script>

<style>
html {
  width: 100%;
  height: 100%;
  margin: 0;
}
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
#topcontainer {
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-flow: column;
  overflow: none;
}
#app {
  height: 100%;
  padding-top: 1rem;
}
</style>
