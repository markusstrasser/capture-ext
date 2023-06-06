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
