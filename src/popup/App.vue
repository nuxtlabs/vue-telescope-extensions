<template>
  <div class="extension bg-white">
    <div class="px-4 pt-4">
      <div class="flex items-center justify-between mb-8">
        <a href="http://vuetelemetry.com/" target="_blank">
          <LogoIcon class="h-8" />
        </a>

        <div class="flex items-center">
          <a
            v-if="state === 'data'"
            :href="`https://vuetelemetry.com/explore/${website.slug}`"
            target="_blank"
            class="mr-2"
          >
            <ExternalLinkIcon class="w-8 h-8" />
          </a>

          <a href="https://github.com/nuxt-company/vue-telemetry-website" target="_blank">
            <GithubIcon class="w-8 h-8" />
          </a>
        </div>
      </div>

      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <div v-if="state === 'data'">
          <div>
            <div class="mb-4">
              <h3 class="flex items-center font-bold pl-2 text-primary-700 uppercase">
                <ConfigIcon class="h-5 mr-2 text-primary-700 opacity-50" />Info
              </h3>
            </div>

            <div class="flex flex-wrap">
              <ListBlock>
                <VueIcon class="w-5 h-5 mr-2" />
                <div class="font-semibold">{{ website.vueVersion }}</div>
              </ListBlock>

              <ListBlock>
                <div class="font-semibold mr-2">SSR</div>
                <CheckmarkCircleFillIcon v-if="website.hasSSR" class="w-5 h-5 text-primary-700" />
                <XmarkCircleFillIcon v-else class="w-5 h-5 text-grey-400" />
              </ListBlock>

              <ListBlock>
                <div class="font-semibold mr-2">Static</div>
                <CheckmarkCircleFillIcon v-if="website.isStatic" class="w-5 h-5 text-primary-700" />
                <XmarkCircleFillIcon v-else class="w-5 h-5 text-grey-400" />
              </ListBlock>

              <ListBlock v-if="website.framework">
                <div class="font-semibold mr-2">Framework</div>
                <a :href="website.framework.url" target="_blank" class>
                  <img :src="getURL(website.framework.imgPath)" alt class="w-6 h-6" />
                </a>
              </ListBlock>

              <ListBlock v-if="website.ui">
                <div class="font-semibold mr-2">UI Framework</div>
                <a :href="website.ui.url" target="_blank" class>
                  <img :src="getURL(website.ui.imgPath)" alt class="w-6 h-6" />
                </a>
              </ListBlock>
            </div>
          </div>

          <div v-if="website.plugins.length">
            <div class="mb-4">
              <h3 class="flex items-center font-bold pl-2 text-primary-700 uppercase">
                <PluginsIcon class="h-6 mr-2 text-primary-700 opacity-50" />Plugins
              </h3>
            </div>

            <div class="flex flex-wrap">
              <a
                v-for="plugin in website.plugins"
                :key="plugin.id"
                :href="plugin.url"
                target="_blank"
                class="mr-4 mb-4"
              >
                <span
                  class="block bg-grey-100 font-semibold px-4 py-2 text-sm rounded-full"
                >{{ plugin.name }}</span>
              </a>
            </div>
          </div>

          <div v-if="website.modules.length">
            <div class="mb-4">
              <h3 class="flex items-center font-bold pl-2 text-primary-700 uppercase">
                <ModulesIcon class="h-6 mr-2 text-primary-700 opacity-50" />Nuxt Modules
              </h3>
            </div>

            <div class="flex flex-wrap">
              <a
                v-for="module in website.modules"
                :key="module.id"
                :href="module.url"
                target="_blank"
                class="mr-4 mb-4"
              >
                <span
                  class="block bg-grey-100 font-semibold px-4 py-2 text-sm rounded-full"
                >{{ module.name }}</span>
              </a>
            </div>
          </div>
        </div>
        <div v-else-if="state === 'error'">An error occurred</div>
        <div v-else-if="state === 'noVue'">Vue is not used on this website</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import LogoIcon from '../images/logo.svg?inline'
import XmarkCircleFillIcon from '../images/icons/xmark-circle-fill.svg?inline'
import CheckmarkCircleFillIcon from '../images/icons/checkmark-circle-fill.svg?inline'
import VueIcon from '../images/icons/vue.svg?inline'
import GithubIcon from '../images/icons/github.svg?inline'
import ExternalLinkIcon from '../images/icons/external-link.svg?inline'
import ModulesIcon from '../images/icons/modules.svg?inline'
import PluginsIcon from '../images/icons/plugins.svg?inline'
import ConfigIcon from '../images/icons/config.svg?inline'

import ListBlock from '../components/ListBlock.vue'

export default {
  components: {
    LogoIcon,
    XmarkCircleFillIcon,
    CheckmarkCircleFillIcon,
    GithubIcon,
    VueIcon,
    ModulesIcon,
    PluginsIcon,
    ConfigIcon,
    ExternalLinkIcon,
    ListBlock
  },
  computed: {
    ...mapState([
      'dataInfo',
      'isLoading',
      'currentDomain'
    ]),
    website () {
      return this.dataInfo[this.currentDomain]
    },
    state () {
      const website = this.dataInfo[this.currentDomain]

      if (website && website === 'error') {
        return 'error'
      } else if (website && website !== 'noVue') {
        return 'data'
      }

      return 'noVue'
    }
  },
  methods: {
    getURL (path) {
      return `https://nuxt-company.github.io/vue-telemetry-analyzer${path}`
    }
  }
}
</script>
