<template>
  <component
    :is="tag"
    class="w-full sm:w-1/2 md:w-1/3 max-w-sm m-auto sm:m-0"
  >
    <div class="relative w-full h-full pt-0">
      <div
        :class="[tag === 'a' && 'hover:bg-grey-100']"
        class="flex flex-col items-center justify-between bg-grey-50 rounded-xl pb-2 pr-2 w-full h-full border-2 border-grey-200"
      >
        <div
          style="
            border-radius: 0.75rem;
            border-bottom-left-radius: 0;
            border-top-right-radius: 0;
          "
          class="self-start bg-grey-200 px-3 rounded-xl rounded-bl-none rounded-tr-none text-xs tracking-4 uppercase leading-sm font-bold-body-weight mb-2"
        >
          {{ label }}
        </div>
        <div class="flex items-center">
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
    tag: {
      type: String,
      default: 'div'
    }
  }
}
</script>

<style></style>
