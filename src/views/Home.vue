<template>
  <div>
    <b-card-group deck>
      <b-card header-tag="header">
        <h6 slot="header" class="mb-0">Secure</h6>
        <b-card-text>Your entries are encrypted with a per-user public/private keypair ensuring only people you want to have access can access whatever you write!</b-card-text>
      </b-card>
      <b-card header-tag="header">
        <h6 slot="header" class="mb-0">Reliable</h6>
        <b-card-text>Hosted in the cloud for reliability!</b-card-text>
      </b-card>
      <b-card header-tag="header">
        <h6 slot="header" class="mb-0">Personal</h6>
        <b-card-text>You can write anything you want, and only share writings that you want to share with select people, and you can revoke their access at any time.</b-card-text>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>

<style>
</style>
