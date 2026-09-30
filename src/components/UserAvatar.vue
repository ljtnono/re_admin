<template>
  <img v-if="avatarSrc && !loadFailed" class="user-avatar" :src="avatarSrc" :alt="name || '用户头像'" :style="styleObj" @error="loadFailed = true"/>
  <div v-else class="user-avatar user-avatar--fallback" :style="styleObj">{{ initial }}</div>
</template>

<script setup>
import {computed, ref, watch} from "vue";

const props = defineProps({
  // 头像地址，为空或加载失败时展示用户名首字母纯色背景
  src: {type: String, default: null},
  // 用户名（用于生成首字母与背景色）
  name: {type: String, default: ""},
  // 头像尺寸（px）
  size: {type: [Number, String], default: 40}
});

// 默认头像背景色板：按用户名哈希取色，同一用户颜色固定
const PALETTE = ["#409eff", "#67c23a", "#e6a23c", "#f56c6c", "#9b59b6", "#16a085", "#d35400", "#2ecc71", "#e74c3c", "#909399"];

const avatarSrc = computed(() => (props.src ? props.src : null));
// 头像加载失败（如地址失效）时也回退到首字母头像
const loadFailed = ref(false);
watch(avatarSrc, () => {
  loadFailed.value = false;
});

const initial = computed(() => (props.name ? props.name.trim().charAt(0).toUpperCase() : "用"));

const bgColor = computed(() => {
  const key = props.name || "";
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
});

const styleObj = computed(() => ({
  width: props.size + "px",
  height: props.size + "px",
  fontSize: Math.round(Number(props.size) * 0.42) + "px",
  ...(avatarSrc.value && !loadFailed.value ? {} : {backgroundColor: bgColor.value})
}));
</script>

<style scoped>
.user-avatar {
  border-radius: 50%;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
}

.user-avatar--fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 600;
  line-height: 1;
  user-select: none;
}
</style>
