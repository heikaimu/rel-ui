<template>
  <el-dialog
    :visible.sync="isVisible"
    width="90%"
    title="图片选择"
  >
    <el-row
      :gutter="10"
      class="custom-picture-selector"
    >
      <el-col :span="16">
        <rel-infinite-scroll-container
          :list="list"
          :total="total"
          :loading="loading"
          height="500px"
          @load="loadList"
        >
          <div
            slot-scope="scope"
            class="picture-selector__list"
          >
            <el-row
              :gutter="10"
            >
              <el-col
                v-for="(item,index) in scope.list"
                :key="index"
                :span="4"
              >
                <Card
                  :src="item.src"
                  :name="item.name"
                  :active="item.active"
                  @handleClick="handleCheckedCardChange(item, index)"
                />
              </el-col>
            </el-row>
          </div>
          <span
            slot="loading"
          ><i class="el-icon-loading" /> 加载中...</span>
        </rel-infinite-scroll-container>
      </el-col>
      <el-col :span="8">
        <div class="picture-selector__list">
          <rel-infinite-scroll-container
            :list="selectedList"
            height="500px"
          >
            <div
              slot-scope="scope"
              class="picture-selector__list"
            >
              <el-row
                :gutter="10"
              >
                <el-col
                  v-for="(item,index) in scope.list"
                  :key="index"
                  :span="8"
                >
                  <Card
                    :src="item.src"
                    :name="item.name"
                    closeable
                    @handleRemove="$_removeItem(item, index)"
                  />
                </el-col>
              </el-row>
            </div>
            <span
              slot="loading"
            ><i class="el-icon-loading" /> 加载中...</span>
          </rel-infinite-scroll-container>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="footer-operations">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >已选 {{ checkedCount }} / {{ list.length }}</el-checkbox>
          <el-button
            type="primary"
            @click="saveList"
          >保 存</el-button>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import Card from './Card';
import { myPictures } from '../api/material';
export default {
  components: {
    Card
  },
  props: {
    // 当前列表值
    value: {
      type: Array,
      default: () => []
    },
    // 接口请求的特殊参数，本项目主要是产品ID和状态
    params: {
      type: Object,
      default: () => {}
    },
    // 可以选择的最大数量, 如果是-1则不做限制
    max: {
      type: Number,
      default: -1
    },
    // 显示
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rowKey: 'id',
      selectedList: [],
      pageNum: 1,
      pageSize: 40,
      list: [],
      total: 0,
      loading: false,
      // 是否失效
      didInvalidate: true,
      // 是否全选
      checkAll: false,
      // 是选择了部分
      isIndeterminate: false
    };
  },
  computed: {
    /*
      当前选中的数量
      不能使用selectedList的数据，因为其中可能包含不是改列表里面的数据
      筛选存同时存在列表里的数据的长度
    */
    checkedCount() {
      const ids = this.list.map(item => item[this.rowKey]);
      return this.selectedList.filter(item => ids.includes(item[this.rowKey])).length;
    },
    // 显示
    isVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },
  watch: {
    // 初始化选中项
    value: {
      handler: function(newVal) {
        this.selectedList = newVal.slice();
      },
      immediate: true
    },
    /*
      监听显示，如果是打开，并且数据是失效的，则重新列表信息并且拉取列表，并且设置失效为false
    */
    isVisible(val) {
      if (val && this.didInvalidate) {
        this.didInvalidate = false;
        this.pageNum = 1;
        this.list = [];
        this.total = 0;
        this.loadList();
      }
    },
    // 当选中列表变化的时候修改列表选中状态以及全选框状态
    selectedList() {
      this.$nextTick(() => {
        this.$_setListActiveStatus();
        this.$_setCheckboxStatus();
      });
    },
    // 当列表变化的时候修改列表选中状态以及全选框状态
    list() {
      this.$nextTick(() => {
        this.$_setListActiveStatus();
        this.$_setCheckboxStatus();
      });
    }
  },
  methods: {
    // 获取数据添加进列表中
    async loadList() {
      this.loading = true;
      const pageList = await this.$_getList();
      if (!pageList) return;

      this.list.push(...pageList);
      this.pageNum += 1;
      this.loading = false;
    },
    // 单选卡片点击
    handleCheckedCardChange(item, index) {
      if (item.active) {
        // 取消选中
        this.$_removeItem(item);
      } else {
        // 特殊情况，如果为1，先清空，再选中点击的
        if (this.max === 1) {
          this.empty();
          this.$_addItem(item);
          return;
        }
        // 当前选中项>=最大可选数
        if (this.max !== -1 && (this.checkedCount >= this.max)) {
          this.$message.error(`最多可选数量为${this.max}，当前已达上限`);
          return;
        }
        // 一般情况选中
        this.$_addItem(item);
      }
    },
    // 全选按钮点击
    handleCheckAllChange(val) {
      if (val) {
        this.list.forEach(item => {
          this.$_addItem(item);
        });
      } else {
        this.empty();
      }
    },
    /*
      遍历列表，设置每一项的状态为未选中
      清空选中项
    */
    empty() {
      this.selectedList = [];
    },
    // 保存数据
    saveList() {
      const newList = this.selectedList.slice();
      this.$nextTick(() => {
        this.$emit('save', newList);
      });
    },
    // 重置
    reset() {
      this.didInvalidate = true;
    },
    // 获取当前页的数据
    async $_getList() {
      const list = [];
      const { status, data, page } = await myPictures({
        ...this.params,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      if (status === '0') {
        this.total = page.total;
        data.forEach(group => {
          group.forEach(item => {
            list.push({
              type: 'image',
              id: item.id,
              name: item.assetName,
              src: item.picUrl,
              form: 'db'
            });
          });
        });
      }
      return list;
    },
    /*
      如果选中项中没有点击项，则添加点击项
      设置点击项的状态为选中
    */
    $_addItem(data) {
      if (this.selectedList.find(item => item[this.rowKey] === data[this.rowKey])) {
        return;
      }
      this.selectedList.push(data);
    },
    /*
      删除选中rowKey匹配的元素
      设置列表里rowKey匹配的元素状态为未选中
    */
    $_removeItem(data) {
      const sIndex = this.selectedList.findIndex(item => item[this.rowKey] === data[this.rowKey]);
      if (sIndex === -1) return;
      this.selectedList.splice(sIndex, 1);
    },
    /*
      如果当前列表的数据长度等于选中项的长度，全选为true
      如果当前选中项大于0小于列表的数据长度，糊状态为true
    */
    $_setCheckboxStatus() {
      this.checkAll = this.list.length === this.checkedCount;
      this.isIndeterminate = this.checkedCount > 0 && this.checkedCount < this.list.length;
    },
    /*
      根据selectedList来设置list的选中状态
    */
    $_setListActiveStatus() {
      const selectedRowKeyList = this.selectedList.map(item => item[this.rowKey]);
      this.list.forEach(item => {
        this.$set(item, 'active', selectedRowKeyList.includes(item[this.rowKey]));
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.picture-selector__list {
  margin: 0 10px;
}
.footer-operations {
  padding: 20px 10px 0 10px;
  border-top: 1px solid #f2f2f2;
  display: flex;
  justify-content: space-between;
  align-items: center
}
</style>
