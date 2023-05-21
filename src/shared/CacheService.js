import browser from 'webextension-polyfill'

export default class AbstractCacheService {
  get key () {
    throw new Error('key must be set')
  }

  async get () {
    const cache = await browser.storage.local.get([this.key])
    return cache[this.key]
  }

  async set (updatedState) {
    return browser.storage.local.set({ [this.key]: updatedState })
  }

  async clear () {
    return browser.storage.local.remove([this.key])
  }
}
