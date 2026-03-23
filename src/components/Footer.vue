<template>
    <div class="container">
        <div class="cr_text">Copyright © {{thisYear}} 剑斗词典</div>
        <div class="cr_text">版本号 0.0.1</div>
        <div class="cr_text">Powered by <a href="https://wulvxinchen.cn/">吾律心尘</a></div>
    </div>
</template>
<script>
export default {
  data(){
    return {
      thisYear: new Date().getFullYear()
    }},
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