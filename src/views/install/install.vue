<template>
  <el-card class="box-card" style="margin: 0 auto">
    <h3>选择任务配置文件</h3>
    <form @submit.prevent="uploadFiles">
      <input ref="jsonInput" type="file" accept=".json" />
      <br /><br />

      <h3>选择相应代码</h3>
      <div>
        <el-button type="info" plain @click="addFileInput">+</el-button>
        <el-button type="info" plain @click="removeFileInput">-</el-button>
      </div>
      <div v-for="(fileInput, index) in fileInputs" :key="index">
        <input
          type="text"
          placeholder="请输入阶段名"
          v-model="fileInputs[index].name"
        /><br />
        <input
          ref="codeInput"
          type="file"
          accept=".zip"
          @change="fileInputs[index].file = $event.target.files[0]"
        />
        <br /><br />
      </div>

      <br />
      <!-- <el-button type="primary" plain native-type="submit">Submit</el-button> -->
      <el-button type="primary" plain native-type="submit" :loading="loading">Submit</el-button>
    </form>
  </el-card>
</template>

<script>
import { ElButton } from "element-plus";
import { ElMessage } from 'element-plus'
export default {
  components: {
    ElButton,
  },
  data() {
    return {
      fileInputs: [],
      loading: false
    };
  },
  methods: {
    addFileInput() {
      this.fileInputs.push({ name: "", file: null });
    },
    removeFileInput() {
      this.fileInputs.pop();
    },
    uploadFiles() {
      this.loading = true;
      const jsonFile = this.$refs.jsonInput.files[0];
      const formData = new FormData();
      formData.append("task_json", jsonFile);
      for (let i = 0; i < this.fileInputs.length; i++) {
        const codeFile = this.fileInputs[i].file;
        formData.append(this.fileInputs[i].name, codeFile);
      }
      console.log(formData);
      // fetch("http://127.0.0.1:5500//upload-json-and-codefiles-api", {
      fetch("/serv/upload-json-and-codefiles-api", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            alert("提交失败！");
            throw new Error("Network response was not ok");
          }
          alert("提交成功！");
          return response.text();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
}
</style>


