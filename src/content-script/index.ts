// main.js

import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import {
  checkActivity,
  setupActivityListeners,
  removeActivityListeners,
  isIdle,
} from './userActivity'
import Button from './Button.vue' // Importing the Vue component into the content script
import log from 'loglevel'
import { defineCustomElement } from 'vue'

log.setDefaultLevel(log.levels.DEBUG) // Set logging level to DEBUG
const url = window.location.href

// Convert the Vue component to a custom element
customElements.define('my-button', defineCustomElement(Button))

// Create a new custom element
const button = document.createElement('my-button')

// main.js

window.myExtensionData = {
  url: window.location.href,
  apiKey: 'sk-38f7f08914ac64b09eea0876561b1f93',
}

// the rest of your content script code...

// Append the button to the body
document.body.appendChild(button)

const timeSpent = ref(0)
const storage = useStorage(url, timeSpent)
let intervalId
const secondstoIncrement = 3

log.info(`%c Tracking time spent on ${url}`, 'color: blue;')

setupActivityListeners()
intervalId = setInterval(() => {
  checkActivity()
  if (document.visibilityState === 'visible' && !isIdle) {
    timeSpent.value += 3
    log.debug(`User has spent ${timeSpent.value} seconds on this page.`)
    storage.value = timeSpent.value
  } else {
    log.debug('Page is not visible or user is idle, not counting.')
  }
}, secondstoIncrement * 1000)

window.onbeforeunload = () => {
  log.info(`%c Stopped tracking time spent on ${url}`, 'color: blue;')
  clearInterval(intervalId)
  removeActivityListeners()
  log.debug(`User has spent total of ${timeSpent.value} seconds on this page.`)
}
