// userActivity.js

import log from 'loglevel'

let lastActivityTime = Date.now()
let isIdle = false
const secondsUntilIdle = 10

// Check for user activity
function checkActivity() {
  const idleTime = Date.now() - lastActivityTime
  // Consider the user idle if they haven't been active for a certain amount of time
  isIdle = idleTime > secondsUntilIdle * 1000
  if (isIdle) {
    log.debug('User is idle')
  } else {
    log.debug('User is active')
  }
}

// Update the last activity time whenever the user does something
function updateActivity() {
  lastActivityTime = Date.now()
  isIdle = false
}

function setupActivityListeners() {
  window.addEventListener('mousemove', updateActivity)
  window.addEventListener('keydown', updateActivity)
  window.addEventListener('scroll', updateActivity)
}

function removeActivityListeners() {
  window.removeEventListener('mousemove', updateActivity)
  window.removeEventListener('keydown', updateActivity)
  window.removeEventListener('scroll', updateActivity)
}

export {
  checkActivity,
  setupActivityListeners,
  removeActivityListeners,
  isIdle,
}
