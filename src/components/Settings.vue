<template>
<div class="relative" v-click-outside="hideList">
    <AppButton size="small" appearance="primary" outlined @click.native="isListVisible = !isListVisible">
        Settings
    </AppButton>
    <ul v-if="isListVisible" class="absolute translate-y-full border-2 border-grey-200 rounded-md mt-1 min-w-full px-2 right-0">
        <li class="whitespace-no-wrap py-1">
            <button @click="toggleIconState" class="whitespace-no-wrap outline-none flex flex-row items-center focus:outline-none">
                <CheckboxSelectedIcon v-if="useFrameworkIcon" class="mr-2 w-5 h-5"/>
                <CheckboxIcon v-else class="mr-2 w-5 h-5"/>
                use framework logo
            </button>
        </li>
    </ul>
</div>
</template>
<script>
import AppButton from './AppButton.vue'
import SettingsController from '../shared/LocalSettingsController'
import CheckboxIcon from '../images/checkbox.svg?inline'
import CheckboxSelectedIcon from '../images/checkbox-selected.svg?inline'

const settingsCache = new SettingsController()
export default {
  components: {
    AppButton,
    CheckboxIcon,
    CheckboxSelectedIcon
  },
  data () {
    return {
      useFrameworkIcon: false,
      isListVisible: false
    }
  },
  async mounted () {
    const { useFrameworkIcon } = await settingsCache.get()
    this.useFrameworkIcon = useFrameworkIcon
  },
  methods: {
    async toggleIconState () {
      this.useFrameworkIcon = !this.useFrameworkIcon
      const cache = await settingsCache.get()
      settingsCache.set({ ...cache, useFrameworkIcon: this.useFrameworkIcon })
    },
    async hideList (e) {
      this.isListVisible = false
    }
  }
}
</script>
