// main.js
import { ref, watchEffect } from 'vue'
import { useStorage, useMagicKeys } from '@vueuse/core'
import { defineCustomElement } from 'vue'
import {
  checkActivity,
  setupActivityListeners,
  removeActivityListeners,
  isIdle,
} from './userActivity'
import Button from './HighlightButton.vue' // Importing the Vue component into the content
import log from 'loglevel'
import getXPath from 'get-xpath'
const keys = useMagicKeys()

log.setDefaultLevel(log.levels.DEBUG) // Set logging level to DEBUG
const url = window.location.href

// Convert the Vue component to a custom element
customElements.define('my-button', defineCustomElement(Button))

// Create a new custom element
const button = document.createElement('my-button')

window.myExtensionData = {
  url: window.location.href,
  apiKey: 'sk-38f7f08914ac64b09eea0876561b1f93',
}

// the rest of your content script code...

// Append the button to the body
document.body.appendChild(button)

const pageData = useStorage(url, {
  activeTime: 0,
  highlights: [],
  visits: [Date.now()],
})

let intervalId
const secondstoIncrement = 3

log.info(`%c Tracking time spent on ${url}`, 'color: blue;')

setupActivityListeners()
intervalId = setInterval(() => {
  checkActivity()
  if (document.visibilityState === 'visible' && !isIdle) {
    pageData.value.activeTime += secondstoIncrement
    log.debug(
      `User has spent ${pageData.value.activeTime} seconds on this page.`
    )
  } else {
    log.debug('Page is not visible or user is idle, not counting.')
  }
}, secondstoIncrement * 1000)

// Load the highlights from local storage
const urlHighlights = pageData.value.highlights
urlHighlights.forEach(({ text, modifier, xpath }) => {
  // Locate the highlight node using the saved XPath
  const highlightNode = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue
  console.log('highlightNode', highlightNode, xpath)
  if (highlightNode) {
    // Apply the highlight
    highlightNode.style.backgroundColor =
      modifier === 'shift'
        ? 'lightorange'
        : modifier === 'command'
        ? 'lightpink'
        : 'yellow'
  }
})

const { shift, meta: command } = useMagicKeys()

let currentSelection = null

document.addEventListener('mousedown', () => {
  console.log('mousedown')
  console.log('currentSelection', currentSelection)

  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    currentSelection = selection.getRangeAt(0).cloneRange()
    console.log('currentSelection_inloop', currentSelection)
  }
})

document.addEventListener('mouseup', () => {
  const selection = window.getSelection()
  if (selection && selection.toString().length > 0) {
    const text = selection.toString()

    // Highlight the text
    const range = selection.getRangeAt(0)
    const highlightNode = document.createElement('span')
    highlightNode.className = 'sense-highlight'
    highlightNode.style.backgroundColor = keys.shift.value
      ? 'lightorange'
      : keys.meta.value
      ? 'lightpink'
      : 'yellow'

    highlightNode.addEventListener('click', () => {
      // Remove the highlight from the page
      const parentNode = highlightNode.parentNode
      const textNode = document.createTextNode(text) // Use 'text' instead of 'highlightText'
      parentNode.replaceChild(textNode, highlightNode)

      // Remove the highlight from local storage
      const index = pageData.value.highlights.findIndex(
        (h) => h.text === text && h.modifier === modifier
      )
      if (index !== -1) {
        pageData.value = {
          ...pageData.value,
          highlights: [
            ...pageData.value.highlights.slice(0, index),
            ...pageData.value.highlights.slice(index + 1),
          ],
        }
      }
    })
    highlightNode.style.cursor = 'pointer'

    range.surroundContents(highlightNode)

    // Add an event listener to the highlight span
    // Add an event listener to the highlight span

    // Add a hover style to the highlight span

    // Clear the selection
    if (window.getSelection) {
      if (window.getSelection().empty) {
        // Chrome
        window.getSelection().empty()
      } else if (window.getSelection().removeAllRanges) {
        // Firefox
        window.getSelection().removeAllRanges()
      }
    } else if (document.selection) {
      // IE?
      document.selection.empty()
    }

    // Save the highlighted text
    const modifier = keys.shift.value
      ? 'shift'
      : keys.meta.value
      ? 'command'
      : null

    const xpath = getXPath(highlightNode)
    pageData.value = {
      ...pageData.value,
      highlights: [...pageData.value.highlights, { text, modifier, xpath }],
    }
  }
})

// window.onbeforeunload = // This function is a placeholder. Replace it with your actual function for generating XPaths.
//   function getXPath(element) {
//     // Generate the XPath of the given element
//     return ''
//   }

window.onbeforeunload = () => {
  log.info(`%c Stopped tracking time spent on ${url}`, 'color: blue;')
  clearInterval(intervalId)
  removeActivityListeners()
  log.debug(
    `User has spent total of ${pageData.value.activeTime} seconds on this page.`
  )
  // Save the current time as the end of the visit
}
