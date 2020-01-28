"use strict";
require("./lib/jquery-1.9.0.min.js");
import Vue from 'vue/dist/vue.esm.js'

//////////////////////////////////////////////

import 'view-design/dist/styles/iview.css';
import ViewUI from 'view-design';

Vue.use(ViewUI);

//////////////////////////////////////////////
//////////////////////////////////////////////
// import 'vuetify/dist/vuetify.min.css'


import Vuetify from 'vuetify'

Vue.use(Vuetify, {
    iconfont: 'mdi',
});

//////////////////////////////////////////////

import App from './components/App.vue'
import {vuetyfiy_style} from "./lib/vuetify_style.js"
function add_dom() {

    /*0. vuetify css*/
    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode(vuetyfiy_style);
    style.appendChild(text);
    /*1. vuetify icon*/
    var link1  = document.createElement("link");
    link1.rel  = "stylesheet";
    link1.type = "text/css";
    link1.href = "https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css";
    var link2  = document.createElement("link");
    link2.rel  = "stylesheet";
    link2.type = "text/css";
    link2.href = "https://fonts.googleapis.com/css?family=Material+Icons";
    // insert dom
    let head = document.getElementsByTagName("head")[0];
    document.head.insertBefore(style, document.head.firstChild);
    head.appendChild(link1);
    head.appendChild(link2);
    /*2. vuetify el*/
    var div = document.createElement("div");
    div.id  = "aha";

    let first_dom = document.body.firstChild;//得到页面的第一个元素
    let wraphtml  = document.body.insertBefore(div, first_dom);

    /*3. vue*/
    window.vm = new Vue({
        el: '#aha',
        components: { App },
        template: '<App/>',
    })
}

window.add_dom = add_dom;

