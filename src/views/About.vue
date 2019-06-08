<template>
  <div>
    <p>
      <b>BlobCrypt</b> was created as a digital journal site with the intention on making entries private and storing them in a way
      that I knew would not be easily read by others, unless I desire them to be and only to those with whom I grant access.
    </p>
    <p>
      <b>BlobCrypt</b> utilizes Amazon Web Services to power its backend, with strict access controls to specific functions to ensure that
      no backend function has access to any data it does not need to execute its job. This helps ensure that there is no accidental leakage of
      information from the various services, as well as ensures that potential exploits are limited in their scope.
    </p>
    <p>
      <b>BlobCrypt</b> utilizes
      <a
        href="https://en.wikipedia.org/wiki/Public-key_cryptography"
        target="_blank"
      >Asymmetric Cryptography</a> in securing writings to ensure
      only those granted access can access posted entries. On top of that,
      <b>BlobCrypt</b> requires HTTPS ensuring that communications between
      <b>BlobCrypt</b> and you
      are encrypted and secure.
    </p>
  </div>
</template>

<script>
export default {
  name: "About"
};
</script>

<style>
</style>
