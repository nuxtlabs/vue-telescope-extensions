<template>
  <div class="bg">
    <div
      v-bind:class="[getPageState() == 'error' ? 'bg__error' : getPageState() == 'data' ? 'bg__data' : 'bg__novue']"
    >
      <header class="header">
        <div class="header__title">
          <div class="header__title-logo"></div>
          <button v-on:click="switchTheme(theme)" class="header__title-theme"></button>
        </div>
        <button v-on:click="close()" class="button-close"></button>
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
          <div v-else-if="(getPageState() == 'data')">
            <div class="flexcontainer">
              <div
                class="flex-item"
                v-for="(category, index) in Object.keys(dataInfo[currentDomain])"
                :key="`category-${index}`"
              >
                {{ setCategoryTitle(category) }}
                <div class="flex-item__detail" v-if="isArray(dataInfo[currentDomain][category])">
                  <div
                    v-for="(item, index) in dataInfo[currentDomain][category]"
                    :key="`item-${index}`"
                  >
                    <div class="flex-item__detail__array-item">{{ item }}</div>
                  </div>
                </div>
                <div class="flex-item__detail" v-else>
                  <div v-if="category == 'hasSSR'">SSR</div>
                  <div v-else-if="category == 'isStatic'">Satic</div>
                  <div v-else>{{ dataInfo[currentDomain][category] }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="getPageState() == 'error'" class="error">
            <div>Vue detected but an error occured</div>
          </div>
          <div v-else class="error">Vue not detected</div>
        </div>
        <div class="button-container">
          <button
            v-bind:class="[getPageState() == 'error'? 'button-container__submit' : getPageState() == 'data' ? 'button-container__submit' : 'button-container__submit']"
            v-bind:id="[(getPageState() == 'noVue') ? 'submit-no-vue' : '']"
          >Submit a webiste</button>
          <button
            class="button-container__github"
            v-bind:id="[(getPageState() == 'noVue') ? 'github-no-vue' : '']"
          ></button>
        </div>
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
      theme: "system",
      img: browser.runtime.getURL("../images/vue_telemetry_logo.png"),
      closeButton: browser.runtime.getURL("../images/button-close.svg"),
      loader: browser.runtime.getURL("../images/loader.json"),
      check: browser.runtime.getURL("../images/check.png"),
      broken: browser.runtime.getURL("../images/broken.json"),
      github: browser.runtime.getURL("../images/github-img.svg"),
      error: browser.runtime.getURL("../images/error404.svg"),
      sun: browser.runtime.getURL("../icons/brightness.png"),
      moon: browser.runtime.getURL("../icons/moon.png")
    };
  },
  updated: function() {
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme) {
      document.documentElement.setAttribute("data-theme", currentTheme);

      currentTheme === "dark"
        ? (this.$data.theme = "dark")
        : currentTheme === "light"
        ? (this.$data.theme = "light")
        : (this.$data.theme = "system");
    }
  },
  computed: {
    ...mapState(["dataInfo", "isLoading", "currentDomain"])
  },
  methods: {
    getPageState() {
      /*if (this.dataInfo[this.currentDomain] != null) {
        if (this.dataInfo[this.currentDomain] == "error") {
          return "error"
        } else if (this.dataInfo[this.currentDomain] != "noVue") {
          return "noVue"
        }
      } 
      return "noVue"*/

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
    isArray(obj) {
      return Array.isArray(obj);
    },
    close() {
      window.close();
    },
    getImgSSRorStatic(value) {
      // `this` points to the vm instance
      return (this.$data.check = value
        ? browser.runtime.getURL("../images/check.png")
        : browser.runtime.getURL("../images/close.png"));
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
    switchTheme(theme) {
      if (theme === "light") {
        this.$data.theme = "dark";
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else if (theme === "dark") {
        this.$data.theme = "light";
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      } else {
        if (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          this.$data.theme = "dark";
          document.documentElement.setAttribute("data-theme", "dark");
          localStorage.setItem("theme", "system");
        } else {
          this.$data.theme = "light";
          document.documentElement.setAttribute("data-theme", "light");
          localStorage.setItem("theme", "system");
        }
      }
    }
  }
};
</script>
<style>
:root {
  --bg-image: url("../images/extension-bg-light.svg");
  --button-submit-bg-color: #158876;
  --button-submit-bg-color-no-vue: #414042;
  --button-submit-bg-color-hover: #099580;
  --button-github-bg-image: url("../images/github-light.svg");
  --button-github-bg-color: #243746;
  --button-github-bg-color-hover: #586976;
  --button-theme-img: url("../images/button-theme-dark.svg");
  --bg-error-image: url("../images/extension-bg-error-light.svg");
  --bg-no-vue-image: url("../images/extension-bg-no-vue-light.svg");
}

[data-theme="dark"] {
  --bg-image: url("../images/extension-bg-dark.svg");
  --button-submit-bg-color-no-vue: #292728;
  --button-submit-bg-color: #41b38a;
  --button-submit-bg-color-hover: #2fc68f;
  --button-github-bg-image: url("../images/github-dark.svg");
  --button-github-bg-color: #fff;
  --button-github-bg-color-hover: #e5e5e5;
  --button-theme-img: url("../images/button-theme-light.svg");
  --bg-error-image: url("../images/extension-bg-error-dark.svg");
  --bg-no-vue-image: url("../images/extension-bg-no-vue-dark.svg");
}

@import url(https://fonts.googleapis.com/css?family=Quicksand);
body {
  direction: ltr;
  font-family: Quicksand;
  font-size: 0.8rem;
  margin: 0;
  width: 100%;
  height: 100%;
}

.bg__error {
  background-image: var(--bg-error-image);
}

.bg__data {
  background-image: var(--bg-image);
}

.bg__novue {
  background-image: var(--bg-no-vue-image);
}

.bg {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  display: flex;
  width: 100%;
  align-self: flex-start;
}

.header__title {
  display: flex;
}

.header__title-logo {
  width: 156px;
  height: 16px;
  margin-left: 33px;
  margin-top: 35px;
  margin-bottom: 16px;
  background-image: url("../images/title-logo.svg");
  color: #fff;
}

.button-close {
  display: flex;
  width: 31px;
  height: 31px;
  margin-top: 23px;
  margin-right: 25px;
  background: rgba(255, 255, 255, 0.21) no-repeat;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  background-image: url("../images/button-close.svg");
  background-position: center;
  background-size: 10px;
  border: none;
}

.button-close:hover {
  color: #549c82;
}

.header__title-theme {
  display: flex;
  transition-duration: 0.1s;
  width: 31px;
  height: 31px;
  margin-top: 28px;
  margin-left: 8px;
  background: rgba(255, 255, 255, 0.21) no-repeat;
  background-position: center;
  background-image: var(--button-theme-img);
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  border: none;
}

.header__logo {
  display: inline-block;
  margin: 1rem 1.5rem 1rem 1.5rem;
  height: 2.5rem;
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

.error {
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 0px;
  color: #fff;
  text-align: center;
  width: 100%;
}

.flexcontainer {
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

.flex-item {
  box-sizing: border-box;
  margin: 10px;
  color: #fff;
  font-weight: bold;
  font-size: 14px;
  text-transform: capitalize;
}

.flex-item__detail {
  color: #fff;
  font-weight: lighter;
  margin-top: 0.5rem;
  font-size: 12px;
  padding-right: 10px;
}

.flex-item__detail__array-item {
  margin-top: 5px;
}

.button-container {
  display: flex;
  align-self: flex-end;
  justify-content: flex-end;
  margin-bottom: 32px;
}

.button-container__submit {
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

.button-container__submit:hover {
  background-color: var(--button-submit-bg-color-hover);
  color: white;
}

.button-container__github {
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
  background: url("../images/github-light.svg") no-repeat;
  background-color: #6d6e71;
  background-position: center;
}

.button-container__github:hover {
  background-color: var(--button-github-bg-color-hover);
}

.img {
  height: 13px;
  width: 13px;
}

.loader {
  display: block;
  align-self: center;
  margin-left: auto;
  margin-right: auto;
}

.shadow-nuxt {
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.101562);
  height: 50px;
}

.bg-light-elevatedSurface {
  background-color: #fff;
}

.footer {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  height: 100px;
  width: 100%;
  background-color: transparent;
  align-items: center;
  text-align: left;
  text-justify: initial;
}

.footer-github {
  width: 130px;
  margin: 0px;
  display: flex;
  flex-flow: row;
  margin-top: 2.2rem;
  margin-right: 5.2rem;
}

.footer-text {
  margin-left: 5px;
  font-size: 8px;
  color: #000;
  align-self: center;
}

ul {
  list-style: none;
}

li {
  margin-left: -0.25in;
  margin-right: 0.1in;
}

a:hover {
  color: #158876;
}

a {
  font-size: 10px;
  color: grey;
  font-weight: bold;
  text-decoration: none;
}

/* .duration-300 {
  transition-duration: 0.3s;
}
.ease-linear {
  transition-timing-function: linear;
}
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
}
.text-light-onSurfacePrimary {
  color: #2f495e;
}
.relative {
  position: relative;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.overflow-hidden {
  overflow: hidden;
}
.focus\:outline-none:focus,
.outline-none {
  outline: 0;
}
.h-10 {
  height: 2.5rem;
}
.items-center {
  align-items: center;
}
.flex {
  display: flex;
}
.rounded-full {
  border-radius: 9999px;
}
.bg-gray-200 {
  background-color: #edf2f7;
}
button,
input,
optgroup,
select,
textarea {
  padding: 0;
  line-height: inherit;
  color: inherit;
}
[role="button"],
button {
  cursor: pointer;
}
button {
  background-color: transparent;
  background-image: none;
  align-self: flex-start;
  margin-left: auto;
  margin-right: 0.5rem;
}
[type="button"],
[type="reset"],
[type="submit"],
button {
  -webkit-appearance: button;
}
button,
select {
  text-transform: none;
}
button,
input {
  overflow: visible;
}
button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
}
*,
:after,
:before {
  box-sizing: border-box;
  border: 0 solid #e2e8f0;
} */
</style>

<style>
</style>
