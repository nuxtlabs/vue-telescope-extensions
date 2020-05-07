"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = require("vue");
const App_vue_1 = require("./App.vue");
const store_1 = require("../store");
new vue_1.default({
    el: '#vtm',
    store: store_1.default,
    render: (h) => h(App_vue_1.default),
});
