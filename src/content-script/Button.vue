<template>
  <button @click="saveHighlightedText">Highlight</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { browser } from 'webextension-polyfill-ts';

const highlights = useStorage('highlights', {});

const saveHighlightedText = () => {
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) {
    const urlHighlights = highlights.value[window.location.href] || [];
    urlHighlights.push(selection.toString());
    highlights.value[window.location.href] = urlHighlights;
  }
};
</script>
