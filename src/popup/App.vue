<template>
  <div
    class="bg"
    v-bind:id="[getPageState() == 'error' ? 'bg__error' : getPageState() == 'data' ? 'bg__data' : 'bg__novue']"
  >
    <header class="header">
      <button
        v-on:click="switchTheme(theme)"
        class="header__button theme"
        v-bind:id="[(theme === 'system' || theme === null) ? 'system' : 'dark-mode']"
      ></button>
      <button v-on:click="closePopup()" class="header__button close"></button>
    </header>
    <div class="container">
      <div class="data-container">
        <lottie-player
          class="loader"
          v-if="isLoading"
          :src="loader"
          loop
          autoplay
          style="width: 60px; height: 60px;"
        ></lottie-player>
        <div v-else-if="(getPageState() == 'data')" class="info">
          <div
            class="info__item"
            v-for="(category, index) in Object.keys(dataInfo[currentDomain])"
            :key="`category-${index}`"
          >
            {{ setCategoryTitle(category) }}
            <div class="item__detail" v-if="Array.isArray(dataInfo[currentDomain][category])">
              <div
                v-for="(item, index) in dataInfo[currentDomain][category]"
                :key="`item-${index}`"
              >
                <div class="detail__array__item">{{ item }}</div>
              </div>
            </div>
            <div class="item__detail" v-else>
              <div v-if="category == 'hasSSR'">SSR</div>
              <div v-else-if="category == 'isStatic'">Satic</div>
              <div v-else>{{ dataInfo[currentDomain][category] }}</div>
            </div>
          </div>
        </div>
        <div v-else-if="getPageState() == 'error'" class="error">
          <h1>Oops !</h1>
          <h3>Vue detected but we can't analyze the page you're looking for.</h3>
        </div>
        <div v-else class="error">
          <h1>Ooh !</h1>
          <h3>This site doesn't use the technologies analysed by Vue telemetry.</h3>
        </div>
      </div>
      <div class="button-container">
        <button
          class="submit"
          v-bind:id="[(getPageState() == 'noVue') ? 'submit-no-vue' : '']"
        >Submit a webiste</button>
        <button class="github" v-bind:id="[(getPageState() == 'noVue') ? 'github-no-vue' : '']"></button>
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
      theme: localStorage.getItem("theme"),
      loader: browser.runtime.getURL("../images/loader.json")
    };
  },
  mounted: function() {
    const currentTheme =
      localStorage.getItem("theme") == null
        ? "system"
        : localStorage.getItem("theme");

    const dataTheme =
      currentTheme === "system"
        ? window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : currentTheme;

    this.theme = currentTheme;

    document.documentElement.setAttribute("data-theme", dataTheme);
    localStorage.setItem("theme", currentTheme);

    this.setColorSchemeSystem();
  },
  computed: {
    ...mapState(["dataInfo", "isLoading", "currentDomain"])
  },
  methods: {
    setColorSchemeSystem() {
      window.matchMedia("(prefers-color-scheme: dark)").addListener(e => {
        if (e.matches && this.theme == "system")
          document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "system");
      });
      window.matchMedia("(prefers-color-scheme: light)").addListener(e => {
        if (e.matches && this.theme == "system")
          document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "system");
      });
    },
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
    switchTheme() {
      let dataTheme;

      if (this.theme === "light") {
        dataTheme = "dark";
        this.theme = "dark";
      } else if (this.theme === "dark") {
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? (dataTheme = "dark")
          : (dataTheme = "light");
        this.theme = "system";
      } else if (this.theme === "system") {
        dataTheme = "light";
        this.theme = "light";
      }
      document.documentElement.setAttribute("data-theme", dataTheme);
      localStorage.setItem("theme", this.theme);
    }
  }
};
</script>
<style>
/* mode */
:root {
  /* light */
  --bg-image: url("../images/bg-light.svg");
  --button-submit-bg-color: #158876;
  --button-submit-bg-color-no-vue: #414042;
  --button-submit-bg-color-hover: #099580;
  --button-github-bg-image: url("../images/img-github-light.svg");
  --button-github-bg-color: #243746;
  --button-github-bg-color-hover: #586976;
  --button-theme-img: url("../images/img-theme-dark.svg");
  --bg-error-image: url("../images/bg-error-light.svg");
  --bg-no-vue-image: url("../images/bg-no-vue-light.svg");
}
/* dark */
[data-theme="dark"] {
  --bg-image: url("../images/bg-dark.svg");
  --button-submit-bg-color-no-vue: #292728;
  --button-submit-bg-color: #41b38a;
  --button-submit-bg-color-hover: #2fc68f;
  --button-github-bg-image: url("../images/img-github-dark.svg");
  --button-github-bg-color: #fff;
  --button-github-bg-color-hover: #e5e5e5;
  --button-theme-img: url("../images/img-theme-light.svg");
  --bg-error-image: url("../images/bg-error-dark.svg");
  --bg-no-vue-image: url("../images/bg-no-vue-dark.svg");
}

@import url(https://fonts.googleapis.com/css?family=Inter);
body {
  direction: ltr;
  font-family: Inter;
  font-size: 0.8rem;
  margin: 0;
  width: 100%;
  height: 100%;
}

.bg {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

#bg__error {
  background-image: var(--bg-error-image);
}

#bg__data {
  background-image: var(--bg-image);
}

#bg__novue {
  background-image: var(--bg-no-vue-image);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  display: flex;
  width: 100%;
  align-self: flex-start;
  background: url("../images/img-logo.svg") no-repeat;
  background-position-x: 32px;
  background-position-y: 38px;
  background-size: 150px;
}

.header__button {
  display: flex;
  width: 31px;
  height: 31px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  border: none;
}

.close {
  margin-top: 23px;
  margin-right: 25px;
  background: rgba(255, 255, 255, 0.21) no-repeat;
  background-image: url("../images/img-button-close.svg");
  background-position: center;
  background-size: 10px;
}

.theme {
  margin-top: 26px;
  background: rgba(255, 255, 255, 0.21) no-repeat;
  margin-left: 196px;
}

#system {
  background-position: center;
  background-size: 20px;
  background-image: url("../images/img-theme-system.svg");
}

#dark-mode {
  background-position: center;
  background-image: var(--button-theme-img);
}

.container {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.data-container {
  display: flex;
  align-items: center;
  width: 334px;
  height: 301px;
  margin-left: 32px;
  margin-bottom: 32px;
  margin-right: 23px;
  margin-top: 3px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.21);
}

.loader {
  display: block;
  align-self: center;
  margin-left: auto;
  margin-right: auto;
}

.info {
  display: flex;
  justify-content: space-around;
  flex-flow: column wrap;
  width: 400px;
  height: 300px;
  min-width: 300px;
  max-height: 400px;
  box-sizing: border-box;
  padding: 15px;
}

.info__item {
  box-sizing: border-box;
  margin: 10px;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  text-transform: capitalize;
}

.item__detail {
  color: #fff;
  font-weight: lighter;
  margin-top: 0.5rem;
  font-size: 12px;
  padding-right: 10px;
}

.item__detail__array {
  margin-top: 5px;
}

.error {
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-left: 2rem;
  margin-right: 2rem;
  padding: 0px;
  color: #fff;
  text-align: left;
  width: 100%;
  align-items: left;
}

h1 {
  font-weight: bold;
  font-size: 3rem;
  line-height: 1.7rem;
}

h3 {
  font-weight: normal;
}

.button-container {
  display: flex;
  align-self: flex-end;
  justify-content: flex-end;
  margin-bottom: 32px;
}

.submit {
  background: var(--button-submit-bg-color);
  transition-duration: 0.5s;
  margin-right: 7px;
  width: 129px;
  height: 43px;
  border: none;
  border-radius: 8px;
  color: #fff;
}

#submit-no-vue {
  background: var(--button-submit-bg-color-no-vue);
}

.github {
  width: 43px;
  height: 43px;
  margin-right: 32px;
  background: var(--button-github-bg-image) no-repeat;
  background-color: var(--button-github-bg-color);
  transition-duration: 0.5s;
  border-radius: 8px;
  border: none;
  background-size: auto;
  background-position: center;
}

#github-no-vue {
  background: url("../images/img-github-light.svg") no-repeat;
  background-color: #6d6e71;
  background-position: center;
}

.button-container__github:hover {
  background-color: var(--button-github-bg-color-hover);
}
</style>
