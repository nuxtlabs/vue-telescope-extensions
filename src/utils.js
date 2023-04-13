export const IS_FIREFOX = navigator.userAgent.indexOf('Firefox') >= 0
export const IS_CHROME = /Chrome/i.test(navigator.userAgent)
export function getChromeVersion () {
  const ua = navigator.userAgent
  const match = ua.match(/Chrome\/(\d+)/)
  const version = match ? parseInt(match[1], 10) : null
  return version
}

const chromeVersion = getChromeVersion()
export const isSupportExecutionVersion = chromeVersion && chromeVersion >= 102
