<template>
  <div class="goods-add">
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- 侧边 -->
    <el-tabs tab-position="left" style="height: 200px;" v-model="name" @tab-click="handleName">
      <el-tab-pane label="基本信息" name="0">
        <el-form :model="form" :rules="rules" ref="form" status-icon>
          <el-form-item label="商品名称" prop="goodsName" label-width="120px">
            <el-input placeholder="请输入商品名称" v-model="form.goodsName"></el-input>
          </el-form-item>
           <el-form-item label="商品价格" prop="goodsPrice" label-width="120px">
            <el-input placeholder="请输入商品价格" v-model="form.goodsPrice"></el-input>
          </el-form-item>
           <el-form-item label="商品重量" prop="goodsWeight" label-width="120px">
            <el-input placeholder="请输入商品重量" v-model="form.goodsWeight"></el-input>
          </el-form-item>
           <el-form-item label="商品数量" prop="goodsNumber"  label-width="120px">
            <el-input placeholder="请输入商品数量" v-model="form.goodsNumber"></el-input>
          </el-form-item>
           <el-form-item label="商品分类"  label-width="120px">
            <div class="block">
              <el-cascader
                clearable  @change="handleNodes"
                v-model="form.goods_cat"
                :options="options"
                :props="props"></el-cascader>
            </div>
          </el-form-item>
        </el-form>
        <el-button type="success" plain @click="nextStep">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="1">
        <el-upload
          multiple  name="file"  :on-success="successFile"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"   :headers="headers"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-button type="success" plain @click="nextStep">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="2">
        <quill-editor  ref="myTextEditor"
              v-model="form.goods_introduce"
              @change="onEditorChange($event)">
        </quill-editor>
        <el-button type="success" plain @click="addGoods">完 成</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      name: '0',
      form: {
        goodsName: '',
        goodsPrice: '',
        goodsWeight: '',
        goodsNumber: '',
        goods_cat: [],
        pics: [],
        goods_introduce: ''
      },
      rules: {
        goodsName: [
          { required: true, message: 'error goodsName', trigger: ['blur', 'change'] }
        ],
        goodsPrice: [
          { required: true, message: 'error goodsPrice', trigger: ['blur', 'change'] }
        ],
        goodsWeight: [
          { required: true, message: 'error goodsWeight', trigger: ['blur', 'change'] }
        ],
        goodsNumber: [
          { required: true, message: 'error goodsNumber', trigger: ['blur', 'change'] }
        ]
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      dialogImageUrl: '',
      dialogVisible: false,
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  // 进入页面即要发送ajax
  async created () {
    const res = await this.$axios.get('categories?type=3')
    // console.log(res)
    const { data, meta } = res
    if (meta.status === 200) {
      this.options = data
    } else {
      this.$message.error(meta.msg)
    }
  },
  // computed: {
  //   editor () {
  //     return this.$refs.myTextEditor.quillEditor
  //   }
  // },
  methods: {
    nextStep () {
      this.active++
      this.name = this.active + ''
    },
    handleName () {
      this.active++
      this.active = +this.name
    },
    // 选中节点
    handleNodes (value) {
      console.log(value)
      this.form.goods_cat = this.form.goods_cat.join(',')
    },
    // getCheckedNodes (value) {
    //   console.log(value)
    // },
    // 图片上传
    handleRemove (file, fileList) {
      // console.log(file)
      // console.log(this.form.pics)
      const { meta, data } = file.response
      if (meta.status === 200) {
        this.$message.warning('success deleted')
        const tmpPath = data.tmp_path
        this.form.pics = this.form.pics.filter(item => item.pic !== tmpPath)
        // console.log(this.form.pics)
      } else {
        this.$message.error(meta.msg)
      }
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    successFile (response, file, fileList) {
      // console.log(response)
      // console.log(file)
      // console.log(fileList)
      const { data, meta } = response
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.form.pics.unshift({ pic: data.tmp_path })
        // console.log(this.form.pics)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 富文本编辑
    onEditorChange ({ html, text }) {
      console.log('editor change!', html, text)
      // this.form.goods_introduce = html
    },
    // 添加商品
    async addGoods () {
      try {
        await this.$refs.form.validate()
        const res = await this.$axios.post('goods', this.form)
        console.log(res)
      } catch (e) {
        console.log(e)
        this.$message.error('请输入正确内容')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .el-tabs {
    height: auto !important;
    padding-right: 20px;
    margin: 20px 0;
  }
</style>
<style lang="less">
  .ql-container {
    height: 300px;
    background-color: #fff;
    margin-bottom: 10px;
  }
</style>
