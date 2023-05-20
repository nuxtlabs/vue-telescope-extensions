import browser from 'webextension-polyfill'

// persistent state storage
export default class TabsStorage {
  constructor () {
    this.key = 'tabs'
  }

  async get () {
    const cache = await browser.storage.local.get([this.key])
    return cache[this.key] || {}
  }

  async set (tabId, state) {
    const cache = await this.get()
    return browser.storage.local.set({ [this.key]: { ...cache, [tabId]: state } })
  }

  async clear () {
    return browser.storage.local.remove([this.key])
  }
}
