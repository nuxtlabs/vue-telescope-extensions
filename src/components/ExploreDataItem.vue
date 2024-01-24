<script setup lang="ts">
defineProps({
  label: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  url: {
    type: String,
    default: '',
  },
  infos: {
    type: Boolean,
    default: false,
  },
})

const iconURL = (path: string) => {
  return `https://icons.vuetelescope.com${path}`
}
</script>

<template>
  <Component
    :is="url ? 'a' : 'div'" class="rounded-lg border border-gray-700 text-white font-semibold text-sm space-x-2"
    :class="[url && 'hover:bg-gray-800 hover:border-green-400 transition-hover duration-200',
             infos && 'p-3 flex space-x-2 items-center w-[160px] card']" :href="url" target="_blank"
  >
    <img v-if="icon" :src="iconURL(icon)" class="h-6 w-6" width="24px" height="24px">
    <span>{{ label }}</span>
  </Component>
</template>

<style scoped lang="postcss">
.card {
    background: linear-gradient(0deg, rgba(2, 4, 32, 0.60) 0%, rgba(2, 4, 32, 0.60) 100%), linear-gradient(180deg, #1E293B 0%, #0F172A 33.92%);
}
</style>
