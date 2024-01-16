<script setup lang="ts">
const showcase = ref()
const isLoading = ref(false)
const timer = ref()
const currentTab = ref()

const getCurrentTab = async () => {
  return await browser.tabs
    .query({ currentWindow: true, active: true })
    .then((tabsArray: any) => {
      const { id, status, url } = tabsArray[0]
      if (status === 'complete')
        return { id, url }

      return null
    })
}

const sendToBackground = (message: any) => {
  return browser.runtime.sendMessage(message)
}

const detect = async (nbTries = 0) => {
  currentTab.value = await getCurrentTab()
  if (!currentTab.value) {
    timer.value = setTimeout(() => detect(), 1000)
    return
  }
  const tabId = currentTab.value.id
  const res = await sendToBackground({
    from: 'popup',
    action: 'getShowcase',
    payload: {
      tabId,
    },
  })
  if (!res.payload && nbTries < 3) {
    timer.value = setTimeout(() => detect(nbTries + 1), 1000)
    return
  }
  isLoading.value = false
  showcase.value = res.payload || null

  // this.sendToContent({
  //   proxyTo: 'injected',
  //   from: 'popup',
  //   payload: 'test from popup'
  // })
}

onMounted(() => {
  detect()
  // console.log('showcase', showcase.value)
})
</script>

<template>
  <main class="w-[561px] text-center bg-gray-950 p-6">
    <div class="flex items-center justify-center pb-4 border-b border-gray-800">
      <Logo />
    </div>

    <div class="h-[400px]" />

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
