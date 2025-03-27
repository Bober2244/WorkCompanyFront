<template>
  <div class="progress-bar">
    <div class="progress-fill" :style="fillStyle"></div>
  </div>
</template>

<script>
export default {
  props: {
    progress: {
      type: Number,
      required: true,
      validator: value => value >= 0 && value <= 100
    }
  },
  computed: {
    fillStyle() {
      return {
        width: `${this.progress}%`,
        background: `linear-gradient(to right, #ff0000, #ffff00, #00ff00)`
      };
    }
  }
};
</script>

<style scoped>
.progress-bar {
  width: 80%;
  height: 20px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease;
}
</style>