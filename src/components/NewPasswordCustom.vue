 <template>
  <div v-bind:class="amplifyUI.formSection" v-bind:data-test="auth.requireNewPassword.section">
    <div
      v-bind:class="amplifyUI.sectionHeader"
      v-bind:data-test="auth.requireNewPassword.headerSection"
    >{{options.header}}</div>
    <div
      v-bind:class="amplifyUI.sectionBody"
      v-bind:data-test="auth.requireNewPassword.bodySection"
    >
      <div v-bind:class="amplifyUI.formField">
        <div v-bind:class="amplifyUI.inputLabel">{{$Amplify.I18n.get('New Password')}} *</div>
        <input
          v-bind:class="amplifyUI.input"
          v-model="password"
          type="password"
          :placeholder="$Amplify.I18n.get('New Password')"
          autofocus
          v-bind:data-test="auth.requireNewPassword.newPasswordInput"
        >
      </div>
    </div>
    <div
      v-bind:class="amplifyUI.formField"
      v-for="attribute in options.user.challengeParam.requiredAttributes"
      :attribute="attribute"
      v-bind:key="attribute"
    >
      <div v-bind:class="amplifyUI.inputLabel">{{properLabels(attribute)}}</div>
      <input
        v-bind:class="amplifyUI.input"
        v-model="requiredAttributes[attribute]"
        :placeholder="properLabels(attribute)"
      >
    </div>
    <div
      v-bind:class="amplifyUI.sectionFooter"
      v-bind:data-test="auth.requireNewPassword.footerSection"
    >
      <span v-bind:class="amplifyUI.sectionFooterPrimaryContent">
        <button
          v-bind:class="amplifyUI.button"
          v-on:click="change"
          :disabled="!password"
          v-bind:data-test="auth.requireNewPassword.submitButton"
        >{{$Amplify.I18n.get('Submit')}}</button>
      </span>
    </div>
    <div class="error" v-if="error">{{ error }}</div>
  </div>
</template>
 <script>
import AmplifyEventBus from "aws-amplify-vue/src/events/AmplifyEventBus";
import * as AmplifyUI from "@aws-amplify/ui";
import { auth } from "aws-amplify-vue/src/assets/data-test-attributes";

export default {
  name: "RequireNewPassword",
  props: ["requireNewPasswordConfig"],
  data: function() {
    return {
      user: "",
      error: "",
      password: "",
      logger: {},
      requiredAttributes: {},
      amplifyUI: AmplifyUI,
      auth
    };
  },
  computed: {
    options() {
      const defaults = {
        header: this.$Amplify.I18n.get("Enter new password"),
        user: {
          challengeParam: {
            requiredAttributes: []
          }
        }
      };
      return Object.assign(defaults, this.requireNewPasswordConfig || {});
    }
  },
  mounted() {
    this.logger = new this.$Amplify.Logger(this.$options.name);
  },
  methods: {
    properLabels: function(l) {
      switch (l.toLowerCase()) {
        case "given_name":
          return "First Name";
        case "family_name":
          return "Last Name";
        default:
          // eslint-disable-next-line no-case-declarations
          l = l.charAt(0).toUpperCase() + l.slice(1);
          l = l.replace("_", " ");
          return l;
      }
    },
    setError: function(e) {
      this.error = this.$Amplify.I18n.get(e.message || e);
      this.logger.error(this.error);
    },
    checkContact(user) {
      this.$Amplify.Auth.verifiedContact(user)
        .then(() => {
          AmplifyEventBus.$emit("localUser", this.user);
          AmplifyEventBus.$emit("authState", "signedIn");
        })
        .catch(e => this.setError(e));
    },
    change() {
      this.$Amplify.Auth.completeNewPassword(
        this.options.user,
        this.password,
        this.requiredAttributes
      )
        .then(() => {
          if (this.options.user.challengeName === "SMS_MFA") {
            AmplifyEventBus.$emit("localUser", this.options.user);
            AmplifyEventBus.$emit("authState", "confirmSignIn");
          } else if (this.options.user.challengeName === "MFA_SETUP") {
            AmplifyEventBus.$emit("localUser", this.options.user);
            AmplifyEventBus.$emit("authState", "setMfa");
          } else {
            this.checkContact(this.options.user);
          }
        })
        .catch(err => this.setError(err));
    },
    signIn: function() {
      AmplifyEventBus.$emit("authState", "signIn");
    }
  }
};
</script>