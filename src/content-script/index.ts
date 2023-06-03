// content-script/index.ts
import { defineCustomElement } from 'vue'
import Button from './Button.vue' // Importing the Vue component into the content script
console.log('hello world from content script')

customElements.define('my-button', defineCustomElement(Button))

// Create a new custom element
const button = document.createElement('my-button')

// Append the button to the body
document.body.appendChild(button)

export {}
