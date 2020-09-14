<template>
  <div class="relative extension bg-white">
    <div class="px-4 pt-4">
      <div class="flex items-center justify-between mb-8">
        <a href="http://vuetelemetry.com/" target="_blank">
          <LogoIcon class="h-8" />
        </a>

        <div class="flex items-center">
          <a
            v-if="isRootUrl && showcase && showcase.hasVue && showcase.isPublic"
            :href="`https://vuetelemetry.com/explore/${showcase.slug}`"
            target="_blank"
            class="mr-3"
          >
            <AppButton size="small" appearance="primary" outlined>Open</AppButton>
          </a>
          <AppButton v-else-if="isRootUrl && showcase && showcase.hasVue && !showcase.isPublic && !savingError" @click.native="saveShowcase" size="small" appearance="primary" class="mr-3">{{ saving ? 'Saving...' : 'Save' }}</AppButton>

          <a href="https://twitter.com/VueTelemetry" target="_blank" class="mr-3">
            <TwitterIcon class="w-5 h-5 hover:text-primary-500" />
          </a>

          <a href="https://github.com/nuxt-company/vue-telemetry-analyzer" target="_blank">
            <GithubIcon class="w-5 h-5 hover:text-primary-500" />
          </a>
        </div>
      </div>

      <!-- <div v-if="isLoading && (!showcase || !showcase.url)">Please refresh the page to detect.</div> -->

      <div v-if="isLoading" class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div class="font-bold-body-weight text-seven">Loading...</div>
      </div>

      <div v-else-if="!showcase || !showcase.url" class="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div class="font-bold-body-weight text-eight">Please enter an url in the address bar.</div>
      </div>

      <div v-else-if="showcase">
        <div v-if="showcase.hasVue">
          <div class="mb-8">
            <div v-if="savingError" class="mb-4 text-orange">
              Could not save website to Vue Telemetry, please try again later or <a class="underline" :href="`mailto:vuetelemetry@nuxtjs.com?subject=Could not save ${showcase.url}`">contact us</a>.
            </div>
            <div class="mb-4">
              <h3 class="flex items-center font-bold-body-weight pl-2 text-primary-500 uppercase">
                <InfoIcon class="h-5 mr-2 text-primary-5700 opacity-50" />Info
              </h3>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <ExploreDataItem
                label="Vue Version"
                tag="a"
                href="https://vuejs.org"
                target="_blank"
                rel="noreferrer noopener"
              >
                <img
                  class="w-6 h-6 mr-2"
                  :src="iconURL('/vue.svg')"
                  alt
                />
                <div class=" text-base leading-base font-bold-body-weight">
                  {{ showcase.vueVersion }}
                </div>
              </ExploreDataItem>

              <ExploreDataItem
                v-if="showcase.framework"
                label="Framework"
                tag="a"
                :href="showcase.framework.url"
                target="_blank"
                rel="noreferrer noopener"
              >
                <img
                  class="w-6 h-6 mr-2"
                  :src="iconURL(showcase.framework.imgPath)"
                  alt
                />
                <div class="text-base leading-seven font-bold-body-weight">
                  {{ showcase.framework.name }}
                </div>
              </ExploreDataItem>

              <ExploreDataItem
                v-if="showcase.ui"
                label="UI Framework"
                tag="a"
                :href="showcase.ui.url"
                target="_blank"
                rel="noreferrer noopener"
              >
                <img
                  class="w-6 h-6 mr-2"
                  :src="iconURL(showcase.ui.imgPath)"
                  alt
                />
                <div class="text-base leading-seven font-bold-body-weight">
                  {{ showcase.ui.name }}
                </div>
              </ExploreDataItem>

              <ExploreDataItem label="Rendering">
                <div
                  class="flex items-center text-base leading-seven font-bold-body-weight"
                >
                  {{ showcase.hasSSR ? 'Universal' : 'Client-side' }}
                </div>
              </ExploreDataItem>

              <ExploreDataItem
                v-if="showcase.framework && showcase.framework.slug === 'nuxtjs'"
                label="Deployment"
              >
                <div
                  class="flex items-center text-base leading-seven font-bold-body-weight"
                >
                  {{ showcase.isStatic ? 'Static' : 'Server' }}
                </div>
              </ExploreDataItem>
            </div>
          </div>

          <div v-if="showcase.plugins.length" class="mb-4">
            <div class="mb-4">
              <h3 class="flex items-center font-bold-body-weight pl-2 text-primary-500 uppercase">
                <PluginsIcon class="h-6 mr-2 text-primary-500 opacity-50" />Plugins
              </h3>
            </div>

            <div class="flex flex-wrap">
              <a
                v-for="plugin in showcase.plugins"
                :key="plugin.id"
                :href="plugin.url"
                target="_blank"
                class="mr-4 mb-4 bg-grey-50 hover:bg-grey-100 border border-grey-200 rounded-xl"
              >
                <span
                  class="block font-bold-body-weight px-4 py-2 text-sm"
                >
                  {{ plugin.name }}
                </span>
              </a>
            </div>
          </div>

          <div v-if="showcase.modules.length">
            <div class="mb-4">
              <h3 class="flex items-center font-bold-body-weight pl-2 text-primary-500 uppercase">
                <ModulesIcon class="h-6 mr-2 text-primary-500 opacity-50" />Nuxt Modules
              </h3>
            </div>

            <div class="flex flex-wrap">
              <a
                v-for="module in showcase.modules"
                :key="module.id"
                :href="module.url"
                target="_blank"
                class="mr-4 mb-4 bg-grey-50 hover:bg-grey-100 border border-grey-200 rounded-xl"
              >
                <span
                  class="block font-bold-body-weight px-4 py-2 text-sm"
                >
                  {{ module.name }}
                </span>
              </a>
            </div>
          </div>
        </div>

        <div v-else-if="!showcase.hasVue" class=" pointer-events-none absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div class="font-bold-body-weight text-eight">Vue is not used on this website</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import browser from 'webextension-polyfill'

import LogoIcon from '../images/logo.svg?inline'
// // import ExternalLinkIcon from '../images/external-link.svg?inline'
import TwitterIcon from '../images/twitter.svg?inline'
import GithubIcon from '../images/github.svg?inline'
import InfoIcon from '../images/info.svg?inline'
import PluginsIcon from '../images/plugins.svg?inline'
import ModulesIcon from '../images/modules.svg?inline'
// import RefreshIcon from '../images/refresh.svg?inline'

import ExploreDataItem from '../components/ExploreDataItem.vue'
import AppButton from '../components/AppButton.vue'

export default {
  components: {
  //   // ExternalLinkIcon,
    LogoIcon,
    TwitterIcon,
    GithubIcon,
    InfoIcon,
    PluginsIcon,
    ModulesIcon,
    //   RefreshIcon,
    ExploreDataItem,
    AppButton
  },
  data () {
    return {
      isLoading: true,
      saving: false,
      savingError: false,
      showcase: null,
      currentTab: null
    }
  },
  computed: {
    isRootUrl () {
      if (!this.showcase || !this.showcase.url) {
        return false
      }
      const { hostname } = new URL(this.showcase.url)
      if (this.showcase.url.endsWith(hostname) || this.showcase.url.endsWith(hostname + '/')) {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    this.detect()
  },
  beforeDestroy () {
    if (!this._timer) {
      clearTimeout(this._timer)
      delete this._timer
    }
  },
  methods: {
    async detect (nbTries = 0) {
      this.currentTab = await this.getCurrentTab()
      if (!this.currentTab) {
        this._timer = setTimeout(() => this.detect(), 1000)
        return
      }
      const tabId = this.currentTab.id
      const res = await this.sendToBackground({
        from: 'popup',
        action: 'getShowcase',
        payload: {
          tabId
        }
      })
      if (!res.payload && nbTries < 3) {
        this._timer = setTimeout(() => this.detect(nbTries + 1), 1000)
        return
      }
      this.isLoading = false
      this.showcase = res.payload || null

    // this.sendToContent({
    //   proxyTo: 'injected',
    //   from: 'popup',
    //   payload: 'test from popup'
    // })
    },
    async getCurrentTab () {
      return await browser.tabs.query({ currentWindow: true, active: true }).then((tabsArray) => {
        const { id, status, url } = tabsArray[0]
        if (status === 'complete') {
          return { id, url }
        }
        return null
      })
    },
    sendToBackground (message) {
      return browser.runtime.sendMessage(message)
    },
    // sendToContent (message) {
    //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
    //       alert(response)
    //     })
    //   })
    // },
    iconURL (path) {
      return `https://icons.vuetelemetry.com${path}`
    },
    async saveShowcase () {
      this.saving = true
      this.savingError = false
      try {
        if (typeof EventSource === 'undefined') {
          console.log('EventSource is not supported in current borwser!')
          return
        }
        const sse = new EventSource(
        `http://localhost:3001?url=${this.showcase.url}&isPublic=true&force=true`
        )
        sse.addEventListener('message', (event) => {
          const res = JSON.parse(JSON.parse(event.data).body)

          if (res.statusCode === 200 && !res.body.isAdultContent) {
            this.showcase.slug = res.body.slug
            this.showcase.isPublic = res.body.isPublic
            this.saving = false
            sse.close()
          } else {
            sse.close()
            throw new Error('API call to VT failed')
          }
        })

        // await fetch(`https://vuetelemetry.com/api/analyze?url=${this.showcase.url}&isPublic=true&force=true`, {
        //   method: 'GET'
        // })
        //   .then((response) => {
        //     if (!response.ok) {
        //       throw new Error('API call to VT failed')
        //     }
        //     return response.json()
        //   })
        //   .then(({ body }) => {
        //     this.showcase.slug = body.slug
        //     this.showcase.isPublic = body.isPublic
        //     this.saving = false
        //   })
        const tabId = this.currentTab.id
        await this.sendToBackground({
          from: 'popup',
          action: 'analyze',
          payload: {
            tabId,
            ...this.showcase // TODO: ugly stuff, make separate handler in background for refreshing backend analyzer data later
          }
        })
      } catch (err) {
        this.saving = false
        this.savingError = true
      }
    }
  }
}
</script>
