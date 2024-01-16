import { resolve } from 'node:path'
import { bgCyan, black } from 'kolorist'

export const port = parseInt(process.env.PORT || '') || 3303
export const r = (...args: string[]) => resolve(__dirname, '..', ...args)
export const isDev = process.env.NODE_ENV !== 'production'
// export const isFirefox = process.env.EXTENSION === 'firefox'
export const IS_FIREFOX = false
//  navigator.userAgent.indexOf('Firefox') >= 0
// export const IS_CHROME = /Chrome/i.test(navigator.userAgent)
// export function getChromeVersion () {
//   const ua = navigator.userAgent
//   const match = ua.match(/Chrome\/(\d+)/)
//   const version = match ? parseInt(match[1], 10) : null
//   return version
// }

// const chromeVersion = getChromeVersion()
// export const isSupportExecutionVersion = chromeVersion && chromeVersion >= 102

export function log(name: string, message: string) {
  console.log(black(bgCyan(` ${name} `)), message)
}
