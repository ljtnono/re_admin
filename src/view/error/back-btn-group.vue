<template>
  <div>
    <el-button size="large" type="text" @click="backHome">返回首页</el-button>
    <el-button size="large" type="text" @click="backPrev">返回上一页({{ second }}s)</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

defineOptions({ name: "BackBtnGroup" });

const router = useRouter();

const second = ref(5);
let timer = null;

const backHome = () => {
  router.replace({
    name: "Workspace"
  });
};

const backPrev = () => {
  router.go(-1);
};

onMounted(() => {
  timer = setInterval(() => {
    if (second.value === 0) backPrev();
    else second.value--;
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>
