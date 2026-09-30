<template>
  <error-content code="401" desc="Oh~~您没有浏览这个页面的权限~" :src="src" />
</template>

<script setup>
import error401 from "@a/images/error-page/error-401.svg";
import ErrorContent from "./error-content.vue";

defineOptions({ name: "Unauthorized" });

const src = error401;
</script>
