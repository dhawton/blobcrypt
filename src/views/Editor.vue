<template>
  <div>
    <b-container fluid>
      <b-form-group
        style="margin-bottom: 1rem;"
        label-cols-sm="1"
        label-text-align="right"
        label="Entry Title"
      >
        <b-input-group>
          <b-form-input v-model="title" placeholder="Dear Daniel Diary..." autofocus="autofocus"/>
        </b-input-group>
      </b-form-group>

      <b-row style="margin-top: 1rem;">
        <b-col md="12">
          <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
        </b-col>
      </b-row>

      <b-card no-body style="margin-top: 1rem;">
        <b-tabs card>
          <b-tab title="Main" active>
            <b-card-text>
              <b-button variant="primary" @click="doSave">Save</b-button>
              <b-button
                style="float: right;"
                variant="danger"
                @click="$router.push({ path: '/entries' })"
              >Cancel</b-button>
            </b-card-text>
          </b-tab>
          <b-tab title="Sharing Controls">
            <b-card-text>
              <b-button variant="primary" @click="$refs.usermodal.show()">Add User</b-button>
              <table class="table table-striped table-sm" style="margin-top: 1rem;">
                <thead>
                  <tr>
                    <th>Authorized readers:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(v, k) in users" :key="k">
                    <td>
                      <b-button variant="danger" sm @click="removeUser(v)">
                        <i class="material-icons">delete</i>
                      </b-button>
                      {{ v }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </b-card-text>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-container>
    <b-modal
      id="adduser"
      size="md"
      cancel-disabled
      title="Add Reader"
      ref="usermodal"
      ok-only
      ok-title="Add User"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
      lazy
      @ok="addUser"
    >
      <b-container fluid>
        <b-form-group label-cols-sm="2" label-text-align="right" label="Username" class="mb-0">
          <b-input-group>
            <b-form-input v-model="modalUser" placeholder="Username" autofocus="autofocus"/>
          </b-input-group>
        </b-form-group>
      </b-container>
    </b-modal>

    <b-modal
      id="error-modal"
      size="md"
      title="Error"
      ok-only
      v-model="modelErrorShow"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
      v-html="errorModalText"
    ></b-modal>
    <b-modal
      id="loadingModal"
      size="xl"
      title="Loading..."
      ok-only
      :busy="loading"
      :no-close-on-esc="loading"
      :no-close-on-backdrop="loading"
      :hide-header-close="loading"
      v-model="modalLoadingShow"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
    >
      <Spinner dark large style="text-align: center"/>
      <p style="text-align: center; margin-top: 1em;">
        <b>Retrieving and decrypting entry...</b>
      </p>
    </b-modal>
    <b-modal
      id="savingModal"
      size="xl"
      title="Saving..."
      ok-only
      :busy="saving"
      :no-close-on-esc="saving"
      :no-close-on-backdrop="saving"
      :hide-header-close="saving"
      v-model="modalSavingShow"
      header-bg-variant="dark"
      header-text-variant="light"
      body-bg-variant="dark"
      body-text-variant="light"
      footer-bg-variant="dark"
      footer-text-variant="light"
    >
      <Spinner dark large style="text-align: center"/>
      <p style="text-align: center; margin-top: 1em;">
        <b>Uploading and Encrypting Entry...</b>
      </p>
    </b-modal>
  </div>
</template>

<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Spinner from "../components/Spinner";
import ajax from "@/Api.js";
// import { privateDecrypt } from "crypto";

export default {
  name: "app",
  components: {
    ckeditor: CKEditor.component,
    Spinner
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: "",
      editorConfig: {
        placeholder: "Dear Daniel Diary...",
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "blockQuote",
          "insertTable",
          "mediaEmbed",
          "undo",
          "redo"
        ]
      },
      users: [],
      title: "",
      modalUser: "",
      docDate: undefined,
      errorModalText: undefined,
      modelErrorShow: false,
      modalSavingShow: false,
      modalLoadingShow: false,
      saving: false,
      loading: false
    };
  },
  created() {
    if (this.$route.params.id !== "new") {
      this.loading = true;
      this.modalLoadingShow = true;
      this.checkForPK();
    }
    /*     setTimeout(() => {
      document.getElementsByClassName("ck-editor__editable")[0].focus();
    }, 400); */
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
          `/entries/${this.$store.getters.user.username}/${
            this.$route.params.id
          }`,
          {
            id: this.$route.params.id,
            username: this.$store.getters.user.username,
            // pk: this.$store.getters.publicKey,
            showReaders: true
          }
        )
        .then(resp => resp.data)
        .then(doc => {
          /* let buff = new Buffer(doc, "base64");
          doc = JSON.parse(
            privateDecrypt(this.$store.getters.privateKey, buff).toString()
          ); */
          this.title = doc.title;
          this.docDate = doc.date;
          this.editorData = doc.body;
          this.loading = false;
          this.users = doc.readers;
          this.modalLoadingShow = false;
        });
    },
    removeUser(username) {
      this.users = this.users.filter(u => u !== username);
    },
    addUser() {
      if (!this.users.includes(this.modalUser) && this.modalUser !== "") {
        this.users.push(this.modalUser);
        this.users.sort();
      }
      this.modalUser = "";
    },
    doSave() {
      let readers = this.users;
      if (!readers.includes(this.$store.getters.user.username)) {
        readers.push(this.$store.getters.user.username);
      }
      let body = {
        id: this.$route.params.id,
        title: this.title,
        body: this.editorData,
        readers,
        date: this.$route.params.id === "new" ? Date.now() : this.docDate
      };
      this.saving = true;
      this.modalSavingShow = true;
      ajax
        .post("/entries", body)
        .then(r => r.data)
        .then(() => {
          this.$store.commit("blogs", false);
          this.$router.push({ path: "/entries" });
        })
        .catch(err => {
          this.modalSavingShow = false;
          this.saving = false;
          this.errorModalText =
            "There was an error saving your entry in the cloud. Error info for developers:<br><br>" +
            btoa(JSON.stringify(err));
          this.modelErrorShow = true;
        });
    }
  }
};
</script>

<style>
.ck-editor__editable {
  min-height: 500px;
  height: 500px;
}
.modal-content {
  background-clip: unset !important;
}
</style>

<style>
.nav-tabs .nav-link,
.nav-tabs .nav-item.show .nav-link {
  text-decoration: none;
}
</style>