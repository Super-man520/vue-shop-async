<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-bottom: 15px;
     border-bottom: 1px solid #666;">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索栏和添加用户 -->
    <el-input placeholder="请输入搜索关键字" v-model="query" class="input-with-select" clearable @keydown.native.enter="queryUser">
      <el-button slot="append" icon="el-icon-search" @click="queryUser"></el-button>
    </el-input>
    <el-button class="addBtn" type="success" plain @click="addUser">添加用户</el-button>
    <!-- 表格 -->
     <el-table :data="usersList" style="width: 100%">
       <el-table-column  width="100" type="index" :index="indexMethod"></el-table-column>
       <el-table-column prop="username" label="姓名" width="200"></el-table-column>
       <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
       <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
       <el-table-column label="用户状态" width="200">
         <template v-slot:default="{row}">
           <el-switch v-model="row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="handleState(row.id,row.mg_state)"></el-switch>
         </template>
       </el-table-column>
       <el-table-column label="操作">
         <template v-slot:default="{row}">
           <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(row)"></el-button>
           <el-button type="success" icon="el-icon-delete" size="mini" @click="delUser(row)"></el-button>
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
     <!-- 添加用户的弹框 -->
     <el-dialog :title="title" :visible.sync="showAdduser" width="30%" @close="resetForm">
      <el-form :model="form" ref="form" :rules="rules" status-icon>
        <el-form-item label="username" prop="username" label-width="120px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="password" prop="password" label-width="120px">
          <el-input v-model="form.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email" label-width="120px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="mobile" prop="mobile" label-width="120px">
          <el-input v-model="form.mobile" autocomplete="off" maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddUser">取 消</el-button>
        <el-button type="primary" @click="sureAddUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户 -->
    <el-dialog :title="title" :visible.sync="showEdituser" width="30%" @close="resetForm">
      <el-form :model="form" ref="form" :rules="rules" status-icon>
        <el-form-item label="username" prop="username" label-width="120px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="password" prop="password" label-width="120px">
          <el-input v-model="form.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="email" prop="email" label-width="120px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="mobile" prop="mobile" label-width="120px">
          <el-input v-model="form.mobile" autocomplete="off" maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddUser">取 消</el-button>
        <el-button type="primary" @click="sureEditUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      id: '',
      query: '',
      pagenum: 1,
      pagesize: 5,
      totalPage: null,
      usersList: [],
      showAdduser: false,
      showEdituser: false,
      title: '',
      rules: {
        username: [
          { required: true, message: 'error username', trigger: ['blur', 'change'] },
          { min: 6, max: 16, message: '字符在6 ~ 15之间', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: 'error password', trigger: ['blur', 'change'] },
          { min: 6, max: 16, message: '字符在6 ~ 15之间', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: 'error email', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}$/, message: 'error mobile', trigger: ['blur', 'change'] }
        ]
      },
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
    }
  },
  created () {
    this.getUsersList()
  },
  methods: {
    getUsersList () {
      this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(res => {
        // console.log(res)
        const { data, meta } = res
        if (meta.status === 200) {
          this.usersList = data.users
          this.totalPage = data.total
        }
      }).catch(e => {
        console.log(e)
      })
    },
    // 查询用户
    queryUser () {
      this.pagenum = 1
      this.getUsersList()
    },
    // 分页
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getUsersList()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUsersList()
    },
    // 改变用户的状态
    async handleState (id, value) {
      // console.log(id, value)
      const res = await this.$axios.put(`users/${id}/state/${value}`)
      console.log(res)
      const { meta } = res
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.getUsersList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 添加用户
    addUser () {
      this.showAdduser = true
      this.title = '添加用户'
    },
    cancelAddUser () {
      this.$refs.form.resetFields()
      this.showAdduser = false
    },
    async sureAddUser () {
      try {
        await this.$refs.form.validate()
        const res = await this.$axios.post('users', this.form)
        // console.log(res)
        const { meta } = res
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.showAdduser = false
          this.totalPage++
          this.pagenum = Math.ceil(this.totalPage / this.pagesize)
          this.getUsersList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 编辑用户
    editUser (row) {
      console.log(row)
      this.id = row.id
      this.showEdituser = true
      this.title = '修改用户'
      this.$nextTick(() => {
        this.form.username = row.username
        this.form.password = 123456
        this.form.email = row.email
        this.form.mobile = row.mobile
      })
    },
    async sureEditUser () {
      try {
        await this.$refs.form.validate()
        const res = await this.$axios.put(`users/${this.id}`, this.form)
        console.log(res)
        const { meta } = res
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.showEdituser = false
          this.getUsersList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 关闭模态框时重置表单
    resetForm () {
      this.$refs.form.resetFields()
    },
    // 删除用户
    delUser (row) {
      this.id = row.id
      this.$confirm('你确定删除么?此操作不可修复', '友情提示', {
        type: 'success'
      }).then(() => {
        this.$axios.delete(`users/${this.id}`).then(res => {
          console.log(res)
          const { meta } = res
          if (meta.status === 200) {
            this.$message.success(meta.msg)
            if (this.usersList.length === 1 && this.pagenum > 1) {
              this.pagenum--
              this.getUsersList()
            }
          } else {
            this.$message.error(meta.msg)
          }
        }).catch((e) => {
          console.log(e)
        })
      })
    },
    // 序号
    indexMethod (index) {
      return (this.pagenum - 1) * this.pagesize + 1 + index
    }
  }
}
</script>

<style lang="less" scoped>
 .el-input {
   width: 300px;
   margin: 10px 30px 20px 0;
 }
</style>
