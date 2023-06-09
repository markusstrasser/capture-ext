// highlight.js
import log from 'loglevel'
import { cond, equals, always, T } from 'ramda'

const getColorFromModifier = cond([
  [equals('alt'), always('navajoWhite')],
  [equals('command'), always('mistyrose')],
  [T, always('lightyellow')],
])
const Highlighter = (store) => {
  const createHighlightFromSelection = (selection, modifier) => {
    const text = selection.toString()

    // Highlight the text
    const range = selection.getRangeAt(0)
    const highlightNode = document.createElement('span')
    highlightNode.className = 'sense-highlight'
    highlightNode.style.backgroundColor = getColorFromModifier(modifier)

    highlightNode.addEventListener('click', () => {
      // Remove the highlight from the page
      removeHighlightFromPage(highlightNode, text)
      store.deleteHighlight(text)
    })

    highlightNode.style.cursor = 'pointer'
    range.surroundContents(highlightNode)

    // Save the highlighted text
    // addHighlight(text, modifier)
    log.debug(`Highlight Node created: '${text}'`)
    return text
  }

  const removeHighlightFromPage = (highlightNode, text) => {
    const parentNode = highlightNode.parentNode
    const textNode = document.createTextNode(text)
    parentNode.replaceChild(textNode, highlightNode)

    // Remove the highlight from local storage
    log.debug(`Highlight Node removed: '${text}'`)
    return true
  }

  return {
    createHighlightFromSelection,
    removeHighlightFromPage,
  }
}

export default Highlighter
