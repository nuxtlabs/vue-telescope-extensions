<script setup lang="ts">
import type { Showcase } from '../../types'

const showcase = ref<Showcase>()
const isLoading = ref(false)
const currentTab = ref()
const timer = ref()

const isRootUrl = computed(() => {
  if (!showcase.value || !showcase.value.url)
    return false

  const { hostname } = new URL(showcase.value.url)

  if (showcase.value.url.endsWith(hostname) || showcase.value.url.endsWith(`${hostname}/`))
    return false
  else
    return true
})

const vueDocsURL = computed(() => {
  return (
    (showcase.value?.vueVersion?.startsWith('1') && 'https://v1.vuejs.org')
    || (showcase.value?.vueVersion?.startsWith('2') && 'https://v2.vuejs.org')
    || (showcase.value?.vueVersion?.startsWith('3') && 'https://vuejs.org')
  )
})

const getCurrentTab = async (): Promise<{ id: number; url: string } | null> => {
  return await browser.tabs.query({ currentWindow: true, active: true })
    .then((tabs: any[]) => {
      const { id, status, url } = tabs[0]

      if (status === 'complete')
        return { id, url }

      return null
    })
}

const saveShowcase = async () => {
  try {
    if (typeof EventSource === 'undefined') {
      // eslint-disable-next-line no-console
      console.log('EventSource is not supported in the current browser!')
      return
    }

    const sse = new EventSource(
      `https://service.vuetelescope.com?url=${showcase.value.url}&isPublic=true`,
    )

    sse.addEventListener('message', (event: MessageEvent) => {
      try {
        const res = JSON.parse(event.data)
        if (!res.error && !res.isAdultContent && showcase.value) {
          showcase.value.slug = res.slug
          showcase.value.isPublic = res.isPublic
          sse.close()
        }
        else {
          throw new Error('API call to VT failed')
        }
      }
      catch (err) {
        sse.close()
      }
    })

    const tabId = currentTab.value.id

    await browser.runtime.sendMessage({
      from: 'popup',
      action: 'analyze',
      payload: {
        tabId,
        showcase,
      },
    })
  }
  catch (err) {
    throw new Error('Failed to save showcase0')
  }
}

const detect = async (nbTries = 0) => {
  currentTab.value = await getCurrentTab()

  if (!currentTab.value) {
    timer.value = setTimeout(() => detect(), 1000)
    return
  }

  const tabId: number = currentTab.value.id

  const res = await browser.runtime.sendMessage({
    from: 'popup',
    action: 'getShowcase',
    payload: { tabId },
  })

  if (!res.payload && nbTries < 3) {
    timer.value = setTimeout(() => detect(nbTries + 1), 1000)
    return
  }

  isLoading.value = false
  showcase.value = res.payload || null
}

onMounted(() => detect().then(() => {
  if (isRootUrl.value && showcase.value?.hasVue)
    saveShowcase()
}))

onUnmounted(() => {
  clearTimeout(timer.value)
  timer.value = 0
})
</script>

<template>
  <main class="w-[561px] bg-gray-950 p-6">
    <div class="flex items-center justify-center pb-4 border-b border-gray-800">
      <Logo />
    </div>

    <div v-if="isLoading" class="flex items-center justify-center p-8 text-lg text-white">
      Loading...
    </div>

    <div v-else-if="!showcase || !showcase.url" class="flex items-center justify-center p-8 text-lg text-white">
      Please enter a url in the address bar.
    </div>

    <div v-else-if="showcase" class="text-sm font-semibold text-white pt-8 pb-10">
      <div v-if="showcase.hasVue">
        <div class="pb-6">
          <div class="mb-3">
            Infos
          </div>

          <ul class="grid grid-cols-3 gap-4">
            <li v-if="showcase.vueVersion">
              <ExploreDataItem :url="vueDocsURL || ''" :label="showcase.vueVersion" icon="/vue.svg" infos />
            </li>

            <li v-if="showcase.framework">
              <ExploreDataItem :url="showcase.framework.url" :label="showcase.framework.version || showcase.framework.name" :icon="showcase.framework.imgPath" infos />
            </li>

            <li v-if="showcase.ui">
              <ExploreDataItem :url="showcase.ui.url" :label="showcase.ui.name" :icon="showcase.ui.imgPath" infos />
            </li>

            <li v-if="showcase.hasSSR !== undefined">
              <ExploreDataItem :label="showcase.hasSSR ? 'SSR' : 'CSR'" infos />
            </li>

            <li v-if="showcase.isStatic !== undefined">
              <ExploreDataItem :label="showcase.isStatic ? 'Static' : 'Server'" infos />
            </li>
          </ul>
        </div>

        <div v-if="showcase.plugins && showcase.plugins.length" class="pb-6">
          <div class="pb-3">
            Plugins
          </div>

          <ul class="flex space-x-4">
            <li v-for="plugin in showcase.plugins" :key="plugin.name">
              <ExploreDataItem :label="plugin.name" :tag="plugin.url && 'a'" :url="plugin.url" :icon="plugin.imgPath" class="py-1 px-2 bg-gray-900" />
            </li>
          </ul>
        </div>

        <div v-if="showcase.modules && showcase.modules.length">
          <div class="pb-3">
            Nuxt Modules
          </div>

          <ul class="flex space-x-4">
            <li v-for="module in showcase.modules" :key="module.name">
              <ExploreDataItem :label="module.name" :tag="module.url && 'a'" :url="module.url" :icon="module.imgPath" class="py-1 px-2 bg-gray-900" />
            </li>
          </ul>
        </div>
      </div>
      <div v-else-if="!showcase.hasVue" class="flex items-center justify-center p-8 text-lg text-white">
        Vue is not used on this website
      </div>
    </div>

    <div class="flex items-end justify-between pt-5 border-t border-gray-800">
      <span target="_blank" class="text-gray-400">Published under <a href="https://github.com/nuxtlabs/vue-telescope-extensions/blob/main/LICENSE" class="hover:underline">MIT license.</a></span>

      <div class="flex space-x-4">
        <a href="https://github.com/nuxtlabs/vue-telescope-extensions" class="text-gray-400" target="_blank">
          <div class="w-5 h-5 duration-200 i-simple-icons-github hover:bg-gray-300 transition-hover" />
        </a>
        <a href="https://github.com/nuxtlabs/vue-telescope-extensions" class="text-gray-400" target="_blank">
          <div class="w-5 h-5 duration-200 i-simple-icons-twitter hover:bg-gray-300 transition-hover" />
        </a>
      </div>
    </div>
  </main>
</template>
