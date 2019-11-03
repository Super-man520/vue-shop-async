<template>
  <div class="goods">
    <el-button type="success" plain class="addGoodsBtn" @click="goGoodsAdd">添加商品</el-button>
    <!-- 表格 -->
    <el-table :data="goodsList" style="100%">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name" width="200"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price" width="200"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="200"></el-table-column>
      <el-table-column label="商品数量" prop="goods_number" width="200"></el-table-column>
      <el-table-column label="创建时间" width="200">
        <template v-slot:default="{row}">
          {{row.add_time|timer}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button size="small" plain icon="el-icon-edit" type="success" @click="showEdit(row)"></el-button>
          <el-button size="small" plain icon="el-icon-delete" type="danger" @click="deleteGood(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[7, 14, 21, 28]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>
    <!-- 编辑商品的弹出框 -->
    <el-dialog title="编辑商品" :visible.sync="dialogFormVisible" width="30%" @click="resetForm">
      <el-form :model="form" :rules="rules" ref="form" status-icon>
        <el-form-item label="商品名称" label-width="120px" prop="goodsName">
          <el-input v-model="form.goodsName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" label-width="120px" prop="goodsPrice">
          <el-input v-model="form.goodsPrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" label-width="120px" prop="goodsWeight">
          <el-input v-model="form.goodsWeight" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" label-width="120px">
          <el-button disabled type="danger">{{form.goodsNumber}}</el-button>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="cancelEdit">取 消</el-button>
          <el-button type="success" @click="sureEdit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 7,
      totalPage: null,
      dialogFormVisible: false,
      form: {
        goodsName: '',
        goodsPrice: '',
        goodsWeight: '',
        goodsNumber: ''
      },
      rules: {
        goodsName: [
          { required: true, message: 'error goods-name', trigger: ['blur', 'change'] }
        ],
        goodsPrice: [
          { required: true, message: 'error goods-price', trigger: ['blur', 'change'] }
        ],
        goodsWeight: [
          { required: true, message: 'error goods-weight', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const res = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(res)
      const { data, meta } = res
      if (meta.status === 200) {
        this.goodsList = data.goods
        this.totalPage = data.total
      }
    },
    // 分页
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getGoodsList()
    },
    indexMethod (index) {
      return (this.pagenum - 1) * this.pagesize + 1 + index
    },
    goGoodsAdd () {
      this.$router.push('/goods-add')
    },
    // 编辑
    showEdit (row) {
      // console.log(row)
      this.dialogFormVisible = true
      this.form.goodsName = row.goods_name
      this.form.goodsPrice = row.goods_price
      this.form.goodsWeight = row.goods_weight
      this.form.goodsNumber = row.goods_number
    },
    resetForm () {
      this.$refs.form.resetFields()
    },
    cancelEdit () {
      this.dialogFormVisible = false
    },
    async sureEdit () {
      try {
        await this.$refs.form.validate()
        this.dialogFormVisible = false
        this.$message.success('success edit')
      } catch (e) {
        console.log(e)
      }
    },
    // 删除
    deleteGood (row) {
      // console.log(row.goods_id)
      this.$confirm('你确定要删除么?此操作不可以逆转', '友情提示', {
        type: 'warning'
      }).then(() => {
        if (this.pagenum > 1 && this.getGoodsList.length === 1) {
          this.pagenum--
        }
        this.$message.success('success deleted')
      }).catch((e) => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="less" scoped>
 .addGoodsBtn {
   margin-bottom: 15px;
 }
</style>
