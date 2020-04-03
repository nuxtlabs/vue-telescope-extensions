
browser.runtime.onMessage.addListener(request => {
  console.log("Message from the background script:");
  console.log(request.greeting);
  detectVue()
  return Promise.resolve({ response: document.querySelectorAll('*') });
});

function detectVue() {
  return window.Vue || window.$nuxt || [...document.querySelectorAll('*')].map((el) => Boolean(el.__vue__)).filter(Boolean).length
}