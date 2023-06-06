<template>
  <button @click="saveHighlightedText">Highlight</button>
</template>

<script setup lang="ts">
import { ref, watchEffect, whenever } from 'vue';
import { useStorage, useMagicKeys } from '@vueuse/core';
import { browser } from 'webextension-polyfill-ts';
import log from 'loglevel'
const highlights = useStorage('highlights', {});

const { shift, meta: command } = useMagicKeys();
let highlightColor = "yellow";

watchEffect(() => {
  if (shift.value) {
    highlightColor = "lightorange";
  } else if (command.value) {
    highlightColor = "lightpink";
  } else {
    highlightColor = "yellow";
  }
});

const saveHighlightedText = () => {
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) {
    const urlHighlights = highlights.value[window.location.href] || [];
    urlHighlights.push(selection.toString());
    highlights.value[window.location.href] = urlHighlights;

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = highlightColor;
    span.appendChild(range.cloneContents());
    range.deleteContents();
    range.insertNode(span);
  }
};
</script>
