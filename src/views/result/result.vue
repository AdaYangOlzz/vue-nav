<template>
  <el-space wrap>
    <div>
      <el-radio-group v-model="submit_job" @change="updateResultUrl">
        <el-radio v-for="item in submit_jobs" :key="item" :label="item">{{
          item
        }}</el-radio>
      </el-radio-group>
    </div>
  </el-space>
  <div>{{ result }}</div>
</template>
  
<script>
import { ref } from 'vue'
import { ElLoading } from 'element-plus'
export default {
  data() {
    return {
      submit_jobs: [],
      submit_job: "",
      result: null,
      // resultUrl: "http://127.0.0.1:5000/user/sync_job_result/",
      resultUrl: "/dag/user/sync_job_result/",
      // loading: "Loading...",
      intervalId: null
    };
  },
  mounted() {
    const submitJobs = sessionStorage.getItem("submit_jobs");
    if (submitJobs) {
      this.submit_jobs = JSON.parse(submitJobs);
    }
  },
  methods: {
    updateResultUrl() {
      this.result = null
      this.resultUrl += this.submit_job;
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      // fetch
      fetch(this.resultUrl)
        .then((response) => response.json())
        .then((data) => {
          loading.close()
          // console.log(data);
          this.result = data;
        })
        .catch((error) => {
          console.error(error);
          loading.close();
          alert("请求resultUrl失败,请稍后重试");
        });
      
      

      // this.resultUrl = "http://127.0.0.1:5000/user/sync_job_result/";
      this.resultUrl = "/dag/user/sync_job_result/";
    },
  },
};
</script>
