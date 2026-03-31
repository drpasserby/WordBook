<template>
    <div class="container">
        <div class="cr_text">Copyright © {{thisYear}} 剑斗词典-0.0.1</div>
        <div class="cr_text"></div>
        <div class="cr_text">本词典内容来源于互联网，概不对内容负责</div>
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