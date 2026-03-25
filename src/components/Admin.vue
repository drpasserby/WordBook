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


    </div>
</template>
<script>
import { ElMessage,ElMessageBox } from 'element-plus';
export default {
  data(){
    return {

    }},
    methods: {

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