<template>
  <div class="home">
    <el-form labelWidth="200px">
      <el-form-item label="标题">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="项目">
        <el-select
          v-model="form.productId"
          placeholder="请选择"
          @change="changeProduct"
        >
          <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.projectName"
            :value="item.productId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="图片组">
        <div
          v-for="(item,index) in form.list"
          :key="index"
        >
          <el-form-item label="图片标题">
            <el-input v-model="item.name" />
          </el-form-item>
          <el-form-item>
            <el-row :gutter="10">
              <el-col
                v-for="(picture,p_index) in item.pictures"
                :key="p_index"
                :span="3"
              >
                <Card
                  :src="picture.src"
                  :name="picture.name"
                  closeable
                  @handleRemove="removePicture(item.pictures, p_index)"
                />
              </el-col>
              <el-col :span="3">
                <el-button @click="addPicture(item.pictures, index)">添加</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
        <el-button @click="addPictureGroup">添加一组图片</el-button>
      </el-form-item>
    </el-form>

    <picture-selector
      ref="pictureSelector"
      :value="pictureSelectorValue"
      :visible.sync="visible"
      :max="-1"
      @save="savePicture"
    />

  </div>
</template>

<script>
import PictureSelector from '../components/PictureSelector';
import Card from '../components/Card';
import { findProjectBySearch } from '../api/google';
export default {
  name: 'Home',
  components: {
    PictureSelector,
    Card
  },
  data() {
    return {
      projectList: [],
      visible: false,
      pictureSelectorValue: [],
      pictureIndex: 0,
      form: {
        productId: 0,
        title: '',
        list: [
          {
            name: '',
            pictures: []
          }
        ]
      }
    };
  },
  mounted() {
    this.getProjectList();
  },
  methods: {
    async getProjectList() {
      const { status, data } = await findProjectBySearch();
      if (status === '0') {
        console.log(data);
        this.projectList = data;
      }
    },
    removePicture(list, index) {
      list.splice(index, 1);
    },
    addPicture(list, index) {
      this.pictureSelectorValue = list;
      this.pictureIndex = index;
      this.visible = true;
    },
    savePicture(list) {
      this.form.list[this.pictureIndex].pictures = list;
      this.visible = false;
    },
    addPictureGroup() {
      this.form.list.push({
        name: '',
        pictures: []
      });
    },
    changeProduct() {
      if (this.$refs.pictureSelector) {
        this.$refs.pictureSelector.reset();
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>
