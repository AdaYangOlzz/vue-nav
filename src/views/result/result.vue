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

  <!-- <div v-if="submit_job && !result" v-loading="!result" element-loading-text="Loading..."></div> -->

  <!-- <div v-if="result">{{ result }}</div> -->

  <div v-if="result">
    <div>
      <b>用户约束</b><br />
      时延：20s 精度：0.7
    </div>

    <br />
    <div>
      <b>执行结果</b><br />
      {{ result["result"]["appended_result"] }}
      <!-- <div v-for="item in result["result"]["appended_result"]"></div> -->
    </div>

    <br />

    <div>
      <b>运行时情景</b><br />
      <!-- plan result -->
      {{ result["result"]["latest_result"]["plan_result"] }}

      <!-- resource info -->
    </div>

    <br />

    <div>
      <b>当前调度配置</b><br />
      {{ result["result"]["latest_result"]["plan"] }}
    </div>
  </div>
</template>

<script>
import { ref, onBeforeUnmount } from "vue";
import { ElLoading, ElMessage } from "element-plus";

export default {
  data() {
    return {
      submit_jobs: [],
      submit_job: "",
      result: null,
      resultUrl: "/dag/user/sync_job_result/",
      // loading: "Loading...",
      intervalId: null,
      timer: null,
    };
  },
  mounted() {
    const submitJobs = sessionStorage.getItem("submit_jobs");
    if (submitJobs) {
      this.submit_jobs = JSON.parse(submitJobs);
    }
    this.timer = setInterval(() => {
      this.updateResultUrl();
    }, 10000);
  },
  methods: {
    updateResultUrl() {
      console.log(this.submit_job);
      const url = this.resultUrl + this.submit_job;
      // console.log(url)
      const loading = ElLoading.service({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          loading.close();
          this.result = data;
        })
        .catch((error) => {
          console.error(error);
          loading.close();
          ElMessage({
            showClose: true,
            message: "Oops, this is a error message.",
            type: "error",
            duration: 1500,
          });
        });
    },
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
};
</script>
