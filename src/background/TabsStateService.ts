import CacheService from '../shared/CacheService'

// persistent state storage
export default class TabsStorage extends CacheService {
  get key(): string {
    return 'tabs'
  }

  async get(): Promise<any> {
    const cache = await super.get()
    return cache || {}
  }

  async updateData(tabId: string, state: any): Promise<void> {
    const cache = await this.get()
    return this.set({ ...cache, [tabId]: state })
  }
}
