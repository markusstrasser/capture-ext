// main.js
import { ref, watchEffect } from 'vue'
import { useMagicKeys } from '@vueuse/core'
import { defineCustomElement } from 'vue'
import {
  checkActivity,
  setupActivityListeners,
  removeActivityListeners,
  isIdle,
} from './userActivity'
import Button from './HighlightButton.vue' // Importing the Vue component into the content
import log from 'loglevel'
import Highlighter from './highlight'
import createStore from './store'
const keys = useMagicKeys()

log.setDefaultLevel(log.levels.DEBUG) // Set logging level to DEBUG
const url = window.location.href
const store = createStore(url)
const highlight = Highlighter(store).createHighlightFromSelection
//? ---- HIGHLIGHT FUNCTIONS

//add a button to the DOM that will trigger the store.delete() function
const deleteButton = document.createElement('button')
deleteButton.innerHTML = 'Delete'
deleteButton.style.cursor = 'pointer'
deleteButton.addEventListener('click', () => {
  const v = store.deleteStore()
  log.debug('store deleted', v)
})
document.body.appendChild(deleteButton)

// Convert the Vue component to a custom element
customElements.define('my-button', defineCustomElement(Button))
const button = document.createElement('my-button')
document.body.appendChild(button)

let intervalId
const secondstoIncrement = 3

log.info(`%c Tracking time spent on ${url}`, 'color: blue;')

setupActivityListeners()
intervalId = setInterval(() => {
  checkActivity()
  if (document.visibilityState === 'visible' && !isIdle) {
    store.updateActiveTime(secondstoIncrement)
    log.debug(`User has spent ${store.state.activeTime} seconds on this page.`)
  } else {
    log.debug('Page is not visible or user is idle, not counting.')
  }
}, secondstoIncrement * 1000)

// mouseup event
document.addEventListener('mouseup', () => {
  const selection = window.getSelection()

  if (selection && selection.toString().length > 0) {
    const modifier = keys.shift.value
      ? 'shift'
      : keys.meta.value
      ? 'command'
      : null
    highlight(selection, modifier)
    const text = selection.toString()
    store.addHighlight(text, modifier)
    log.debug('mouseup event triggered - highlight created.')
  }
})

// mousedown event
document.addEventListener('mousedown', () => {
  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    log.debug('mousedown event triggered.')
  }
})

// onbeforeunload event
window.onbeforeunload = () => {
  log.info(`%c Stopped tracking time spent on ${url}`, 'color: blue;')
  clearInterval(intervalId)
  removeActivityListeners()
  log.debug(
    `User has spent total of ${store.state.activeTime} seconds on this page.`
  )
}
