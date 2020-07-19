<template>
  <div
    class="rel-infinite-list-wrapper"
    :style="{height: height}"
  >
    <div
      v-infinite-scroll="load"
      infinite-scroll-disabled="disabled"
      v-bind="$attrs"
    >
      <slot :list="list" />
    </div>
    <div
      v-if="loading"
      class="rel-infinite-list__operation"
    >
      <slot name="loading">
        <span class="rel-infinite-list__operation__text">加载中...</span>
      </slot>
    </div>
    <div
      v-if="noMore"
      class="rel-infinite-list__operation"
    >
      <slot name="noMore">
        <span class="rel-infinite-list__operation__text">没有更多了</span>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RelInfiniteScrollContainer',
  props: {
    // 列表数据
    list: {
      type: Array,
      default: () => []
    },
    // 总数
    total: {
      type: Number,
      default: 0
    },
    // 加载中
    loading: {
      type: Boolean,
      default: false
    },
    // 容器高度
    height: {
      type: String,
      default: '500px'
    }
  },
  computed: {
    noMore() {
      return this.list.length >= this.total && !this.loading;
    },
    disabled() {
      return this.loading || this.noMore;
    }
  },
  methods: {
    load() {
      this.$emit('load');
    }
  }
};
</script>

<style lang="scss" scoped>
.rel-infinite-list-wrapper {
  overflow-y: auto;
}
.rel-infinite-list__operation {
  padding: 20px;
  text-align: center;
}
.rel-infinite-list__operation__text {
  font-size: 16px;
  color: #666;
}
</style>
