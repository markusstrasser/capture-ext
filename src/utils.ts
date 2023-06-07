//! refactor or put into Button.vue
const html2md = async () => {
  return new Promise((resolve, reject) => {
    const url = window.myExtensionData.url
    const apiKey = window.myExtensionData.apiKey
    log.debug('url', url, apiKey)

    chrome.runtime.sendMessage(
      { method: 'POST', url, apiKey, action: 'html2md' },
      (response) => {
        log.debug('response', response)

        if (response.error) {
          reject(response.error)
        } else {
          resolve(response.data)
        }
      }
    )
  })
}
export function createButton(name, onClickHandler, textContent = null) {
  const button = document.createElement(name)
  button.style.cursor = 'pointer'
  button.textContent = textContent || name
  button.addEventListener('click', onClickHandler)
  button.style.backgroundColor = '#f8f8f8' // Light gray background
  button.style.border = '1px solid #ccc' // Gray border
  button.style.borderRadius = '3px' // Rounded corners
  document.body.appendChild(button)
  return button
}

export function copyToClipboard(text) {
  // Create a temporary textarea element
  const textarea = document.createElement('textarea')
  textarea.textContent = text

  // Hide the textarea, but don't remove it from the document
  textarea.style.position = 'fixed' // This avoids scrolling to the bottom
  textarea.style.opacity = '0'

  // Add the textarea to the document
  document.body.appendChild(textarea)

  // Select the text
  textarea.select()

  // Try to copy the text
  try {
    return document.execCommand('copy') // This will return true if successful
  } catch (ex) {
    console.warn('Copy to clipboard failed.', ex)
    return false
  } finally {
    // Clean up the DOM by removing the textarea
    document.body.removeChild(textarea)
  }
}
