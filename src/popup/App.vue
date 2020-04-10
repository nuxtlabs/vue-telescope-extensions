<template>
  <div>
    <!--pre>{{ data.get(currentDomain) }}}</pre-->
    <header class="header">
      <a href="https://www.nuxtjs.org/" target="_blank">
        <img class="header__logo" :src="img" />
      </a>
      <!-- <div>
        <button class v-on:click="switchTheme(themeDark)">
          <img v-if="themeDark" :src="moon" height="20px" />
          <img v-else :src="sun" height="20px" />
        </button>
      </div>-->
      <lottie-player
        class="header__close"
        v-on:click="close"
        :src="closeButton"
        background="transparent"
        speed="5"
        style="width: 30px; height: 30px;"
        co
        hover
      ></lottie-player>
    </header>
    <div>
      <lottie-player
        class="loader"
        v-if="isLoading"
        :src="loader"
        loop
        autoplay
        style="width: 60px; height: 60px;"
      ></lottie-player>
      <div v-else-if="currentDomain != 'noVue' && currentDomain != 'WSError'" class="flexcontainer">
        <div
          class="flex-item"
          v-for="(category, index) in Object.keys(data.get(currentDomain))"
          :key="`category-${index}`"
        >
          {{ setCategoryTitle(category) }}
          <div class="flex-item__detail" v-if="isArray(data.get(currentDomain)[category])">
            <div v-for="(item, index) in data.get(currentDomain)[category]" :key="`item-${index}`">
              <div class="flex-item__detail__array-item">{{ item }}</div>
            </div>
          </div>
          <div class="flex-item__detail" v-else>
            <div v-if="category == 'hasSSR' || category=='isStatic'">
              <img class="img" :src="getImgSSRorStatic(Boolean(data.get(currentDomain)[category]))" />
            </div>
            <div v-else>{{ data.get(currentDomain)[category] }}</div>
          </div>
        </div>
      </div>
      <div v-else-if="currentDomain=='WSError'">
        <lottie-player
          class="loader"
          :src="broken"
          loop
          autoplay
          style="width: 100px; height: 100px;"
        ></lottie-player>
        <div class="error">Vue detect but an error occured</div>
      </div>
      <div v-else class="error">Vue not detected</div>
    </div>
    <footer>
      <ul class="footer__item">
        <li>
          <a href class>Soumettre une URL</a>
        </li>
        <li>
          <a href="https://nuxtjs.org">
            <lottie-player :src="github" loop autoplay style="width: 20px; height: 20px;"></lottie-player>
          </a>
        </li>
      </ul>
    </footer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import "@lottiefiles/lottie-player";

export default {
  data: function() {
    return {
      themeDark: false,
      img: browser.runtime.getURL("../images/vue_telemetry_logo.png"),
      closeButton: browser.runtime.getURL("../images/close-button.json"),
      loader: browser.runtime.getURL("../images/loader.json"),
      check: browser.runtime.getURL("../images/check.png"),
      broken: browser.runtime.getURL("../images/broken.json"),
      github: browser.runtime.getURL("../images/github.json"),
      sun: browser.runtime.getURL("../icons/brightness.png"),
      moon: browser.runtime.getURL("../icons/moon.png")
    };
  },
  // updated: function() {
  //   const currentTheme = localStorage.getItem("theme");

  //   if (currentTheme) {
  //     document.documentElement.setAttribute("data-theme", currentTheme);

  //     if (currentTheme === "dark") {
  //       this.$data.themeDark = true;
  //     }
  //   }
  // },
  computed: {
    ...mapState(["data", "isLoading", "currentDomain"])
  },
  methods: {
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
        ? "SSR"
        : jsonKey == "isStatic"
        ? "Static"
        : jsonKey == "vueVersion"
        ? "Vue version"
        : jsonKey == "ui"
        ? "UI"
        : jsonKey == "frameworkModules"
        ? "Modules"
        : jsonKey;
    }
    // switchTheme(theme) {
    //   this.$data.themeDark = !theme;
    //   if (!theme) {
    //     document.documentElement.setAttribute("data-theme", "dark");
    //     localStorage.setItem("theme", "dark");
    //   } else {
    //     document.documentElement.setAttribute("data-theme", "light");
    //     localStorage.setItem("theme", "light");
    //   }
    // }
  }
};
</script>
<style>
:root {
  --bg-color: #f9fafc;
}

[data-theme="dark"] {
  --bg-color: #161625;
}

@import url(https://fonts.googleapis.com/css?family=Quicksand);
body {
  background-color: var(--bg-color);
  direction: ltr;
  font-family: Quicksand;
  font-size: 0.8rem;
  margin: 0;
  min-width: 300px;
  min-height: 50px;
  height: 100%;
}

.header {
  align-items: center;
  height: 4rem;
  display: flex;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.101562);
  background-color: #fff;
}

.header__close {
  align-self: flex-start;
  margin-left: auto;
  margin-right: 0.5rem;
  margin-top: 0.5rem;
}

.header__logo {
  display: inline-block;
  margin: 1rem 1.5rem 1rem 1.5rem;
  height: 2.5rem;
}

.error {
  display: block;
  align-self: center;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  font-weight: bold;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.flexcontainer {
  display: flex;
  flex-flow: column wrap;
  width: 400px;
  height: 100%;
  min-width: 300px;
  max-height: 400px;
  box-sizing: content-box;
}

.flex-item {
  box-sizing: border-box;
  margin: 20px;
  color: #41b38a;
  font-weight: bold;
  text-transform: capitalize;
}

.flex-item__detail {
  color: #243746;
  font-weight: lighter;
  margin-top: 1rem;
}

.flex-item__detail__array-item {
  margin-top: 5px;
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

footer {
  height: 35px;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.101562);
}

.footer__item {
  height: 35px;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  margin: 0px;
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
