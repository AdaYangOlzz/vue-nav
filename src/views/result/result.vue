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

  <!-- <div>
    <div id="chart" style="width: 600px; height: 400px"></div>
  </div> -->
  <div v-if="result">
    <div>
      <div class="info-header">用户约束</div>
      <!-- <div class="info-box">时延：20s 精度：0.7</div> -->

      <div class="info-box">
        <div class="info-h1-flex-text">
          <div class="info-h2" v-if="plan_result">近期延迟</div>
          <div
            class="info-h2-flex-text"
            style="display: flex; flex-direction: row"
          >
            <div class="info-h2-flex-text-items" style="flex-grow: 1">
              <div v-if="sumValues">{{ sumValues }}</div>
              <div v-else>时延尚未计算出</div>
            </div>
            <div class="info-h2-flex-text-items">
              <div v-if="sumValues">(秒)</div>
            </div>
          </div>
        </div>

        <div class="info-h1">修改时延约束</div>
        <div class="info-h1-flex-text">
          <el-input v-model="delay_cons"></el-input>
        </div>

        <div class="info-h1">修改精度约束</div>
        <div class="info-h1-flex-text">
          <el-input v-model="acc_cons"></el-input>
        </div>

        <br />
        <el-button type="primary" plain @click="submitConstraint"
          >Submit</el-button
        >
      </div>
    </div>

    <div>
      <div class="info-header">执行结果</div>
      <div class="info-box">
        <!-- <div v-for="item in appended_result">
          {{ Object.entries(item)[0][0] }} : {{ Object.entries(item)[0][1] }}
          {{ Object.entries(item)[1][0] }} : {{ Object.entries(item)[1][1] }}
        </div> -->
        <div id="chart" style="width: 600px; height: 400px"></div>
      </div>
      <div></div>
    </div>

    <div>
      <div class="info-header">运行时情境</div>
      <div class="info-box">
        <!-- plan result -->
        <!-- {{ plan_result }} -->
        <div v-for="(value, key) in modifiedPlanResult">
          <div class="info-h1">{{ key }}</div>
          <div>
            <div class="info-h1-flex-text" v-for="(v, k) in value">
              <div class="info-h2">{{ k }}</div>
              <div class="info-h2-flex-text">
                <div class="info-h2-flex-text-items">{{ v }}</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <!-- {{ cluster_info }} -->
          <div class="info-h1">系统资源</div>
          <div class="info-h1-flex-text" v-for="(value, ip) in cluster_info">
            <!--IP作为二级标题-->
            <div class="info-h2">{{ ip }}</div>
            <div class="info-h2-flex-text">
              <div
                class="info-h2-flex-text-items"
                v-if="value['node_role'] === 'cloud'"
              >
                云端
              </div>
              <div class="info-h2-flex-text-items" v-else>边端</div>

              <div class="info-h2-flex-text-items">
                CPU：{{ value["n_cpu"] }}核（已占用{{ value["cpu_ratio"] }}）
              </div>

              <div class="info-h2-flex-text-items">
                内存：{{ value["mem"] }}MB（已占用{{ value["mem_ratio"] }}%）
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- resource info -->
    </div>

    <div>
      <div class="info-header">当前调度配置</div>
      <div class="info-box">
        <!-- {{ plan }} -->
        <div v-for="(h1_value, h1_key) in modifiedPlan">
          <div class="info-h1">{{ h1_key }}</div>
          <div>
            <div class="info-h1-flex-text" v-for="(h2_v, h2_k) in h1_value">
              <div class="info-h2">{{ h2_k }}</div>

              <!-- 以按钮方式显示特定配置 -->
              <!-- 1、flow_mapping: 本机、边缘、云端 -->
              <div v-if="h1_key === '协同方式'" class="info-h2-flex-text">
                <el-radio-group
                  direction="row"
                  v-model="h1_value[h2_k]['node_role']"
                  :disabled="true"
                >
                  <el-radio-button
                    class="user-radio"
                    v-for="item in node_type_list"
                    :label="item.key"
                    >{{ item.ui_value }}</el-radio-button
                  >
                </el-radio-group>
              </div>
              <!-- 2、video_conf: 编解码 -->
              <div v-else-if="h2_k === 'encoder'" class="info-h2-flex-text">
                <el-radio-group
                  direction="row"
                  v-model="h1_value[h2_k]"
                  :disabled="true"
                >
                  <el-radio-button
                    class="user-radio"
                    v-for="item in encoder_type_list"
                    :label="item.key"
                    >{{ item.ui_value }}</el-radio-button
                  >
                </el-radio-group>
              </div>
              <!-- 3、video_conf: 帧率 -->
              <div v-else-if="h2_k === 'fps'" class="info-h2-flex-text">
                <el-radio-group
                  direction="row"
                  v-model="h1_value[h2_k]"
                  :disabled="true"
                >
                  <el-radio-button
                    class="user-radio"
                    v-for="item in fps_type_list"
                    :label="item.key"
                    >{{ item.ui_value }}</el-radio-button
                  >
                </el-radio-group>
              </div>
              <!-- 4、video_conf: 分辨率 -->
              <div v-else-if="h2_k === 'resolution'" class="info-h2-flex-text">
                <el-radio-group
                  direction="row"
                  v-model="h1_value[h2_k]"
                  :disabled="true"
                >
                  <el-radio-button
                    class="user-radio"
                    v-for="item in resolution_type_list"
                    :label="item.key"
                    >{{ item.ui_value }}</el-radio-button
                  >
                </el-radio-group>
              </div>

              <!-- 以文本方式显示其他h2内容 -->
              <div v-else class="info-h2-flex-text">{{ h2_v }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div v-on:click="show_more_info()" class="info-header">
        ↓ （点击查看更多信息） ↓
      </div>
      <div v-if="should_show_more_info === true" class="info-box">
        {{ result }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeUnmount } from "vue";
import { ElLoading, ElMessage } from "element-plus";
import * as echarts from "echarts";

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
      appended_result: null,
      plan_result: null,
      plan: null,
      resource_info: null,
      cluster_info: null,
      should_show_more_info: false,
      node_type_list: [],
      encoder_type_list: [],
      fps_type_list: [],
      resolution_type_list: [],
      delay_cons: null,
      acc_cons: null,
      cons_url: "/dag/user/submit_job_user_constraint",
      // chartData: [],
      chart: null,
      showChart: false,
    };
  },
  mounted() {
    const submitJobs = sessionStorage.getItem("submit_jobs");
    if (submitJobs) {
      this.submit_jobs = JSON.parse(submitJobs);
    }
    this.node_type_list = [
      { key: "host", ui_value: "视频边端" },
      { key: "edge", ui_value: "其他边端" },
      { key: "cloud", ui_value: "云端" },
    ];
    this.encoder_type_list = [
      { key: "H264", ui_value: "H264" },
      { key: "JPEG", ui_value: "JPEG" },
      { key: "x", ui_value: "..." },
    ];
    this.fps_type_list = [
      { key: 24, ui_value: "24" },
      { key: 30, ui_value: "30" },
      { key: 60, ui_value: "60" },
      { key: 120, ui_value: "120" },
    ];
    this.resolution_type_list = [
      { key: "360p", ui_value: "480x360" },
      { key: "480p", ui_value: "640x480" },
      { key: "720p", ui_value: "1280x720" },
      { key: "1080p", ui_value: "1920x1080" },
    ];
    // // TO_REMOVE: 静态填充
    this.cluster_info = {
      "127.0.0.1": {
        node_role: "cloud",
        n_cpu: 8,
        cpu_ratio: 2.5,
        mem: 4096 * 32,
        mem_ratio: 0.3,
      },
      "127.0.0.2": {
        node_role: "edge",
        n_cpu: 4,
        cpu_ratio: 2.5,
        mem: 4096,
        mem_ratio: 0.3,
      },
    };
    // // TO_REMOVE: 静态填充

    // this.result = {
    //   result: {
    //     // 该部分是列表，代表最近10帧的处理结果
    //     appended_result: [
    //       {
    //         "#no_helmet": 1,
    //         n_loop: 11,
    //       },
    //       {
    //         "#no_helmet": 1,
    //         n_loop: 12,
    //       },
    //       {
    //         "#no_helmet": 1,
    //         n_loop: 13,
    //       },
    //     ],

    //     // 该部分是json，代表最近一次调度的调度策略和调度结果
    //     latest_result: {
    //       // 当前调度执行计划
    //       plan: {
    //         flow_mapping: {
    //           face_detection: {
    //             model_id: 0,
    //             node_ip: "192.168.56.102",
    //             node_role: "host", // node_role有三种可能：host、edge、cloud，前端只区分cloud和非cloud，非cloud显示为“边端”
    //           },
    //           face_alignment: {
    //             model_id: 0,
    //             node_ip: "192.168.56.102",
    //             node_role: "cloud",
    //           },
    //         },
    //         video_conf: {
    //           encoder: "H264",
    //           fps: 24,
    //           nskip: 0, // 跳帧率，每处理一帧跳nskip帧
    //           ntracking: 5, // 追踪率，每处理一帧追踪ntracking帧
    //           resolution: "360p",
    //         },
    //       },
    //       // 最近一次调度后，DAG执行各步骤的平均结果
    //       plan_result: {
    //         delay: {
    //           face_detection: 0.35737492098952783,
    //           face_alignment: 0.35737492098952783,
    //         },
    //       },
    //     },
    //   },
    //   status: 0,
    // };
    // // TO_REMOVE: 静态填充
    // this.appended_result = this.result["result"]["appended_result"];
    // // TO_REMOVE: 静态填充
    // this.plan_result = this.result["result"]["latest_result"]["plan_result"];
    // // TO_REMOVE: 静态填充
    // this.plan = this.result["result"]["latest_result"]["plan"];
    // this.initChart();
    this.timer = setInterval(() => {
      this.updateResultUrl();
    }, 10000);
  },
  methods: {
    initChart() {
      console.log(this.result);
      this.chart = echarts.init(document.getElementById("chart"));
    },
    updateChart() {
      const yKey = Object.keys(this.appended_result[0])[0]; // 获取第一个键名作为纵坐标的键名

      const data = this.appended_result.map((item) => ({
        x: item.n_loop,
        y: item[yKey], // 使用纵坐标的键名来获取对应的值
      }));

      const appended_data = this.appended_result;

      // 获取追加结果中key非n_loop的数据
      var xAsixName = "n_loop";
      var seriesData = {};
      var resKeyList = [];
      // console.log("appended_data length: " + appended_data.length);
      for (var i = 0; i < appended_data.length; i++) {
        var keyList = Object.keys(appended_data[i]);
        for (var j = 0; j < keyList.length; j++) {
          if (resKeyList.indexOf(keyList[j]) == -1) {
            resKeyList.push(keyList[j]);
          }
        }
        // resKeyList = resKeyList.concat(keyList);
      }
      // resKeyList = [new Set(resKeyList)]
      // console.log("resKeyList: " + resKeyList);
      // var resKeyList = Object.keys(appended_data[0])
      for (var i = 0; i < resKeyList.length; i++) {
        var key = resKeyList[i];
        if (key !== xAsixName) {
          seriesData[key] = [];
        }
      }
      // console.log("init seriesData keys: " + Object.keys(seriesData));
      // 生成各key的数据序列
      for (var i = 0; i < appended_data.length; i++) {
        var frameInfo = appended_data[i];
        for (var j in frameInfo) {
          var key = j;
          var value = frameInfo[j];
          if (key !== xAsixName) {
            seriesData[key].push(value);
          }
        }
      }
      // 生成series列表和与其对应的legend列表
      var seriesList = [];
      var legendList = [];
      // console.log("seriesData entries: " + Object.entries(seriesData));
      for (var ent of Object.entries(seriesData)) {
        // console.log("ent[0]=" + ent[0]);
        // console.log("ent[1]=" + ent[1]);
        legendList.push(ent[0]);
        seriesList.push({
          name: ent[0],
          type: "bar",
          stack: "stack",
          label: {
            show: true,
            position: "top",
            color: "black",
            fontSize: 12,
            formatter: function (d) {
              return d.data;
            },
          },
          data: ent[1],
        });
      }

      const option = {
        xAxis: {
          type: "category",
          data: data.map((item) => item.x), // 使用映射后的横坐标数据
          name: "帧数",
        },
        yAxis: {
          type: "value",
          name: "检测到的数量",
        },
        legend: {
          data: legendList,
        },
        series: seriesList,
        // series: [
        //   {
        //     type: "line",
        //     data: data.map((item) => item.y), // 使用映射后的纵坐标数据
        //   },
        // ],
      };

      this.chart.setOption(option, true); // 不要合并更新
      // this.chart.setSeries(seriesList)
    },

    show_more_info() {
      this.should_show_more_info = !this.should_show_more_info;
      console.log(this.should_show_more_info);
    },
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
          console.log(data);
          this.result = data;
          this.appended_result = this.result["result"]["appended_result"];
          this.plan_result =
            this.result["result"]["latest_result"]["plan_result"];
          this.plan = this.result["result"]["latest_result"]["plan"];
          this.showChart = true;
        })
        .catch((error) => {
          console.error(error);
          loading.close();
          ElMessage({
            showClose: true,
            message: "结果尚未生成,请稍后",
            type: "error",
            duration: 1500,
          });
          this.result = null;
        });
    },

    // submit user constraint
    submitConstraint() {
      const userConstraint = {
        delay: parseFloat(this.delay_cons),
        accuracy: parseFloat(this.acc_cons),
      };
      const data = {
        job_uid: this.submit_job,
        user_constraint: userConstraint,
      };
      console.log(data);

      // fetch post end
      fetch(this.cons_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          ElMessage({
            message: "修改约束成功",
            showClose: true,
            type: "success",
            duration: 1000,
          });
        })
        .catch((error) => {
          console.log(error);
          ElMessage.error("提交失败");
        });
    },
  },
  updated() {
    if (this.showChart && !this.chart) {
      this.initChart();
    }
    if (this.showChart) {
      this.updateChart();
    }
  },
  computed: {
    modifiedPlanResult() {
      if (this.plan_result) {
        return null;
      }
      return Object.fromEntries(
        Object.entries(this.plan_result).map(([key, value]) => {
          if (key === "delay") {
            return ["时延", value];
          } else {
            return [key, value];
          }
        })
      );
    },
    modifiedPlan() {
      if (!this.plan) {
        return null;
      }
      return Object.fromEntries(
        Object.entries(this.plan).map(([key, value]) => {
          if (key === "flow_mapping") {
            return ["协同方式", value];
          } else if (key === "video_conf") {
            return ["视频配置", value];
          } else {
            return [key, value];
          }
        })
      );
    },
    sumValues() {
      // console.log(this.plan_result);
      // console.log(this.plan_result["delay"]);
      const delayObj = this.plan_result["delay"];
      if (delayObj) {
        const values = Object.values(delayObj);
        const sum = values.reduce((a, b) => a + b, 0);
        return sum;
      }
      return 0;
    },
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
};
</script>


<style>
.info-header {
  text-align: center;
  color: #2f74ff;
  font-weight: 1000;
  line-height: 40px;
  border: 2px solid rgb(77, 77, 77);
  margin: 5px;
  border-radius: 5px;
}
.info-box {
  /* height: 80px; */
  /* border: 2px dashed grey; */
  margin: 20px;
  /* border-radius: 10px; */
}

.info-h1 {
  width: min-content;
  white-space: nowrap;
  text-align: center;
  color: #2f74ff;
  font-weight: 750;
  line-height: 20px;
  border: 2px dashed rgb(77, 77, 77);
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
}
.info-h1-flex-text {
  display: flex;
  align-items: center;
}
.info-h2 {
  width: min-content;
  height: min-content;
  white-space: nowrap;
  text-align: center;
  color: #2f74ff;
  background-color: rgb(220, 220, 220);
  /* line-height: 20px; */
  /* border: 2px dashed rgb(77, 77, 77); */
  /* margin: 5px; */
  /* padding: 5px; */
  font-weight: 500;
  border-left: 5px solid rgb(77, 77, 77);
  border-radius: 5px;
  margin: 5px;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 40px;
  margin-right: 5px;
}
.info-h2-flex-text {
  display: flex;
  align-items: center;
  margin: 5px;
}
.info-h2-flex-text-items {
  margin-right: 10px;
  border-bottom: 2px dashed #2f74ff;
}
</style>

<style lang="scss" scoped>
:deep(.user-radio) {
  // ::v-deep .user-radio {
  .el-radio-button__inner {
    color: #ffffff;
    border: 1px solid #ffffff;
    // border-radius: 4px;
    background: #dcdcdc;
  }

  .el-radio-button__original-radio:disabled:checked + .el-radio-button__inner {
    background-color: #2f74ff;
  }
}
</style>