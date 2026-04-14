<template>
    <Header />
    <div class="container home-container">
        <div class="logo">
            <span class="logo-text">{{ title }}</span>
        </div>
        <div class="search-container">
            <el-input
                class="search-input"
                placeholder="输入关键词"
                size="large"
                v-model="searchWord"
                clearable
                @input="handleInput"
                @blur="handleBlur"
            >
                <template #prepend>
                    <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
                  />
                    </svg>
                </template>
                <template #append>
                    <el-button @click="handleSearch">搜索</el-button>
                </template>
            </el-input>
            <div class="suggestions-container" v-show="showSuggestions && suggestions.length > 0">
                <ul class="suggestions-list">
                    <li
                        v-for="(suggestion, index) in suggestions"
                        :key="index"
                        class="suggestion-item"
                        @mousedown="selectSuggestion(suggestion)"
                    >
                        {{ suggestion }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="hotword-container">
            <h3>热词推荐</h3>
            <div>
                <el-tag
                    v-for="(w, index) in hotWord"
                    :key="index"
                    type="info"
                    @click="useHotWord(w)"
                    style="cursor: pointer; margin-right: 8px; margin-bottom: 8px;"
                >
                    {{ w }}
                </el-tag>
            </div>
        </div>
        <div class="final-result" v-show="Object.keys(finalResult).length > 0">
            <p class="result-name"><strong>{{ finalResult.w }}</strong></p>
            
            <div class="result-tag">
                <el-tag type="success" class="result-tag-item" v-for="(i, index) in finalResult.t" :key="index">{{i}}</el-tag>
            </div>
            <p class="result-meaing"><strong>{{ finalResult.m }}</strong></p>
            <div class="result-info">
                <p class="result-id">词条编号:{{ finalResult.id }}</p>
                <p class="result-author">贡献者:{{ finalResult.a }}</p>
                <p class="result-date">最后编辑日期:{{ finalResult.d }}</p>
            </div>
        </div>
        <el-dialog
            v-model="showsearchResults"
            title="搜索结果"
            width="500"
            align-center
        >
            <p>
                共搜到<el-text type="success">{{ searchResults.length }}</el-text
                >个包含关键词<el-text type="warning">“{{ searchWord }}”</el-text>的词条
            </p>
            <el-table
                :data="searchResults"
                stripe
                border
                style="width: 100%"
                height="700"
            >
                <el-table-column prop="w" label="词条" />
                <el-table-column prop="t" label="标签" />
                <el-table-column fixed="right" label="操作">
                <template #default="{ row }">
                    <el-button link type="primary" @click="selectSuggestion(row.w)"
                    >查看</el-button
                    >
                </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios';
import Header from './Header.vue';
import { ElMessage,ElMessageBox } from 'element-plus';

export default {
  components: { Header },
    data() {
        return {
            title: '剑斗词典',
            searchWord: '',
            wordData: [],
            hotWord:[],
            searchResults:[],
            suggestions: [],
            finalResult:{},
            showSuggestions: false,
            showsearchResults: false,
            blurTimer: null
        }
    },
    methods: {
        handleSearch() {
            // 清除blur定时器
            if (this.blurTimer) {
                clearTimeout(this.blurTimer);
                this.blurTimer = null;
            }

            const searchTerm = this.searchWord.trim().toLowerCase();
            if (!searchTerm) {
                ElMessage.warning('请输入搜索关键词');
                return;
            }

            if (!this.wordData || this.wordData.length === 0) {
                ElMessage.error('词库数据尚未加载，请稍后再试');
                return;
            }

            // 递归搜索函数
            const searchInObject = (obj, term) => {
                if (typeof obj === 'string') {
                    return obj.toLowerCase().includes(term);
                }
                if (Array.isArray(obj)) {
                    return obj.some(item => searchInObject(item, term));
                }
                if (obj && typeof obj === 'object') {
                    return Object.values(obj).some(value => searchInObject(value, term));
                }
                return false;
            };

            const results = this.wordData.filter(item => searchInObject(item, searchTerm));
            this.searchResults = results
            this.showSuggestions = false; // 隐藏联想容器
            this.showsearchResults = true;

            //测试函数，正式开发后删除
            console.log(`搜索关键词: "${this.searchWord}"`);
            console.log(`匹配到 ${results.length} 条结果:`);
            results.forEach((item, index) => {
                console.log(`[${index + 1}]`, item);
            });

            if (results.length === 0) {
                ElMessage.info('未找到结果');
            }
        },
        handleInput() {
            // 清除blur定时器
            if (this.blurTimer) {
                clearTimeout(this.blurTimer);
                this.blurTimer = null;
            }

            const searchTerm = this.searchWord.trim().toLowerCase();
            if (!searchTerm) {
                this.suggestions = [];
                this.showSuggestions = false;
                return;
            }

            if (!this.wordData || this.wordData.length === 0) {
                return;
            }

            // 重用递归搜索函数
            const searchInObject = (obj, term) => {
                if (typeof obj === 'string') {
                    return obj.toLowerCase().includes(term);
                }
                if (Array.isArray(obj)) {
                    return obj.some(item => searchInObject(item, term));
                }
                if (obj && typeof obj === 'object') {
                    return Object.values(obj).some(value => searchInObject(value, term));
                }
                return false;
            };

            const matchedItems = this.wordData.filter(item => searchInObject(item, searchTerm));
            // 提取w字段，去重
            const uniqueWords = [...new Set(matchedItems.map(item => item.w).filter(w => w && w.trim() !== ''))];
            this.suggestions = uniqueWords.slice(0, 10); // 限制最多显示10个
            this.showSuggestions = this.suggestions.length > 0;
        },
        selectSuggestion(suggestion) {
            this.searchWord = suggestion;
            this.showSuggestions = false;
            // 清除blur定时器，防止隐藏联想容器
            if (this.blurTimer) {
                clearTimeout(this.blurTimer);
                this.blurTimer = null;
            }
            this.finalResult = this.wordData.find(item => item.w === suggestion) || {};
            this.showsearchResults = false;
        },
        handleBlur() {
            // 延迟隐藏联想容器，确保点击候选词能先执行
            this.blurTimer = setTimeout(() => {
                this.showSuggestions = false;
                this.blurTimer = null;
            }, 200);
        },
        useHotWord(word) {
            this.searchWord = word;
            this.handleSearch();
        },
    },
    mounted() {
        axios.get('https://my.wulvxinchen.cn/wordbook/wordData.json').then(res=>{
            this.wordData = res.data.wordData
            this.hotWord = res.data.hotWords
        }).catch(error=>{
            ElMessage.error('数据加载失败，请检查网络连接');
        })
    }
}
</script>
<style>
.container {
  max-width: 80%;
  margin: 40px auto;
  padding: 20px 30px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,.1);
  transition: all .5s;
}
.container:hover {
  box-shadow:
    2.3px 1.6px 2px rgba(0, 0, 0, 0.017),
    4.4px 3px 4.2px rgba(0, 0, 0, 0.026),
    6.5px 4.4px 7px rgba(0, 0, 0, 0.034),
    8.7px 6px 11.1px rgba(0, 0, 0, 0.042),
    11.5px 7.9px 18.5px rgba(0, 0, 0, 0.053),
    16px 11px 37px rgba(0, 0, 0, 0.07);
}

.home-container{
    padding-top: 10em;
    padding-bottom: 10em;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}
.logo-text {
  font-family: 'Product Sans', Arial, sans-serif;
  font-size: 48px;
  font-weight: 400;
  background: linear-gradient(90deg, #4285f4, #34a853, #fbbc05, #ea4335);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
}

.search-container {
  display: flex;
  justify-content: center;
  position: relative;
}
.search-input {
    width: 60%;
}

/* 联想容器样式 */
.suggestions-container {
    width: 60%;
    position: absolute;
    top: 100%;
    left: 20%;
    right: 0;
    margin-top: 2px;
    background: white;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    z-index: 999;
    max-height: 300px;
    overflow-y: auto;
}
.suggestions-list {
    list-style: none;
    padding: 0;
    margin: 0;
}
.suggestion-item {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
    color: #606266;
    transition: background-color 0.2s;
}
.suggestion-item:hover {
    background-color: #f5f7fa;
}
.suggestion-item:not(:last-child) {
    border-bottom: 1px solid #ebeef5;
}

.hotword-container{
    margin: 2em auto;
    width: 60%;
}

.final-result{
    margin: 2em 0;
    padding: 2em;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.result-name{
    color: #000;
    font-size: 1.75em;
    margin: 0.3em 0;
}
.result-info p{
    margin: 0.1em 0;
}
.result-id{
    color: #6c757d;
}
.result-author{
    color: #6c757d;
}
.result-date{
    color: #6c757d;
}

.result-tag-item{
    margin-right: 5px;
}
.result-meaing{
    padding: 0.3em;
    border: 1px dashed #8b8b8b;
}
/* 手机端适配 */
@media (max-width: 768px) {
    .search-input {
        width: 100%;
    }
    .suggestions-container {
        width: 100%;
        left: 0;
    }
    .hotword-container{
        width: 100%;
    }
}
</style>