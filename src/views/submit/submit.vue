import Vue from 'vue';
<script>
import { ElMessage } from "element-plus";

export default {
  data() {
    return {
      info: {
        "<ip>:<port>": {
          video: {
            "<vid_0>": {
              type: "<description>",
            },
            "<vid_1>": {
              type: "<description>",
            },
          },
        },
      },
      selected: null,
      submit_jobs: [],
      inputText: `{
    "node_addr": "xxx.xxx.xxx.xxx:xxxx",
    "video_id": xxx,
    "dag": {
        "generator": "SingleFrameGenerator",
        "flow": ["SingleFrameGenerator", "face_detection", "face_alignment"],
        "input": {
            "face_detection": {
                "image": "SingleFrameGenerator.image"
            },
            "face_alignment": {
                "image": "SingleFrameGenerator.image",
                "bbox": "face_detection.bbox",
                "prob": "face_detection.prob"
            },
            "Render": {
                "image": "face_alignment.image",
                "count": "face_alignment.count_result"
            }
        }
    }
}`,
      uploadSuccess: false,
      sendUrl: "",
      isSubmit: false,
    };
  },
  methods: {
    selectItem(item) {
      console.log(item);

      this.selected = item.key;
      const ip = item.key.split("-")[0];
      const videoId = item.key.split("-")[1];
      this.inputText = `{
    "node_addr": "${ip}",
    "video_id": ${videoId},
    "dag": {
        "generator": "SingleFrameGenerator",
        "flow": ["SingleFrameGenerator", "face_detection", "face_alignment"],
        "input": {
            "face_detection": {
                "image": "SingleFrameGenerator.image"
            },
            "face_alignment": {
                "image": "SingleFrameGenerator.image",
                "bbox": "face_detection.bbox",
                "prob": "face_detection.prob"
            },
            "Render": {
                "image": "face_alignment.image",
                "count": "face_alignment.count_result"
            }
        }
    }
}`;

      // this.sendUrl = "http://127.0.0.1:5000/user/submit_job";
      // this.sendUrl = "http://114.212.81.11:5000/user/submit_job";
      this.sendUrl = "/dag/user/submit_job";

      // console.log(this.sendUrl)
    },
    getInfo() {
      // fetch("http://127.0.0.1:5000/node/get_all_status")
      // fetch("http://114.212.81.11:5000/node/get_all_status")
      fetch("/dag/user/get_all_status")
        .then((response) => response.json())
        .then((data) => {
          // console.log(data)
          this.info = data["data"];
        })
        .catch((error) => {
          console.error(error);
          sessionStorage.clear();
          // Update submit_jobs array
          this.submit_jobs = [];
          // Update sessionStorage
          sessionStorage.setItem(
            "submit_jobs",
            JSON.stringify(this.submit_jobs)
          );
        });
    },
    submitText() {
      let text = this.inputText.replace(/[\r\n\s]/g, ""); // remove all newlines and spaces
      // console.log(JSON.stringify(text))
      fetch(this.sendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: text,
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data.job_uid);
          if (data.job_uid === "GLOBAL_ID_1.SUB_ID") {
            sessionStorage.clear();

            this.submit_jobs = [];
            sessionStorage.setItem(
              "submit_jobs",
              JSON.stringify(this.submit_jobs)
            );
          }
          this.submit_jobs.push(data.job_uid);
          console.log(this.submit_jobs);
          sessionStorage.setItem(
            "submit_jobs",
            JSON.stringify(this.submit_jobs)
          ); // 将 submit_jobs 存储在 sessionStorage 中

          this.uploadSuccess = true;
          this.isSubmit = true;
          ElMessage({
            message: "上传成功",
            showClose: true,
            type: "success",
            duration: 1500,
          });
        })
        .catch((error) => {
          console.error(error);
          ElMessage.error("上传失败");
        });
      // console.log(this.inputText)
      // console.log(JSON.stringify(text) )
    },
  },
  mounted() {
    const submitJobs = sessionStorage.getItem("submit_jobs");
    if (submitJobs) {
      this.submit_jobs = JSON.parse(submitJobs);
    }
    this.getInfo();
    // setInterval(() => {
    //     this.getInfo();
    // }, 200000);
  },
  // created() {
  //     // 在组件创建时，创建一个新的Vue实例
  //     this.eventBus = new Vue();
  // }
};
</script>

<template>
  <!-- <div> -->
  <!-- <div style="display: flex; flex-direction: column; align-items: center;"> -->
  <div class="available-node-header" style="width: 45%; margin-left: 30px">
    选择视频流
  </div>

  <div
    style="display: flex; margin-left: 30px; overflow: scroll; height: 500px"
  >
    <div style="width: 45%; height: 90%; overflow: scroll">
      <div v-for="(value, node_addr) in info" :node_addr="node_addr">
        <div
          class="available-node"
          v-for="(v, video_id) in value.video"
          v-on:click="selectItem({ key: node_addr + '-' + video_id })"
        >
          <ul
            style="list-style-type: none"
            v-bind:class="{ selected: selected === node_addr + '-' + video_id }"
          >
            <li class="subli">Addr: {{ node_addr }}</li>
            <li class="subli">VideoID: {{ video_id }}</li>
            <li class="subli">Description: {{ v.type }}</li>
          </ul>
        </div>
        <!-- <el-radio-group v-model="selected" @change="selectItem({key: selected})">
                            <li v-for="(v,k) in value.video">
                                <el-radio style="--el-radio-font-size:16px" :label="key + '-' + k">{{key}}--video{{ k }}:  {{ v.type }}</el-radio><br/>
                            </li>
                        </el-radio-group> -->
      </div>
    </div>

    <div style="width: 5%"></div>

    <div style="width: 45%">
      <el-input
        v-model="inputText"
        type="textarea"
        :rows="20"
        :cols="30"
      ></el-input>
      <div>
        <div
          style="
            display: inline-block;
            text-align: right;
            margin-top: 20px;
            margin-right: 20px;
          "
        >
          <el-button type="primary" plain @click="submitText">Submit</el-button>
        </div>

        <!-- <div style="display: inline-block; margin-left: 20px">
          <el-alert
            v-if="uploadSuccess && isSubmit"
            style="margin-top: 20px; max-width: 500px"
            title="上传成功"
            type="success"
            show-icon
            :closable="true"
            :duration="2000"
          ></el-alert>
          <el-alert
            v-if="!uploadSuccess && isSubmit"
            style="margin-top: 20px; max-width: 500px"
            title="上传失败"
            type="error"
            show-icon
            :closable="true"
            :duration="2000"
          ></el-alert>
        </div> -->
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<style>
::-webkit-scrollbar {
  display: none;
}
.available-node-header {
  text-align: center;
  font-weight: 1000;
  line-height: 40px;
  border: 2px solid grey;
  margin: 5px;
  border-radius: 10px;
}
.available-node {
  height: 80px;
  border: 2px dashed grey;
  margin: 5px;
  border-radius: 10px;
}
ul {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  margin-left: 10px;
  overflow-y: scroll;
}
.subli {
  margin: 0px;
  height: 20px;
  padding: 0px;
}
.selected {
  color: #409eff;
}
</style>


