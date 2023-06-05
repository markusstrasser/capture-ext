<template>
  <!-- <button @click="saveHighlightedText">Highlight</button> -->
  <button @click="html2md">Highlight</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';
import { browser } from 'webextension-polyfill-ts';
import axios from 'axios'
import log from 'loglevel'
const highlights = useStorage('highlights', {});



const html2md = async () => {
  return new Promise((resolve, reject) => {
    const url = window.myExtensionData.url
    const apiKey = window.myExtensionData.apiKey
    log.debug("url", url, apiKey)

    chrome.runtime.sendMessage(
      { method: "POST", url, apiKey, action: "html2md" },
      response => {
        log.debug("response", response)

        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.data);
        }
      }
    );
  });
};
// const saveHighlightedText = () => {
//   const selection = window.getSelection();
//   if (selection && selection.toString().length > 0) {
//     const urlHighlights = highlights.value[window.location.href] || [];
//     urlHighlights.push(selection.toString());
//     highlights.value[window.location.href] = urlHighlights;
//   }
// };
</script>
