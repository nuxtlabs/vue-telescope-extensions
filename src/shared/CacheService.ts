export default class AbstractCacheService {
  get key(): string {
    throw new Error('key must be set')
  }

  async get(): Promise<any> {
    const cache = await browser.storage.local.get([this.key])
    return cache[this.key]
  }

  async set(updatedState: any): Promise<void> {
    return browser.storage.local.set({ [this.key]: updatedState })
  }

  async clear(): Promise<void> {
    return browser.storage.local.remove([this.key])
  }
}
