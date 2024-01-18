export interface Showcase {
  vueVersion?: string
  hasVue: boolean
  hasSSR?: boolean
  isStatic?: boolean
  path?: string
  url?: string
  framework?: Framework
  ui?: AddOns
  plugins?: AddOns[]
  modules?: AddOns[]
}

export interface AddOns {
  imgPath: string
  name: string
  slug: string
  url: string
}

export interface Framework extends AddOns {
  version: string
}
