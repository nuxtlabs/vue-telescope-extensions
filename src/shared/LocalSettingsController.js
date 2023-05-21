import CachedService from './CacheService'

const defaultSettings = {
  useFrameworkIcon: false
}

export default class extends CachedService {
  get key () {
    return 'settings'
  }

  async get () {
    const cache = await super.get()
    return cache || defaultSettings
  }
}
