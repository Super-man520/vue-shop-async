<template>
  <div class="rights">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-bottom: 15px;
     border-bottom: 1px solid #666;">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="rightsList" style="100%">
      <el-table-column type="index" width="180"></el-table-column>
      <el-table-column label="权限名称" prop="authName" width="300"></el-table-column>
      <el-table-column label="路径" prop="path" width="300"></el-table-column>
      <el-table-column label="层级">
        <template v-slot:default="{row}">
          <el-tag type="success" v-if="row.level === '0'">一级</el-tag>
          <el-tag type="warning" v-else-if="row.level === '1'">二级</el-tag>
          <el-tag type="danger" v-else-if="row.level === '2'">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const res = await this.$axios.get('rights/list')
      // console.log(res)
      const { data, meta } = res
      if (meta.status === 200) {
        this.rightsList = data
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style>

</style>
