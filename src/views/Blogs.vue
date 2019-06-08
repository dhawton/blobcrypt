<template>
  <div>
    <b-container>
      <b-card no-body>
        <b-tabs card>
          <b-tab title="My Entries" active>
            <b-card-text>
              <Spinner
                small
                dark
                faded
                style="text-align: center;"
                v-if="this.$store.getters.blogs === false"
              />
              <EntryTable
                showNew
                :showActions="true"
                :username="$store.getters.user.username"
                v-else
                :items="this.$store.getters.blogs"
              />
            </b-card-text>
          </b-tab>
          <b-tab title="Shared Entries">
            <b-card-text>
              <b-row>
                <b-col md="12">
                  <b-form-group
                    style="margin-bottom: 1rem;"
                    label-cols-sm="1"
                    label-text-align="right"
                    label="Username"
                  >
                    <b-input-group>
                      <b-form-input
                        v-model="frienduser"
                        placeholder="daniel"
                        autofocus="autofocus"
                      />
                      <b-input-group-append>
                        <b-button variant="primary" @click="loadFriend">Access</b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row v-if="loadingfriend">
                <b-col md="12" style="text-align: center">
                  <Spinner small dark faded/>
                </b-col>
              </b-row>
              <b-row v-if="!loadingfriend && this.$store.getters.sharedBlogs !== false">
                <b-col md="12">
                  <SharedEntryTable
                    :username="frienduser"
                    :items="this.$store.getters.sharedBlogs"
                  />
                </b-col>
              </b-row>
            </b-card-text>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import Spinner from "../components/Spinner";
import EntryTable from "../components/EntryTable";
import SharedEntryTable from "../components/SharedEntryTable";
import { mapGetters } from "vuex";

export default {
  name: "Blogs",
  data() {
    return {
      frienduser: null,
      loadingfriend: false
    };
  },
  computed: {
    ...mapGetters(["sharedBlogs"])
  },
  components: {
    Spinner,
    EntryTable,
    SharedEntryTable
  },
  watch: {
    sharedBlogs(newValue, oldValue) {
      if (oldValue === false && newValue !== false && this.loadingfriend) {
        this.loadingfriend = false;
      }
    }
  },
  created() {
    if (this.$store.getters.sharedBlogsUser !== null) {
      this.frienduser = this.$store.getters.sharedBlogsUser;
    }
    if (this.$store.getters.blogs === false) {
      this.$store.dispatch("getMeta", this.$store.getters.user.username);
    }
  },
  methods: {
    loadFriend() {
      this.loadingfriend = true;
      this.$store.commit("sharedBlogsUser", this.frienduser);
      this.$store.dispatch("getMeta", this.frienduser);
    }
  }
};
</script>

<style>
.nav-tabs .nav-link,
.nav-tabs .nav-item.show .nav-link {
  text-decoration: none;
}
</style>
