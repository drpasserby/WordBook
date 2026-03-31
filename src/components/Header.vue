<template>
    <div class="container">
        <span style="font-weight: 600"
        ><a href="https://bbs.nga.cn/thread.php?fid=835">NGA剑斗绮谭</a>
        <el-divider direction="vertical" />
        <a @click="jumpFeedback">网站反馈</a>
        <el-divider direction="vertical" />
        <router-link to="/admin">管理后台</router-link>
        </span>
    </div>
</template>
<script>
import { ElMessage,ElMessageBox } from 'element-plus';
export default {
    methods: {
        jumpFeedback() {
            ElMessageBox.confirm('仅供反馈网站自身情况给技术开发员，内容反馈请自行联系网站运营。', '提示', {
                confirmButtonText: '我已知晓,确认',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                window.open('https://github.com/drpasserby/WordBook/issues', '_blank');
            }).catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消发送反馈',
                })
            })
        }
    },
}
</script>
<style scoped>
</style>