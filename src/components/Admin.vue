<template>
    <div>
        <div class="container">
            <a href="./">返回主页</a>
            <el-divider direction="vertical" />
            <a href="./">内容反馈</a>
        </div>
        <div class="container">
            <h3>数据导入导出</h3>
            <div>
                <el-upload
                    ref="uploadRef"
                    action="#"
                    :auto-upload="false"
                    :show-file-list="false"
                    accept=".json,application/json"
                    :on-change="importJson"
                    style="display:inline"
                >
                    <el-button type="primary">读取</el-button>
                </el-upload>
                <el-divider direction="vertical" />
                <el-button type="primary" @click="exportJson">导出</el-button>
            </div>
            </div>
        <div class="container">
            <h3>词条管理</h3>
            <div>
                <el-table :data="AllData.wordData" stripe border v-loading="loading" style="width: 100%" height="600">
                    <el-table-column prop="id" label="ID" width="180"/>
                    <el-table-column prop="w" label="词汇"/>
                    <el-table-column prop="t" label="标签"/>
                    <el-table-column fixed="right" label="操作">
                    <template #default="{row}">
                        <el-button link type="primary" @click="editTool(row.id)">编辑</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="container">
            <h3>热词管理</h3>
            <div style="margin-bottom: 16px;">
                <el-input
                    v-model="newHotWord"
                    placeholder="输入新热词"
                    style="width: 200px; margin-right: 10px;"
                    @keyup.enter="addHotWord"
                />
                <el-button type="primary" @click="addHotWord">添加</el-button>
            </div>
            <div>
                <el-tag
                    v-for="(word, index) in AllData.hotWords"
                    :key="index"
                    closable
                    :disable-transitions="false"
                    @close="removeHotWord(index)"
                    style="margin-right: 8px; margin-bottom: 8px;"
                >
                    {{ word }}
                </el-tag>
                <el-tag
                    v-if="AllData.hotWords.length === 0"
                    type="info"
                >
                    暂无热词，请添加
                </el-tag>
            </div>
        </div>
        <div class="container">
            <h3>其他设置</h3>
        </div>
    </div>
</template>
<script>
import { ElMessage,ElMessageBox } from 'element-plus';
export default {
  data(){
    return {
      AllData: {
        wordData: [],
        hotWords: [],
        settings: {}
        // 其他数据类型可以动态添加
      },
      loading: false,
      newHotWord: ''
    }},
    methods: {
      importJson(file){
        // file 是 el-upload 包装的文件对象，包含 raw 属性（原始文件）
        if (!file || !file.raw) return;

        this.loading = true;
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target.result);

            // 合并所有数据到AllData中
            Object.assign(this.AllData, json);

            const wordCount = this.AllData.wordData.length;
            const hotWordCount = this.AllData.hotWords.length;
            ElMessage.success(`成功导入数据：${wordCount} 条词汇，${hotWordCount} 条热词`);

            // 清空已选择的文件列表
            this.$refs.uploadRef.clearFiles();

          } catch (error) {
            ElMessage.error('解析JSON文件失败：' + error.message);
          } finally {
            this.loading = false;
          }
        };

        reader.onerror = () => {
          ElMessage.error('读取文件失败');
          this.loading = false;
          this.$refs.uploadRef.clearFiles();
        };

        reader.readAsText(file.raw);
      },
      exportJson(){
        try {
          // 准备导出的数据
          const exportData = {
            hotWords: Array.isArray(this.AllData.hotWords) ? this.AllData.hotWords : [],
            settings: typeof this.AllData.settings === 'object' && this.AllData.settings !== null ? this.AllData.settings : {},
            wordData: Array.isArray(this.AllData.wordData) ? this.AllData.wordData : []
          };

          // 转换为JSON字符串，格式化输出（缩进2个空格）
          const jsonString = JSON.stringify(exportData, null, 2);

          // 创建Blob对象
          const blob = new Blob([jsonString], { type: 'application/json' });

          // 创建下载链接
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'wordData.json'; // 固定文件名，与参考文件一致

          // 触发下载
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // 释放URL对象
          URL.revokeObjectURL(url);

          const wordCount = exportData.wordData.length;
          const hotWordCount = exportData.hotWords.length;
          ElMessage.success(`成功导出数据：${wordCount} 条词汇，${hotWordCount} 条热词`);

        } catch (error) {
          ElMessage.error('导出数据失败：' + error.message);
        }
      },
      addHotWord() {
        if (!this.newHotWord.trim()) {
          ElMessage.warning('请输入热词');
          return;
        }
        if (this.AllData.hotWords.includes(this.newHotWord.trim())) {
          ElMessage.warning('该热词已存在');
          return;
        }
        this.AllData.hotWords.push(this.newHotWord.trim());
        this.newHotWord = '';
        ElMessage.success('热词添加成功');
      },
      removeHotWord(index) {
        this.AllData.hotWords.splice(index, 1);
        ElMessage.success('热词已移除');
      }
    }
}
</script>
<style scoped>
    .cr_text {
        text-align: center;
        color: #888;
        margin: 20px 0;
        font-size: 14px;
    }
</style>