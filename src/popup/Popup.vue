<script setup lang="ts">
const showcase = ref()
const isLoading = ref(false)
const saving = ref(false)
const savingError = ref(false)
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
    (showcase.value.vueVersion.startWith('1') && 'https://v1.vuejs.org')
    || (showcase.value.vueVersion.startWith('2') && 'https://v2.vuejs.org')
    || (showcase.value.vueVersion.startWith('3') && 'https://vuejs.org')
  )
})

const getCurrentTab = async () => {
  return await browser.tabs.query({ currentWindow: true, active: true })
    .then((tabsArray: any) => {
      const { id, status, url } = tabsArray[0]

      if (status === 'complete')
        return { id, url }

      return null
    })
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

  // console.log('res', res)

  // if (!res.payload && nbTries < 3) {
  //   timer.value = setTimeout(() => detect(nbTries + 1), 1000)
  //   return
  // }

  // isLoading.value = false
  // showcase.value = res.payload || null
}

onMounted(() => detect())

onUnmounted(() => {
  clearTimeout(timer.value)
  timer.value = 0
})
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <Logo />

    {{ showcase }}
  </main>
</template>
