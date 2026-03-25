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
                <el-button type="primary" @click="ExportJson">导出</el-button>
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
      loading: false
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
          this.$message.error('读取文件失败');
          this.loading = false;
          this.$refs.uploadRef.clearFiles();
        };

        reader.readAsText(file.raw);
      },
      ExportJson(){

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