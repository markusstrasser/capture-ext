import { useMagicKeys } from '@vueuse/core'
import { cond, T } from 'ramda'
import log from 'loglevel'
import Highlighter from './highlight'
import createStore from './store'
import createUserActivity from './userActivity'
import { copyToClipboard } from '~/utils'
const { command, alt } = useMagicKeys()

log.setDefaultLevel(log.levels.DEBUG) // Set logging level to DEBUG
const url = window.location.href
const store = createStore(url)
const highlight = Highlighter(store).createHighlightFromSelection
const userActivity = createUserActivity(store)
userActivity.startTracking() // Start tracking if user is Idle

store.addVisit()
// ? BUTTONS and EVENT LISTENERS
const deleteButton = document.createElement('button')
deleteButton.textContent = 'Delete'
deleteButton.style.cursor = 'pointer'
deleteButton.addEventListener('click', () => store.deleteStore())
document.body.appendChild(deleteButton)

const copyButton = document.createElement('button')
copyButton.textContent = 'Copy Highlights'
copyButton.style.cursor = 'pointer'
copyButton.addEventListener('click', (event) => {
  event.preventDefault()
  const md = store.toMarkdown()
  log.debug('md', md)
  copyToClipboard(md)
})
document.body.appendChild(copyButton)

document.addEventListener('mouseup', onMouseUp)
window.onbeforeunload = userActivity.stopTracking

log.debug(`%c Tracking time spent on ${url}`, 'color: blue;')

const getModifier = cond([
  [() => command.value, () => 'command'],
  [() => alt.value, () => 'alt'],
  [T, () => null],
])
function onMouseUp(event) {
  event.preventDefault()
  const selection = window.getSelection()
  if (selection && selection.toString().length > 0) {
    const modifier = getModifier()
    highlight(selection, modifier)
    const text = selection.toString()
    store.addHighlight(text, modifier)
    log.debug('mouseup event triggered - highlight created.')
  }
}
