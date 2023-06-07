// pageData.js
import { useStorage } from '@vueuse/core'

const initState = (url) =>
  useStorage(url, {
    activeTime: 0,
    highlights: [],
    visits: [],
  })
const createStore = (url) => ({
  state: initState(url),

  addHighlight(text, modifier) {
    this.state.value.highlights.push({ text, modifier })
  },

  deleteHighlight(text) {
    this.state.value.highlights = this.state.value.highlights.filter(
      (highlight) => highlight.text !== text
    )
  },

  updateActiveTime(seconds) {
    this.state.value.activeTime += seconds
  },

  addVisit() {
    this.state.value.visits.push(Date.now())
  },

  deleteStore() {
    this.state = initState(url)
    return this.state.value
  },
})

export default createStore
