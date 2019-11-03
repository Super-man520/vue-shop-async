<template>
  <div class="categories">
    <el-button plain type="success" class="addBtn" @click="showAdd">添加分类</el-button>
    <!-- 表格 -->
    <el-table :data="categoriesList" style="100%" border
      :tree-props="{children: 'children',hasChildren: 'hasChildren'}" row-key="cat_id"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, .7)">
      <el-table-column label="分类名称" prop="cat_name"></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot:default="{row}">
          <p>{{row.cat_deleted?'否':'是'}}</p>
        </template>
      </el-table-column>
      <el-table-column label="层级">
        <template v-slot:default="{row}">
          <el-tag type="success" v-if="row.cat_level === 0">一级</el-tag>
          <el-tag type="info" v-if="row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-if="row.cat_level === 2">三级</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button type="primary" icon="el-icon-edit" plain size="small"
           @click="showEdit(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="small"
           @click="deleteCategory(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>
    <!-- 编辑商品的弹框 -->
      <el-dialog title="编辑分类" :visible.sync="editCategory" width="30%" @close="resetEditForm">
        <el-form :model="form" ref="form" :rules="rules" status-icon>
          <el-form-item label="分类名称" prop="cat_name" label-width="120px">
            <el-input v-model="form.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="是否有效" label-width="120px">
            <el-button disabled type="danger">{{cat_deleted?'否':'是'}}</el-button>
          </el-form-item>
        </el-form>
        <template v-slot:footer>
          <div class="dialog-footer">
            <el-button plain type="primary" @click="cancelEdit">取 消</el-button>
            <el-button plain type="success" @click="sureEdit">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    <!-- 添加商品的弹出框 -->
    <el-dialog title="添加分类" :visible.sync="addCategory" width="30%" @close="resetEditForm1">
      <el-form :model="form1" ref="form1" :rules="rules" status-icon>
        <el-form-item label="分类名称" prop="cat_name" label-width="120px">
          <el-input v-model="form1.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" label-width="120px">
          <div class="block">
            <el-cascader @change="handleAdd"
              v-model="form1.cat_pid"
              :options="options"
              :props="props"
              clearable></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button plain type="primary" @click="cancelAdd">取 消</el-button>
          <el-button plain type="success" @click="sureAddCategory">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      loading: false,
      id: '',
      categoriesList: [],
      pagenum: 1,
      pagesize: 5,
      totalPage: null,
      editCategory: false,
      addCategory: false,
      form: {
        cat_name: ''
      },
      form1: {
        cat_name: '',
        cat_pid: '',
        cat_level: ''
      },
      cat_deleted: '',
      rules: {
        cat_name: [
          { required: true, message: '请输入完整内容', trigger: ['blur', 'change'] },
          { min: 5, max: 12, message: '字符在5 ~ 12之间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getCategoriesList()
  },
  methods: {
    async getCategoriesList () {
      this.loading = true
      const res = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(res)
      const { data, meta } = res
      if (meta.status === 200) {
        this.categoriesList = data.result
        this.totalPage = data.total
        this.loading = false
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 分页
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagenum = 1
      this.pagesize = val
      this.getCategoriesList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getCategoriesList()
    },
    // 编辑分类
    showEdit (row) {
      // console.log(row)
      this.editCategory = true
      this.cat_deleted = row.cat_deleted
      this.form.cat_name = row.cat_name
      this.id = row.cat_id
    },
    resetEditForm () {
      this.$refs.form.resetFields()
    },
    cancelEdit () {
      this.editCategory = false
    },
    async sureEdit () {
      try {
        await this.$refs.form.validate()
        const res = await this.$axios.put(`categories/${this.id}`, this.form)
        console.log(res)
        this.editCategory = false
      } catch (e) {
        console.log(e)
      }
    },
    // 删除分类
    deleteCategory (row) {
      console.log(row)
      this.id = row.cat_id
      this.$confirm('你确定要删除么?此操作不可恢复', '友情提示', {
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`categories/${this.id}`).then(res => {
          // console.log(res)
          const { meta } = res
          if (meta.status === 200) {
            if (this.pagenum > 1 && this.categoriesList.length === 1) {
              this.pagenum--
            }
            this.$message.success(meta.msg)
            this.getCategoriesList()
          } else {
            this.$message.error(meta.msg)
          }
        })
      }).catch((e) => {
        console.log(e)
      })
    },
    // 添加分类  0 1 2二级即type=2
    async showAdd () {
      const res = await this.$axios.get('categories?type=2')
      this.addCategory = true
      // console.log(res)
      const { data, meta } = res
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    resetEditForm1 () {
      this.$refs.form1.resetFields()
    },
    handleAdd (value) {
      // console.log(value)
      // console.log(value.length)
      // console.log(value[value.length - 1])
      // 分类父id 即cat_pid取数组最后一项 0标识没有
      // 层级cat_level即cat_pid的长度
      this.form1.cat_pid = value[value.length - 1] || 0
      this.form1.cat_level = value.length
    },
    async sureAddCategory () {
      // 校验
      try {
        await this.$refs.form1.validate()
        const res = await this.$axios.post('categories', this.form1)
        // console.log(res)
        const { meta } = res
        if (meta.status === 201) {
          this.getCategoriesList()
          this.addCategory = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    cancelAdd () {
      this.addCategory = false
    }
  }
}
</script>

<style lang="less" scoped>
 .addBtn {
   margin: 15px 0;
 }
</style>
