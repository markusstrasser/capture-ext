<template>
  <button @click="onClick">Copy Highlights</button>
</template>

<script>
export default {
  methods: {
    onClick() {
      this.$emit('click')
    }
  }
}
</script>
