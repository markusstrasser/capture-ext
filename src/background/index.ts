console.log('hello world from background')
import axios from 'axios'
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.method === 'POST' && request.action === 'html2md') {
    // perform the axios post as before...
    console.log('request', request)
    fetch('https://2markdown.com/api/2md', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': request.apiKey,
      },
      body: JSON.stringify({ url: request.url }),
    })
      .then((response) => response.json())
      .then((data) => {
        sendResponse({ data })
      })
      .catch((error) => {
        sendResponse({ error: error.toString() })
      })

    // This line is important, it makes the function asynchronous and allows sendResponse to be called later
    return true
  }
})

// export {}
