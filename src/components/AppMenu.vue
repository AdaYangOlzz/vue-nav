<template>
  <div class="logo" style="display: flex; justify-content: center">
    <img
      src="./icon/logo5.png"
      alt="Logo"
      style="max-width: 100%; height: auto"
    />
  </div>

  <el-menu
    default-active="2"
    :collapse="props.isCollapse"
    :collapse-transition="false"
    @open="handleOpen"
    @close="handleClose"
    background-color="#ebf1f5"
    text-color="#606266"
    active-text-color="#2F74FF"
    class="menu"
    router
  >
    <!-- <el-sub-menu index="1">
        <template #title>
          <el-icon><location /></el-icon>
          <span>Navigator One</span>
        </template>
        <el-menu-item-group>
          <template #title><span>Group One</span></template>
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item two</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="Group Two">
          <el-menu-item index="1-3">item three</el-menu-item>
        </el-menu-item-group>
        <el-sub-menu index="1-4">
          <template #title><span>item four</span></template>
          <el-menu-item index="1-4-1">item one</el-menu-item>
        </el-sub-menu>
      </el-sub-menu> -->
    <el-menu-item index="/install">
      <el-icon><document /></el-icon>
      <template #title>安装服务</template>
    </el-menu-item>
    <el-menu-item index="/submit">
      <el-icon><icon-menu /></el-icon>
      <template #title>提交任务</template>
    </el-menu-item>

    <el-menu-item index="/result">
      <el-icon><setting /></el-icon>
      <template #title>查看结果</template>
    </el-menu-item>
    <el-menu-item index="/service">
      <el-icon><Operation /></el-icon>
      <template #title>已装载服务</template>
    </el-menu-item>
  </el-menu>
</template>
  
  <script lang="ts" setup>
import { ref } from "vue";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  Operation,
} from "@element-plus/icons-vue";
// import router from '@/router/router'

const props = defineProps(["isCollapse"]);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>
  
  <style>
.logo {
  height: 80px;
  background: #e1eaf4;
}
.menu {
  min-height: calc(100vh - 80px);
}
</style>

