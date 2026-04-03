<template>
    <div>
        <div class="container">
            <router-link to="/">返回主页</router-link>
            <el-divider direction="vertical" />
            <a @click="jumpFeedback">内容反馈</a>
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
                    <el-button type="primary">本地读取</el-button>
                </el-upload>
                <el-divider direction="vertical" />
                <el-button type="primary" @click="importCloudJson">云端读取</el-button>
                <el-divider direction="vertical" />
                <el-button type="primary" @click="exportJson">导出</el-button>
            </div>
            </div>
        <div class="container">
            <h3>词条管理</h3>
            <el-button type="primary" @click="addTool()">添加新词条</el-button>
            <br><br>
            <div>
                <el-table :data="AllData.wordData" stripe border v-loading="loading" style="width: 100%" height="600">
                    <el-table-column prop="id" label="ID"/>
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
            <p>最后编辑日期：{{ AllData.settings.lastUpdate || '未设置' }}</p>
        </div>
        <el-dialog v-model="editFormVisible" :title="isEditMode ? '编辑词条' : '添加词条'" width="500" align-center>
          <el-form>
            <el-form-item label="词条ID">
              <el-input v-model="editToolForm.id"/>
            </el-form-item>
            <el-form-item label="词条">
              <el-input v-model="editToolForm.w" />
            </el-form-item>
            <el-form-item label="标签">
              <el-select
                v-model="editToolForm.t"
                multiple
                allow-create
                filterable
                placeholder="选择或输入标签"
                style="width: 100%"
              >
                <el-option
                  v-for="tag in getAllTags()"
                  :key="tag"
                  :label="tag"
                  :value="tag"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="释义">
              <el-input v-model="editToolForm.m" :autosize="{ minRows: 2, maxRows: 6 }" type="textarea"/>
            </el-form-item>
            <el-form-item label="贡献者">
              <el-input v-model="editToolForm.a" />
            </el-form-item>
            <el-form-item label="最后编辑日期">
              <el-input v-model="editToolForm.d" />
              <el-button link type="primary" @click="setNowDate()">获取当前日期</el-button>
            </el-form-item>

            <el-form-item label="备注">
              <el-input v-model="editToolForm.e" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"/>
            </el-form-item>
          </el-form>
          <template #footer>
            <div>
              <el-button @click="editFormVisible = false">取消</el-button>
              <el-button type="primary" @click="saveEditTool()">提交</el-button>
            </div>
          </template>
        </el-dialog>


    </div>
</template>
<script>
import axios from 'axios';
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
      newHotWord: '',
      editFormVisible: false,
      editToolForm: {
        id: 0,
        w: '',
        t: [],
        m: '',
        a: '',
        d: '',
        e: ''
      },
      isEditMode: false
    }},
    methods: {
      saveToLocalStorage() {
        try {
          const dataToSave = {
            wordData: this.AllData.wordData,
            hotWords: this.AllData.hotWords,
            settings: this.AllData.settings
          };
          localStorage.setItem('wordbook_data', JSON.stringify(dataToSave));
          ElMessage.success('数据已保存到本地缓存');
        } catch (error) {
          ElMessage.error('保存到本地缓存失败:', error);
        }
      },
      loadFromLocalStorage() {
        try {
          const savedData = localStorage.getItem('wordbook_data');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            // 只更新已有字段，避免覆盖其他动态添加的数据
            if (parsedData.wordData) {
              this.AllData.wordData = parsedData.wordData.map(item => ({
                ...item,
                id: Number(item.id)
              }));
            }
            if (parsedData.hotWords) {
              this.AllData.hotWords = parsedData.hotWords;
            }
            if (parsedData.settings) {
              this.AllData.settings = parsedData.settings;
            }
            ElMessage.success('从本地缓存加载数据成功');
            return true;
          }
        } catch (error) {
          ElMessage.error('从本地缓存加载数据失败:', error);
        }
        return false;
      },
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

            // id 可能是字符串，统一转为数值并保留原始数据的其他属性
            if (Array.isArray(this.AllData.wordData)) {
              this.AllData.wordData = this.AllData.wordData.map(item => ({
                ...item,
                id: Number(item.id)
              }));
            }

            const wordCount = this.AllData.wordData.length;
            const hotWordCount = this.AllData.hotWords.length;
            ElMessage.success(`成功导入数据：${wordCount} 条词汇，${hotWordCount} 条热词`);

            // 清空已选择的文件列表
            this.$refs.uploadRef.clearFiles();

            // 保存到本地缓存
            this.saveToLocalStorage();

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
      importCloudJson(){
        axios.get('https://my.wulvxinchen.cn/wordbook/wordData.json').then(res=>{
                this.AllData.wordData = res.data.wordData
                this.AllData.hotWords = res.data.hotWords
                this.AllData.settings = res.data.settings
                ElMessage.success('云端数据读取成功,导入成功');
                // 保存到本地缓存
                this.saveToLocalStorage();
          }).catch(error=>{
            ElMessage.error('导入失败：' + error.message);
          });
      },
      exportJson(){
        try {
          this.AllData.settings.lastUpdate = new Date().toISOString().split('T')[0]; // 更新最后编辑日期为当前日期
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
        // 保存到本地缓存
        this.saveToLocalStorage();
      },
      removeHotWord(index) {
        this.AllData.hotWords.splice(index, 1);
        ElMessage.success('热词已移除');
        // 保存到本地缓存
        this.saveToLocalStorage();
      },
      editTool(id) {
        // 根据id找到对应的词条
        const wordItem = this.AllData.wordData.find(item => item.id === id);
        if (!wordItem) {
          ElMessage.error('未找到对应的词条');
          return;
        }
        // 复制数据到表单
        this.editToolForm = {
          id: wordItem.id,
          w: wordItem.w || '',
          t: Array.isArray(wordItem.t) ? [...wordItem.t] : [],
          m: wordItem.m || '',
          a: wordItem.a || '',
          d: wordItem.d || '',
          e: wordItem.e || ''
        };
        this.isEditMode = true;
        this.editFormVisible = true;
      },
      addTool() {
        // 生成新ID：最大ID + 1
        let maxId = 0;
        if (this.AllData.wordData.length > 0) {
          maxId = Math.max(...this.AllData.wordData.map(item => item.id));
        }
        this.editToolForm = {
          id: maxId + 1,
          w: '',
          t: [],
          m: '',
          a: '',
          d: '',
          e: ''
        };
        this.isEditMode = false;
        this.editFormVisible = true;
      },
      saveEditTool() {
        try {
          // 验证必要字段
          if (!this.editToolForm.w.trim()) {
            ElMessage.warning('请输入词汇');
            return;
          }

          // 强制把id转换为数值
          const parsedId = Number(this.editToolForm.id);
          if (Number.isNaN(parsedId)) {
            ElMessage.warning('ID必须为数字');
            return;
          }

          this.editToolForm.id = parsedId;

          // 找到原词条的索引（用数值ID匹配）
          const index = this.AllData.wordData.findIndex(item => item.id === parsedId);

          if (index !== -1) {
            // 更新现有词条
            this.AllData.wordData[index] = { ...this.editToolForm };
            ElMessage.success('词条更新成功');
            // 保存到本地缓存
            this.saveToLocalStorage();
          } else {
            // 添加新词条 - 检查ID是否已存在（用户可能修改了ID）
            const idExists = this.AllData.wordData.some(item => item.id === parsedId);
            if (idExists) {
              ElMessage.error('ID已存在，请使用不同的ID');
              return;
            }
            this.AllData.wordData.push({ ...this.editToolForm });
            ElMessage.success('词条添加成功');
            // 保存到本地缓存
            this.saveToLocalStorage();
          }

          this.editFormVisible = false;
        } catch (error) {
          ElMessage.error('保存词条失败：' + error.message);
        }
      },
      getAllTags() {
        // 获取所有词条中的所有标签，去重
        const tags = new Set();
        this.AllData.wordData.forEach(item => {
          if (Array.isArray(item.t)) {
            item.t.forEach(tag => {
              if (tag && tag.trim() !== '') {
                tags.add(tag.trim());
              }
            });
          }
        });
        return Array.from(tags);
      },
      setNowDate() {
        const now = new Date();
        const year = now.getFullYear().toString(); // 获取后两位年份
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        this.editToolForm.d = `${year}-${month}-${day}`;
      },
      jumpFeedback() {
        ElMessageBox.confirm('请添加剑斗交流群：916779244', '提示', {
          confirmButtonText: '确认加入',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          window.open('https://qun.qq.com/universal-share/share?ac=1&authKey=eU02f9yXH9TmjB4gsAouKUjCE5GN5a1LpDOESF7osvZ21%2BVNiU%2F9FO%2FOKfog1onn&busi_data=eyJncm91cENvZGUiOiI5MTY3NzkyNDQiLCJ0b2tlbiI6IkVkdGdxV3RxeTNweEZxR2xabjVNcGFrUVprWGkrNEZONFpuaHVuTEtmM250R2NSYll4bGYwZDdJaHdWeHpkU3QiLCJ1aW4iOiIzOTc2ODI5OTY5In0%3D&data=5HmxM6CIH3PAcLXCciDRdC-TnZpEN791raNCSpqpCSjuWh03OIuffMmJso3cl-SHVKOhDLydTLgqaJKXz0-U3A&svctype=4&tempid=h5_group_info', '_blank');
        }).catch(() => {
          ElMessage({
            type: 'info',
            message: '取消发送反馈',
          })
        })
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