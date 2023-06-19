import CacheService from '../shared/CacheService'

// persistent state storage
export default class TabsStorage extends CacheService {
  get key () {
    return 'tabs'
  }

  async get () {
    const cache = await super.get()
    return cache || {}
  }

  async updateData (tabId, state) {
    const cache = await this.get()
    return this.set({ ...cache, [tabId]: state })
  }
}
