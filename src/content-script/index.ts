// main.js
import { useMagicKeys } from '@vueuse/core'
import { defineCustomElement } from 'vue'
import { cond, T } from 'ramda'
import CopyHighlightButton from './CopyHighlights.vue'
import log from 'loglevel'
import Highlighter from './highlight'
import createStore from './store'
import createUserActivity from './userActivity'
import { copyToClipboard, createButton } from '~/utils'
const { command, alt } = useMagicKeys()

log.setDefaultLevel(log.levels.DEBUG) // Set logging level to DEBUG
const url = window.location.href
const store = createStore(url)
const highlight = Highlighter(store).createHighlightFromSelection
const userActivity = createUserActivity(store)
userActivity.startTracking() // Start tracking if user is Idle

// ? BUTTONS and EVENT LISTENERS
customElements.define('copy-button', defineCustomElement(CopyHighlightButton))
createButton('Delete', store.deleteStore)
createButton('copy-button', () =>
  copyToClipboard(store.formatHighlightsAsMarkdown())
)
document.addEventListener('mouseup', onMouseUp)
window.onbeforeunload = userActivity.stopTracking

log.debug(`%c Tracking time spent on ${url}`, 'color: blue;')

const getModifier = cond([
  [() => command.value, () => 'command'],
  [() => alt.value, () => 'alt'],
  [T, () => null],
])
function onMouseUp() {
  const selection = window.getSelection()
  if (selection && selection.toString().length > 0) {
    const modifier = getModifier()
    highlight(selection, modifier)
    const text = selection.toString()
    store.addHighlight(text, modifier)
    log.debug('mouseup event triggered - highlight created.')
  }
}
