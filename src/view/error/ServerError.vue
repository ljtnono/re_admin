<template>
  <error-content code="500" desc="Oh~~鬼知道服务器经历了什么~" :src="src" />
</template>

<script setup>
import error500 from "@a/images/error-page/error-500.svg";
import ErrorContent from "./error-content.vue";

defineOptions({ name: "ServerError" });

const src = error500;
</script>
