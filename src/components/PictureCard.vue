<template>
  <div
    class="card-wrapper"
    :class="[fit, { active: relChecked, video: video }]"
    @click="handleView"
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
      v-if="checkable"
      class="check-btn"
      @click.stop="handleCheck"
    />
    <i
      v-if="closeable"
      class="close-btn"
      @click.stop="handleClose"
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
    video: {
      type: String,
      default: ''
    },
    checkable: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    },
    closeable: {
      type: Boolean,
      default: false
    },
    fit: {
      type: String,
      default: 'contain'
    }
  },
  data() {
    return {
      relChecked: false
    };
  },
  watch: {
    checked: {
      handler: function(val) {
        if (this.relChecked !== val) this.relChecked = val;
      },
      immediate: true
    },
    relChecked(val) {
      this.$emit('update:checked', val);
    }
  },
  methods: {
    handleCheck() {
      if (this.checkable) {
        this.relChecked = !this.relChecked;
        this.$nextTick(() => {
          this.$emit('handleCheck', this.relChecked);
        });
      }
    },
    handleClose() {
      this.$emit('handleClose');
    },
    handleView() {}
  }
};
</script>

<style lang="scss" scoped>
.card-wrapper {
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  position: relative;
  transition: 0.3s;
  &.video {
    // &::after {
    //   content: "";
    //   width: 32px;
    //   height: 32px;
    //   background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACgklEQVRYR+2XS4hOYRjHf/+NkrKRhcuSFGJDFu7lskG5zYINGyVhIRsWlMxOzZBkNlZmYVwKpVi4DCs2hMgsXZbKjtJfT71Hxzfn8p3zmSblqbM673mf//vc3t8Rk2yaZP/8WwJsLwFWA7uA2cCsFMEvwGfgOjAq6VW3ke0qArbD6VFgJ/AmOQqH8YSFmHhC2CLgBjAoabROSK0A2+eBw8AdYEjS3apNbW8BDgBbgQuSjlStrxRg+wMwD+iTNFJ3mvx727uBa8CYpPll35YKsP0UWBkhlfS2ifNsre2FKWXPJK0q2qNQgO2zwAlgrqRPbZznRMwBPgL9kk527jVOQCq4J8AOSbd6cZ4TsR24CazpLMwiAdFKUyRtK3Juex0wVdK9JuJs3wZ+SIpO+W1/CLC9DHgeFVxW7bZPA6eAYWBAUqyvtdQd0UnLJb3IPugUEHnfX1W1ScBa4CsQURpIQiLPlZa66oqk/jIBD4HHkuKUhZYJkLTe9grgMjAjJ+RnN9+WCXgPnJM01GQT2/uAGFjvUjQiPePMdgyoY5IWlAn4Buypmnb5COQ92J6WauM4MCKpr1NBqoNhSdMnQkBsegaI0fsoUtRGQNsUxKmjM2JiRme0TkHTItwctx4Q4c+6oaciPAQclLS4rgiB78CGhm34Grgk6WJZDQRwvJzgQbQ0DyxtR/HMFtdz/SiOsOQuo8YMUJG2jA3qL6MkIqOg1iyQickxQSEdVQFJRkOtmcB2xgKlVFSHZBkVNWYD2xkDlNJQRKkbKM3oqA2UFlJQvlZqBeQKM8PyMeBqQvJOLN+bIPbvYXnHhRPAsgnYWPJj8gC4nweOOkboKgJ1m/Ty/r+AX+d/VDC/j6BSAAAAAElFTkSuQmCC");
    //   position: absolute;
    //   z-index: 9;
    //   left: 50%;
    //   top: 50%;
    //   transform: translate3d(-50%,-50%,0);
    // }
  }
  .image {
    width: 100%;
    height: 100%;
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
  .check-btn {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 9999;
    cursor: pointer;
    // &::after {
    //   content: "";
    //   display: block;
    //   width: 24px;
    //   height: 24px;
    //   background-size: cover;
    //   background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAw0lEQVRIS7XUzQ1CIQwH8BaYwyk8OYA3r67jcwiXeFfdAldqajDB8J58Q7kS/r82bUBr7YKINxA66HIlkS8gifwAKWQDSCB/wCjCzPdwaaJAL+LClVJPZn772SaBCuQKAKsPioW7uyyQQ4joorU+AMADERcAeIWVV3VQWmEiOhljzqnwqg5KCCIeY5U3dVBCcr9McQb7x63fSjNQsV2bmrqAFqQbqEWGgBpkGCghU4AcMg1IIVOBGDId2CMiQIiIAR75AEgwet/Jp7kGAAAAAElFTkSuQmCC");
    // }
  }
  &.active {
    .check-btn {
      border: 4px solid red;
      left: -3px;
      right: -3px;
      top: -3px;
      bottom: -3px;
      border-radius: 4px;
      // &::after {
      //   background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAzUlEQVRIS7XVyxHCIBAG4F2wDqvwlAJy82oJtmEswia8agO525KsgzM4SIDltblm8n+7sBA8r9OCCBcQetDmSiJfQBL5AVLIHyCBbIBehAiu/tBEgVbEhmulHobMy+1tEuAQQjoh4d0FxcLtuyyQQ/BNR9rhHghuhLBoUE+/8qIO2BE2MJGGORVe1AGHKFSHWOVVHXBI7pZh9yD8uPZaqQa46QoLagJqkGagFOkCSpBugEOGANkTP/JPGRvhYR2kDuNwIFwuEcBHxACHfADmw2PIJnlNHQAAAABJRU5ErkJggg==");
      // }
    }
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
