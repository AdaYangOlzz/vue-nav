<template>
  <div>
    <ul style="list-style-type: none">
      <li
        v-for="(service, index) in services"
        :key="index"
        style="margin-bottom: 8px"
      >
        <el-radio
          v-model="selected"
          :label="service"
          @change="sendRequest(service)"
          style="--el-radio-font-size: 16px"
          >{{ service }}</el-radio
        >
        <!-- <el-divider /> -->
      </li>
    </ul>

    <el-divider style="margin-top: 30px" />
    <ul style="list-style-type: none">
        <li v-for="(value, key) in urlData">
          <!-- {{ key }}:{{ value }} <br /> -->
          ip_port: {{ key }} <br />
        <li v-for="(v,k) in value">
            {{ k }}: &nbsp;&nbsp;{{ v }}
        </li>
        </li>
        <el-divider style="margin-top: 30px" />
      </ul>  
    </div>
</template>

<script>
export default {
  data() {
    return {
      services: [],
      urlData: null,
      execResult: null,
      selected: null,
    };
  },
  methods: {
    async getServiceList() {
      // const response = await fetch("http://127.0.0.1:5500/get_service_list");
      const response = await fetch("/serv/get_service_list");
      const data = await response.json();
      this.services = data;
      // console.log(this.services);
    },
    async sendRequest(service) {
      const response = await fetch(
        // `http://127.0.0.1:5500/get_execute_url/${service}`
        `/serv/get_execute_url/${service}`
      );
      const data = await response.json();
      this.urlData = data;
      // console.log(data);
    },
    async executeTaskResult() {
      const response = await fetch(
        // "http://127.0.0.1:5500/execute_task/face_detection"
        "/serv/execute_task/face_detection"
      );
      const data = response.json();
      this.execResult = data;
    },
  },
  mounted() {
    this.getServiceList();
    setInterval(this.getServiceList, 20000);
  },
};
</script>
