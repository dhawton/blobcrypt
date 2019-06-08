import Vue from "vue";
import Vuex from "vuex";
import ajax from "./Api";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: undefined,
    users: [],
    blogs: false,
    sharedBlogsUser: null,
    sharedBlogs: false,
    error: null,
    keyPair: undefined,
    publicPEM: null,
    privatePEM: null
  },
  mutations: {
    user: (state, payload) => {
      state.user = payload;
    },
    blogs: (state, blogs) => {
      state.blogs = blogs;
    },
    sharedBlogsUser: (state, blogs) => {
      state.sharedBlogsUser = blogs;
    },
    sharedBlogs: (state, blogs) => {
      state.sharedBlogs = blogs;
    },
    users: (state, payload) => {
      state.users = payload;
    },
    error: (state, payload) => {
      state.error = payload;
    },
    keyPair: (state, payload) => {
      state.keyPair = payload;
    },
    publicKey: (state, payload) => {
      state.publicPEM = payload;
    },
    privateKey: (state, payload) => {
      state.privatePEM = payload;
    }
  },
  getters: {
    user: state => state.user,
    blogs: state => state.blogs,
    sharedBlogsUser: state => state.sharedBlogsUser,
    sharedBlogs: state => state.sharedBlogs,
    users: state => state.users,
    error: state => state.error,
    keyPair: state => state.keyPair,
    publicKey: state => state.publicPEM,
    privateKey: state => state.privatePEM
  },
  actions: {
    getMeta(context, username = null) {
      if (username === null) {
        username = context.getters.user.username;
      }
      if (username === context.getters.user.username) {
        context.commit("blogs", false);
      } else {
        context.commit("sharedBlogs", false);
      }
      ajax
        .get(`/meta/${username}`)
        .then(r => r.data)
        .then(meta => {
          if (username !== context.getters.user.username) {
            context.commit("sharedBlogs", meta);
          } else {
            context.commit("blogs", meta);
          }
        });
    },
    getUsers(context) {
      ajax
        .get("/users")
        .then(r => r.data)
        .then(users => context.commit("users", users));
    }
  }
});
