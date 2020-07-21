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
            :href="`https://vuetelemetry.com/explore/${showcase.slug}`"
            target="_blank"
            class="mr-3"
          >
            <ExternalLinkIcon class="w-5 h-5 hover:text-primary-500" />
          </a>

          <a href="https://twitter.com/VueTelemetry" target="_blank" class="mr-3">
            <TwitterIcon class="w-5 h-5 hover:text-primary-500" />
          </a>

          <a href="https://github.com/nuxt-company/vue-telemetry-analyzer" target="_blank">
            <GithubIcon class="w-5 h-5 hover:text-primary-500" />
          </a>
        </div>
      </div>

      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <div v-if="state === 'data'">
          <div class="mb-8">
            <div class="mb-4">
              <h3 class="flex items-center font-bold pl-2 text-primary-500 uppercase">
                <InfoIcon class="h-5 mr-2 text-primary-5700 opacity-50" />Info
              </h3>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <ListBlock label="Vue version" href="https://vuejs.org/">
                <img :src="getURL('/vue.svg')" alt class="w-6 h-6 mr-2" />
                <div class="font-semibold">{{ showcase.vueVersion }}</div>
              </ListBlock>

              <ListBlock v-if="showcase.framework" label="Framework" :href="showcase.framework.url">
                <img :src="getURL(showcase.framework.imgPath)" alt class="w-6 h-6 mr-2" />
                <div class="font-semibold">{{ showcase.framework.name }}</div>
              </ListBlock>

              <ListBlock v-if="showcase.ui" label="UI Framework" :href="showcase.ui.url">
                <img :src="getURL(showcase.ui.imgPath)" alt class="w-6 h-6 mr-2" />
                <div class="font-semibold">{{ showcase.ui.name }}</div>
              </ListBlock>

              <ListBlock label="Rendering">
                <div class="font-semibold">{{ showcase.hasSSR ? 'Universal' : 'Client-side' }}</div>
              </ListBlock>

              <ListBlock
                v-if="showcase.framework && showcase.framework.slug === 'nuxtjs'"
                label="Deployment"
              >
                <div class="font-semibold">{{ showcase.isStatic ? 'Static' : 'Server' }}</div>
              </ListBlock>
            </div>
          </div>

          <div v-if="showcase.plugins.length" class="mb-4">
            <div class="mb-4">
              <h3 class="flex items-center font-bold pl-2 text-primary-500 uppercase">
                <PluginsIcon class="h-6 mr-2 text-primary-500 opacity-50" />Plugins
              </h3>
            </div>

            <div class="flex flex-wrap">
              <a
                v-for="plugin in showcase.plugins"
                :key="plugin.id"
                :href="plugin.url"
                target="_blank"
                class="mr-4 mb-4"
              >
                <span
                  class="block bg-grey-50 border border-grey-200 font-semibold text-sm px-4 py-2 rounded-xl"
                >{{ plugin.name }}</span>
              </a>
            </div>
          </div>

          <div v-if="showcase.modules.length">
            <div class="mb-4">
              <h3 class="flex items-center font-bold pl-2 text-primary-500 uppercase">
                <ModulesIcon class="h-6 mr-2 text-primary-500 opacity-50" />Nuxt Modules
              </h3>
            </div>

            <div class="flex flex-wrap">
              <a
                v-for="module in showcase.modules"
                :key="module.id"
                :href="module.url"
                target="_blank"
                class="mr-4 mb-4"
              >
                <span
                  class="block bg-grey-50 border border-grey-200 font-semibold text-sm px-4 py-2 rounded-xl"
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
import { mapGetters } from 'vuex'

import LogoIcon from '../images/logo.svg?inline'
import ExternalLinkIcon from '../images/external-link.svg?inline'
import TwitterIcon from '../images/twitter.svg?inline'
import GithubIcon from '../images/github.svg?inline'
import InfoIcon from '../images/info.svg?inline'
import PluginsIcon from '../images/plugins.svg?inline'
import ModulesIcon from '../images/modules.svg?inline'

import ListBlock from '../components/ListBlock.vue'

export default {
  components: {
    LogoIcon,
    ExternalLinkIcon,
    TwitterIcon,
    GithubIcon,
    InfoIcon,
    PluginsIcon,
    ModulesIcon,
    ListBlock
  },
  computed: {
    ...mapGetters([
      'isLoading',
      'showcase'
    ]),
    state () {
      if (this.showcase && this.showcase === 'error') {
        return 'error'
      } else if (this.showcase && this.showcase !== 'noVue') {
        return 'data'
      }

      return 'noVue'
    }
  },
  methods: {
    getURL (path) {
      return `https://icons.vuetelemetry.com${path}`
    }
  }
}
</script>
