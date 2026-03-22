import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'   // 引入中文语言包

import App from './App.vue'
import router from './router'
import axios from 'axios'
import App from './App.vue'


createApp(App).use(router).use(ElementPlus,{locale: zhCn,}).mount('#app')