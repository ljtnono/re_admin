<template>
  <div class="content pr">
    <error-content code="404" desc="Oh~~您的页面好像飞走了~" :src="src" />
  </div>
</template>

<script setup>
import error404 from "@a/images/error-page/error-404.svg";
import ErrorContent from "./error-content.vue";

defineOptions({ name: "NotFound" });

const src = error404;
</script>
