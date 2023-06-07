// userActivity.js
import log from 'loglevel'

const createUserActivity = (
  store,
  secondsUntilIdle = 10,
  secondsToIncrement = 3
) => {
  let lastActivityTime = Date.now()
  let isIdle = false
  let intervalId = null

  // Check for user activity
  const checkActivity = () => {
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
  const updateActivity = () => {
    lastActivityTime = Date.now()
    isIdle = false
  }

  const setupActivityListeners = () => {
    window.addEventListener('mousemove', updateActivity)
    window.addEventListener('keydown', updateActivity)
    window.addEventListener('scroll', updateActivity)
  }

  const removeActivityListeners = () => {
    window.removeEventListener('mousemove', updateActivity)
    window.removeEventListener('keydown', updateActivity)
    window.removeEventListener('scroll', updateActivity)
  }

  const startTracking = () => {
    setupActivityListeners()
    intervalId = setInterval(() => {
      checkActivity()
      if (document.visibilityState === 'visible' && !isIdle) {
        store.updateActiveTime(secondsToIncrement)
        log.debug(
          `User has spent ${store.state.value.activeTime} seconds on this page.`
        )
      } else {
        log.debug('Page is not visible or user is idle, not counting.')
      }
    }, secondsToIncrement * 1000)
  }

  const stopTracking = () => {
    removeActivityListeners()
    clearInterval(intervalId)
  }

  return {
    startTracking,
    stopTracking,
    isIdle,
  }
}

export default createUserActivity
