<template>
  <component :is="href ? 'a' : 'div'" :href="href" target="_blank" class="flex items-center">
    <div class="relative w-full h-full">
      <div
        class="flex flex-col items-center justify-between bg-grey-50 rounded-xl border-2 border-grey-200"
      >
        <div
          style="
            border-radius: 0.75rem;
            border-bottom-left-radius: 0;
            border-top-right-radius: 0;
          "
          class="self-start bg-grey-200 px-3 rounded-xl rounded-bl-none rounded-tr-none text-xs uppercase leading-4 font-medium mb-2"
        >{{ label }}</div>
        <div class="flex items-center mb-2">
          <slot />
        </div>
      </div>
    </div>
  </component>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    href: {
      type: String,
      default: null
    }
  }
}
</script>

<style></style>
