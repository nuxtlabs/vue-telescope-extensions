<template>
  <div
    class="extension" 
    :class="[getPageState() === 'error' ? 'bg-error' : getPageState() === 'data' ? 'bg' : 'bg-no-vue']"
  >   
    <div class="h-16 flex justify-between">
      <div class="m-8">
        <svg width="156" height="16" class="mt-2"><path d="M14.395.378L7.24 16h-.114L0 .378h3.255l3.92 8.85 3.927-8.85h3.293zM15.79 9.986V.378h3.094v9.598c0 1.664 1.32 2.875 2.799 2.875 1.478 0 2.817-1.22 2.817-2.875V.378h3.094v9.608c0 3.452-2.647 5.967-5.902 5.967-3.255 0-5.901-2.513-5.901-5.967zM33.192 3.395v2.979h5.276v3.054h-5.276v3.15h6.148v3.044h-9.222V.378h9.222v3.017h-6.148zM56.97 3.415H53.21v12.21h-3.084V3.414h-3.766V.38H56.97v3.035zM61.771 3.395v2.979h5.276v3.054H61.77v3.15h6.148v3.044h-9.222V.378h9.222v3.017h-6.148zM79.4 12.578v3.044h-9.223V.378h3.075v12.2H79.4zM84.202 3.395v2.979h5.276v3.054h-5.276v3.15h6.148v3.044h-9.222V.378h9.222v3.017h-6.148zM107.591 0v15.622h-3.075V8.983l-4.403 6.384h-.019l-4.413-6.384v6.64h-3.075V0h.171l7.326 10.071L107.42 0h.171zM113.321 3.395v2.979h5.276v3.054h-5.276v3.15h6.148v3.044h-9.222V.378h9.222v3.017h-6.148zM131.407 3.415h-3.759v12.21h-3.083V3.414h-3.766V.38h10.608v3.035zM141.084 15.624l-4.868-7.207v7.207h-3.074L133.132.38h4.99c2.857 0 5.2 2.194 5.2 4.937 0 1.958-1.185 3.67-2.827 4.245l4.345 6.062h-3.756zm-4.876-8.38l1.975.01c1.043.01 1.974-.833 1.974-1.92s-.939-1.92-1.974-1.92h-1.975v3.83zM148.2 9.08l-4.736-8.7h3.473l2.79 5.295L152.518.38H156l-4.743 8.7v6.544h-3.055V9.08h-.002z" fill="#fff"/></svg>
      </div>
      <button v-on:click="closePopup()" class="flex justify-center bg-container rounded-md p-1 w-8 h-8 m-6">
        <svg viewBox="0 0 329.269 329" width="15" height="15" class="fill-white"><defs/><path d="M194.8 164.77L323.013 36.555c8.343-8.34 8.343-21.825 0-30.164-8.34-8.34-21.825-8.34-30.164 0L164.633 134.605 36.422 6.391c-8.344-8.34-21.824-8.34-30.164 0-8.344 8.34-8.344 21.824 0 30.164l128.21 128.215L6.259 292.984c-8.344 8.34-8.344 21.825 0 30.164a21.266 21.266 0 0015.082 6.25c5.46 0 10.922-2.09 15.082-6.25l128.21-128.214 128.216 128.214a21.273 21.273 0 0015.082 6.25c5.46 0 10.922-2.09 15.082-6.25 8.343-8.34 8.343-21.824 0-30.164zm0 0"/></svg>
      </button>
    </div>
    <div class="flex">
      <div class="container flex bg-container border-transparent items-center justify-center rounded-lg ml-8 p-4">
        <lottie-player
        class="container self-center"
        v-if="isLoading"
          :src="loader"
          loop
          autoplay
          style="width: 60px; height: 60px;"
        ></lottie-player>
        <div v-else-if="getPageState() === 'data'" class="h-full w-full overflow-y-scroll text-white">
      <div class="h-full rounded bg-gray-50">
        <pre> dataInfo[currentDomain] </pre>
        <!-- <div class="p-4 text-sm h-72">
          <div class="mb-4">
            <p class="font-semibold mb-3">Mode</p>
            <div class="">{{ dataInfo[currentDomain].hasSSR ? 'SSR' : 'SPA' }}</div>
          </div>
          <div class="mb-4">
            <p class="font-semibold mb-3">Target</p>
            <div class="capitalize">
              {{ dataInfo[currentDomain].isStatic ? 'static' : 'dynamic' }}
            </div>
          </div>
          <div v-if="dataInfo[currentDomain].vueVersion" class="mb-4">
            <p class="font-semibold mb-3">Vue version</p>
            <div class="capitalize">{{ dataInfo[currentDomain].vueVersion }}</div>
          </div>
          <div v-if="dataInfo[currentDomain].frameworkModules" class="mb-4">
            <p class="font-semibold mb-3">Framework</p>
            <div class="capitalize">{{ dataInfo[currentDomain].framework.name }}</div>
          </div>
          <div v-if="dataInfo[currentDomain].ui" class="mb-4">
            <p class="font-semibold mb-3">UI</p>
            <div class="capitalize">{{ dataInfo[currentDomain].ui }}</div>
          </div>
          <div v-if="dataInfo[currentDomain].plugins.length" class="mb-4">
            <p class="font-semibold mb-3">Plugins</p>
            <div class="flex flex-row items-center flex-wrap">
              <span
                v-for="(sp, i) in dataInfo[currentDomain].plugins"
                :key="i"
                class="px-2 py-1 bg-green-light rounded mr-2 last:mr-0 mb-2"
              >
                {{ sp }}
              </span>
            </div>
          </div>
          <div v-if="dataInfo[currentDomain].frameworkModules.length" class="mb-4">
            <p class="font-semibold mb-3">Modules</p>
            <div class="flex flex-row items-center flex-wrap">
              <span
                v-for="(sm, i) in dataInfo[currentDomain].frameworkModules"
                :key="i"
                class="bg-green-light px-2 py-1 rounded mr-2 last:mr-0 mb-2"
              >
                {{ sm }}
              </span>
            </div>
          </div>
        </div> -->
      </div>
    </div>
        <!-- <div v-else-if="getPageState() === 'data'" class="grid grid-cols-2 h-full w-full overflow-y-scroll">
          <div
            class="m-2 text-white font-bold"
            v-for="(category, index) in Object.keys(dataInfo[currentDomain])"
            :key="`category-${index}`"
          >
          {{ setCategoryTitle(category) }}
            <div class="font-normal" v-if="Array.isArray(dataInfo[currentDomain][category])">
              <div
                v-for="(item, index) in dataInfo[currentDomain][category]"
                :key="`item-${index}`"
              >
                <div>{{ item }}</div>
              </div>
            </div>
            <div v-else class="font-normal">
              <div v-if="category == 'hasSSR'">SSR</div>
              <div v-else-if="category == 'isStatic'">Satic</div>
              <div v-else>{{ dataInfo[currentDomain][category] }}</div>
            </div>
          </div>
        </div> -->
        <div v-else-if="getPageState() === 'error'" class="text-white p-4 self-center">
          <div class="font-bold text-5xl">Oops !</div>
          <div class="text-base">Vue detected but we can't analyze the page you're looking for.</div>
        </div>
        <div v-else class="light:text-no-vue-title-light dark:text-no-vue-title-dark p-4 self-center">
          <div class="font-bold text-5xl">Ooh !</div>
          <div class="text-base light:text-no-vue-light dark:text-no-vue-dark">This site doesn't use the technologies analysed by Vue telemetry.</div>
        </div>
      </div>
      <div class="flex h-12 w-56 self-end mx-6">
      <button class="h-full w-4/6 rounded-md text-white" 
      :class="[(getPageState() !== 'error' && getPageState() !== 'data') ? 'light:bg-black-light dark:bg-black-dark' : 'light:bg-green-dark dark:bg-green-light']">
         Submit a website
       </button>
      <button class="h-full w-12 flex justify-center items-center rounded-md ml-2"
        :class="[(getPageState() !== 'error' && getPageState() !== 'data') ? 'bg-gray' : 'light:bg-blue-dark dark:bg-white']" > 
        <svg 
        :class="[(getPageState() !== 'error' && getPageState() !== 'data') ? 'fill-white' : 'light:fill-white dark:fill-blue-dark']" 
        viewBox="0 0 21 23" width="21" height="23"><defs/><path d="M15.044 21.966v-4.048c0-1.241-.346-2.15-1.034-2.724a14.555 14.555 0 002.042-.345 8.405 8.405 0 001.873-.749 5.529 5.529 0 001.613-1.275c.43-.507.782-1.176 1.054-2.016.272-.837.408-1.8.408-2.887 0-1.548-.526-2.867-1.575-3.954.49-1.165.438-2.469-.16-3.915-.371-.114-.91-.045-1.612.21-.703.257-1.315.539-1.832.846l-.756.462a14.608 14.608 0 00-3.823-.499c-1.315 0-2.588.166-3.823.499-.213-.14-.493-.314-.845-.518-.351-.205-.907-.45-1.663-.74-.756-.288-1.327-.374-1.714-.26-.585 1.446-.629 2.75-.139 3.915C2.01 5.055 1.484 6.374 1.484 7.922c0 1.088.136 2.047.408 2.879.271.83.62 1.503 1.045 2.015.426.513.96.94 1.605 1.287a8.343 8.343 0 001.873.749c.605.154 1.285.268 2.041.344-.532.462-.857 1.12-.975 1.976a3.99 3.99 0 01-.895.288 5.94 5.94 0 01-1.135.096c-.437 0-.871-.136-1.302-.412-.432-.276-.801-.675-1.105-1.199a3.086 3.086 0 00-.966-.996c-.393-.256-.721-.41-.987-.461l-.399-.057c-.278 0-.47.028-.576.085-.106.057-.139.13-.1.222.038.088.1.18.18.268.08.088.165.168.26.23l.139.097c.292.128.582.37.865.729.287.359.494.683.627.98l.197.44c.172.487.464.88.878 1.18.41.301.857.492 1.335.574.479.083.94.128 1.383.134.446.006.812-.014 1.105-.068l.458-.077c0 .487.003 1.056.009 1.708l.008 1.036c0 .2-.068.37-.198.51a15.517 15.517 0 007.977-.003.727.727 0 01-.195-.51z"/></svg>
      </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import "@lottiefiles/lottie-player";
let browser = require("webextension-polyfill");

export default {
  data: function() {
    return {
      loader: browser.runtime.getURL("../images/loader.json"),
    };
  },
  computed: {
    ...mapState(["dataInfo", "isLoading", "currentDomain"])
  },
  methods: {
    getPageState() {
      if (
        this.dataInfo[this.currentDomain] != null &&
        this.dataInfo[this.currentDomain] == "error"
      ) {
        return "error";
      } else if (
        this.dataInfo[this.currentDomain] != null &&
        this.dataInfo[this.currentDomain] != "noVue"
      ) {
        return "data";
      }
      return "noVue";
    },
    closePopup() {
      window.close();
    },
    setCategoryTitle(jsonKey) {
      return jsonKey == "hasSSR"
        ? "Mode"
        : jsonKey == "isStatic"
        ? "Target"
        : jsonKey == "vueVersion"
        ? "Vue version"
        : jsonKey == "ui"
        ? "UI"
        : jsonKey == "frameworkModules"
        ? "Modules"
        : jsonKey;
    },
  }
};
</script>