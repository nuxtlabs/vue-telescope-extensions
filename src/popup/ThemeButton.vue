<template>
  <button
    :title="theme == 'dark' ? 'Dark Theme' : 'Light Theme'"
    @click="toggleTheme()"
    class="theme"
  >
    <Moon :is="theme == 'dark' ? 'Moon' : 'Sun'" height="20px" />
  </button>
</template>

<script>
import Moon from "~/assets/images/moon-regular.svg";
import Sun from "~/assets/images/sun-regular.svg";

export default {
  components: {
    Moon,
    Sun
  },
  data() {
    return {
      theme: localStorage.getItem("theme")
    };
  },
  methods: {
    toggleTheme() {
      if (this.theme == "dark") {
        this.theme = "light";
        document.body.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      } else {
        this.theme = "dark";
        document.body.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
    }
  }
};
</script>