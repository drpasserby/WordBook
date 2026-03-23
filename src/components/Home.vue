<template>
    <div class="container home-container">
        <div class="logo">
            <span class="logo-text">{{ title }}</span>
        </div>
        <div class="search-container">
            
            <el-input
                class="search-input"
                placeholder="输入词汇"
                size="large"
                v-model="searchWord"
                clearable
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
        </div>
    </div>
</template>
<script>

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
    height: 40em;
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
}

.search-input {
    width: 60%;
}

/* 手机端适配 */
@media (max-width: 768px) {
    .search-input {
        width: 100%;
    }
}
</style>