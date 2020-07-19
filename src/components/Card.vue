<template>
  <div
    class="card-wrapper"
    :class="[fit, { active: active }]"
    :style="{width: width}"
    @click="handleClick"
  >
    <div
      v-lazy:background-image="src"
      class="image"
    />
    <p
      class="name"
      :title="name"
    >{{ name }}</p>
    <i
      v-if="closeable"
      class="close-btn"
      @click.stop="handleRemove"
    />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: false
    },
    closeable: {
      type: Boolean,
      default: false
    },
    fit: {
      type: String,
      default: 'cover'
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  methods: {
    handleRemove() {
      this.$emit('handleRemove');
    },
    handleClick() {
      this.$emit('handleClick');
    }
  }
};
</script>

<style lang="scss" scoped>
.card-wrapper {
  box-sizing: border-box;
  height: auto;
  border-radius: 4px;
  border: 4px solid #fff;
  overflow: hidden;
  position: relative;
  transition: 0.3s;
  margin-bottom: 10px;
  .image {
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    border-radius: 4px;
    overflow: hidden;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .image[lazy="loading"] {
    background-color: transparent;
    background-size: cover;
    cursor: default;
  }
  .image[lazy="error"] {
    background-color: transparent;
    background-size: cover;
    cursor: default;
  }
  .image[lazy="loaded"] {
    background-color: #111;
    cursor: default;
    transition: 0.2s;
    // &:hover {
    //   transform: scale(1.05);
    // }
  }
  &.contain {
    .image[lazy="loaded"] {
      background-size: contain;
    }
  }
  &.cover {
    .image[lazy="loaded"] {
      background-size: cover;
    }
  }
  .name {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 6px 5px 3px 5px;
    border-radius: 0 0 4px 4px;
    background-image: linear-gradient(to top, #000, transparent);
    font-size: 12px;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.6;
  }
  &.active {
    border: 4px solid red;
  }
  .close-btn {
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.3s;
    opacity: 0.6;
    cursor: pointer;
    border-radius: 0 4px 0 0;
    overflow: hidden;
    &::after {
      content: "";
      display: block;
      width: 24px;
      height: 24px;
      background-size: cover;
      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABeUlEQVRIS7XWMUvDQBQH8P+r5tKiqyBCrg4OgpODWwdFcbFdO7hFN8FNREcXRdycxUFwcXZxccmui9Kki/g1FO/JxTTUkGuM6WUKJHm/9+7dO0KhFAyLF4WeeAdB2jIolG4AcMse4IlbELatAT0pzgg4sgZEcrLFqAXWAB24qNEMnBDwCuAuJ5EumPdAtJqXJCXABQgHpip08BrQ/QKWMkg3+SYPjh/FQM9zN4n4YdQy5SCFwVNA30RSPDGwXALRrxozH8SJK9BXX7r7CnxpDXiZwfREQzwTsGBoVrYP5ZYoWaZjBk6zQOUmDwK+zU/NfqjPgDNVVN6mwxn3m+6WYr4f1+ClTR4OGDadXTBdjQPJBeLhk+IQwHlVxAj8TLjjg+i6CjISiJFmfQ2sHv+LFALx9vWcFSa6AbBYFvoToIMmW9hXwI5pGA0DWi4nPfGi4foM9ovOrl+HXTkmPb/aDHQY3AYwN5YKTIlEsr6uoDaIIUEkwSz138o35edyoXtIO24AAAAASUVORK5CYII=");
    }
    &:hover {
      opacity: 1;
    }
  }
}
</style>
