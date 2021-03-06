/*
 * Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

<template>
  <div v-bind:class="amplifyUI.formSection" v-bind:data-test="auth.confirmSignIn.section">
    <div
      v-bind:class="amplifyUI.sectionHeader"
      v-bind:data-test="auth.confirmSignIn.headerSection"
    >{{options.header}}</div>
    <div v-bind:class="amplifyUI.sectionBody" v-bind:data-test="auth.confirmSignIn.bodySection">
      <div v-bind:class="amplifyUI.formField">
        <div v-bind:class="amplifyUI.inputLabel">{{$Amplify.I18n.get('Code')}} *</div>
        <input
          v-bind:class="amplifyUI.input"
          v-model="code"
          :placeholder="$Amplify.I18n.get('Code')"
          v-bind:data-test="auth.confirmSignIn.codeInput"
        >
      </div>
    </div>
    <div v-bind:class="amplifyUI.sectionFooter">
      <span v-bind:class="amplifyUI.sectionFooterPrimaryContent">
        <button
          v-bind:class="amplifyUI.button"
          v-on:click="submit"
          :disabled="!code"
          v-bind:data-test="auth.confirmSignIn.confirmButton"
        >{{$Amplify.I18n.get('Confirm')}}</button>
      </span>
      <span v-bind:class="amplifyUI.sectionFooterSecondaryContent">
        <a
          v-bind:class="amplifyUI.a"
          v-on:click="signIn"
          v-bind:data-test="auth.confirmSignIn.backToSignInLink"
        >{{$Amplify.I18n.get('Back to Sign In')}}</a>
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
  name: "ConfirmSignIn",
  props: ["confirmSignInConfig"],
  data() {
    return {
      verifyAttr: "",
      code: "",
      error: "",
      logger: {},
      amplifyUI: AmplifyUI,
      auth
    };
  },
  computed: {
    options() {
      const defaults = {
        header: this.$Amplify.I18n.get("Confirm Sign In"),
        user: {}
      };
      return Object.assign(defaults, this.confirmSignInConfig || {});
    }
  },
  mounted() {
    this.logger = new this.$Amplify.Logger(this.$options.name);
    if (Object.keys(this.options.user).length === 0) {
      this.setError("Valid user not received.");
    }
  },
  methods: {
    submit: function() {
      this.$Amplify.Auth.confirmSignIn(
        this.options.user,
        this.code,
        this.options.user.challengeName
      )
        .then(() => {
          this.logger.info("confirmSignIn successs");
          AmplifyEventBus.$emit("authState", "signedIn");
        })
        .catch(e => this.setError(e));
    },
    signIn: function() {
      AmplifyEventBus.$emit("authState", "signIn");
    },
    setError: function(e) {
      this.error = this.$Amplify.I18n.get(e.message || e);
      this.logger.error(this.error);
    }
  }
};
</script>
