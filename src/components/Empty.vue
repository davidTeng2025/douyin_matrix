<template>
  <div class="empty-wrapper">
    <van-empty :description="description" v-bind="$attrs" />
  </div>
</template>

<script setup>
defineProps({
  description: {
    type: String,
    default: "暂无数据",
  },
});
</script>

<style scoped lang="less">
.empty-wrapper {
  width: 100%;
  height: 18.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style> 