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
var { privateDecrypt, constants } = require("crypto");

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
            pk: this.$store.getters.publicKey
          }
        )
        .then(resp => resp.data.message)
        .then(doc => {
          let buff = new Buffer(doc, "base64");
          this.doc = JSON.parse(
            privateDecrypt(
              {
                key: this.$store.getters.privateKey,
                padding: constants.RSA_NO_PADDING
              },
              buff
            ).toString()
          );
        })
        .catch(err => {
          this.doc = undefined;
          if (err.response.status === 403) {
            this.error = "You do not have access to this object.";
          } else {
            this.error = "Unknown error ocurred.";
          }
          console.dir(err);
        });
    },
    dateFormatter(value) {
      const d = new Date(value);

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
