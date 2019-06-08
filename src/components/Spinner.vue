<template>
  <div>
    <img
      v-if="dark !== undefined || (dark === undefined && light === undefined)"
      src="../assets/emblemdark.png"
      class="spinner"
      :class="{ 'large': large !== undefined, 'small': (small !== undefined || (large === undefined && small === undefined)), 'faded': faded !== undefined }"
    >
    <img
      v-if="light !== undefined"
      src="../assets/emblem.png"
      class="spinner"
      :class="{ 'large': large !== undefined, 'small': (small !== undefined || (large === undefined && small === undefined)), 'faded': faded !== undefined }"
    >
  </div>
</template>

<script>
export default {
  name: "Spinner",
  props: ["large", "small", "faded", "light", "dark"]
};
</script>


<style scoped>
.spinner {
  animation: spinning 3s linear 0s infinite normal;
}

.faded {
  opacity: 0.5;
}

.large {
  height: 200px;
}

.small {
  height: 100px;
}

@keyframes spinning {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(180deg);
  }
  75% {
    transform: rotate(270deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
