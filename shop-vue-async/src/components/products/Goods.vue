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
          <el-button size="small" plain icon="el-icon-edit" type="success"></el-button>
          <el-button size="small" plain icon="el-icon-delete" type="danger"></el-button>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 7,
      totalPage: null
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
      console.log(res)
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
    }
  }
}
</script>

<style lang="less" scoped>
 .addGoodsBtn {
   margin-bottom: 15px;
 }
</style>
