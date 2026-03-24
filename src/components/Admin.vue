<template>
    <div class="container">
        <a href="./">返回主页</a>
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