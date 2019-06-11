<template>
  <b-container fluid>
    <b-row>
      <b-col md="12" v-if="doc === undefined && error === undefined" style="text-align: center;">
        <Spinner large dark/>
        <p style="margin-top: 2rem">Decrypting and rendering document...</p>
      </b-col>
      <b-col md="12" v-if="doc !== undefined && error === undefined">
        <h1>{{doc.title}}</h1>
        <p>Written by {{doc.author}} on {{dateFormatter(doc.date*1000)}}</p>
        <hr>
        <div v-html="doc.body"/>
      </b-col>
      <b-col
        md="12"
        v-if="error !== undefined && doc === undefined"
      >There was an error processing your request. {{error}}</b-col>
    </b-row>
  </b-container>
</template>

<script>
import Spinner from "../components/Spinner";
import ajax from "../Api";
import crypto from "crypto";
//var { privateDecrypt, constants } = require("crypto");

export default {
  name: "Entry",
  components: {
    Spinner
  },
  data() {
    return {
      doc: undefined,
      error: undefined
    };
  },
  created() {
    this.checkForPK();
  },
  methods: {
    checkForPK() {
      if (this.$store.getters.publicKey === null) {
        window.setTimeout(() => {
          this.checkForPK();
        }, 1000);
      } else {
        this.loadDoc();
      }
    },
    loadDoc() {
      ajax
        .post(
          `/entries/${this.$route.params.username}/${this.$route.params.id}`,
          {
            id: this.$route.params.id,
            username: this.$route.params.username,
            pk: this.$store.getters.publicKey,
            version: 1
          }
        )
        .then(resp => {
          const encMessage = resp.data;

          const key = JSON.parse(
            crypto
              .privateDecrypt(
                this.$store.getters.privateKey,
                Buffer.from(encMessage.k, "base64")
              )
              .toString()
          );

          // new Buffer(textParts.shift(), 'hex');
          const i = Buffer.from(key.i, "hex");
          if (!["aes-256-cbc", "aes-256-gcm"].includes(key.a)) {
            this.$store.commit("error", "Unsupported algorithm, MITM?");
            this.$router.push({ path: "/error" });
            return;
          }
          const k = Buffer.from(key.k, "hex");
          let buffer = Buffer.from(encMessage.m, "base64");
          let decipher = crypto.createDecipheriv(key.a, k, i);
          if (key.a === "aes-256-gcm") {
            decipher.setAuthTag(Buffer.from(key.y, "hex"));
          }
          let decrypted = decipher.update(buffer);
          decrypted = Buffer.concat([decrypted, decipher.final()]);
          this.doc = JSON.parse(decrypted);
        })
        .catch(err => {
          this.doc = undefined;
          if (err.response === undefined) {
            this.$store.commit("error", "Error decrypting entry");
            this.$router.push({ path: "/error" });
            return;
          }
          if (err.response.status === 403) {
            this.error = "You do not have access to this object.";
          } else {
            this.error = "Unknown error ocurred.";
          }
          console.dir(err);
        });
    },
    dateFormatter(value) {
      const d = new Date(value / 1000);

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ];

      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${
        d.getHours() < 10 ? "0" : ""
      }${d.getHours()}:${d.getMinutes() < 10 ? "0" : ""}${d.getMinutes()}`;
    }
  }
};
</script>

<style>
</style>
