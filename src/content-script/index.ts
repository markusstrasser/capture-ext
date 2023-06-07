// main.js
import { ref, watchEffect } from 'vue'
import { useMagicKeys } from '@vueuse/core'
import { defineCustomElement } from 'vue'

import Button from './HighlightButton.vue'
import log from 'loglevel'
import Highlighter from './highlight'
import createStore from './store'
import createUserActivity from './userActivity'

const keys = useMagicKeys()

log.setDefaultLevel(log.levels.DEBUG) // Set logging level to DEBUG
const url = window.location.href
const store = createStore(url)
const highlight = Highlighter(store).createHighlightFromSelection
const userActivity = createUserActivity(store)

// Start tracking user activity
userActivity.startTracking()
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

log.info(`%c Tracking time spent on ${url}`, 'color: blue;')

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
  userActivity.stopTracking()
  log.debug(
    `User has spent total of ${store.state.value.activeTime} seconds on this page.`
  )
}
