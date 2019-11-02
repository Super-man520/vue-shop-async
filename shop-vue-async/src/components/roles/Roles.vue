<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-bottom: 15px;
     border-bottom: 1px solid #666;">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button type="success" plain @click="addRole" class="addBtn">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="rolesList" style="width: 100%">
      <el-table-column type="expand" width="120">
        <template v-slot:default="{row}">
          <p v-if="row.children.length === 0" align="center">暂无数据</p>
          <el-row  v-for="item1 in row.children" :key="item1.id" class="item1">
            <!-- 第一层 -->
            <el-col :span="4">
              <el-tag closable type="success" @close="delRole(row,item1.id)">{{item1.authName}}</el-tag>
            </el-col>
              <!-- 第二层 -->
            <el-col :span="20">
              <el-row v-for="item2 in item1.children" :key="item2.id">
                <el-col :span="6">
                  <el-tag closable type="warning" @close="delRole(row,item2.id)">{{item2.authName}}</el-tag>
                </el-col>
                <!-- 第三层 -->
                <el-col :span="18">
                  <el-tag closable v-for="item3 in item2.children" :key="item3.id" type="danger" @close="delRole(row,item3.id)">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
           </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName" width="260"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc" width="300"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button size="small" plain icon="el-icon-edit" type="primary" @click="editRole(row)"></el-button>
          <el-button size="small" plain icon="el-icon-delete" type="danger"></el-button>
          <el-button size="small" plain icon="el-icon-check" type="success" @click="assignRole(row)">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
       <!-- 添加角色的弹框 -->
     <el-dialog :title="title" :visible.sync="showAddRole" width="30%" @close="resetForm">
      <el-form :model="form" ref="form" :rules="rules" status-icon>
        <el-form-item label="roleName" prop="roleName" label-width="120px">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="roleDesc" prop="roleDesc" label-width="120px">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddRole">取 消</el-button>
        <el-button type="primary" @click="sureAddRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色的弹框 -->
     <el-dialog :title="title" :visible.sync="showEditRole" width="30%" @close="resetForm">
      <el-form :model="form" ref="form" :rules="rules" status-icon>
        <el-form-item label="roleName" prop="roleName" label-width="120px">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="roleDesc" prop="roleDesc" label-width="120px">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddRole">取 消</el-button>
        <el-button type="primary" @click="sureEditRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 树形控件 -->
    <el-dialog :visible.sync="showAssignRole" width="30%" title="分配权限">
      <el-tree :data="data" :props="defaultProps" node-key="id" default-expand-all show-checkbox ref="tree"></el-tree>
      <el-button size="small" class="assignBtn" @click="resetChecked" type="danger" plain>清空</el-button>
      <el-button size="small" class="assignBtn" @click="cancelAssignRole" type="primary">取 消</el-button>
      <el-button size="small" class="assignBtn" @click="sureAssignRole" type="success">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleId: '',
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      id: '',
      rolesList: [],
      form: {
        roleName: '',
        roleDesc: ''
      },
      title: '',
      showEditRole: false,
      showAddRole: false,
      showAssignRole: false,
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    getRolesList () {
      this.$axios.get('roles').then(res => {
        // console.log(res)
        const { data, meta } = res
        if (meta.status === 200) {
          this.rolesList = data
        } else {
          this.$message.error(meta.msg)
        }
      })
    },
    // 删除角色
    async delRole (row, rightId) {
      const res = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      // console.log(res)
      const { data, meta } = res
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 添加角色
    addRole () {
      this.showAddRole = true
      this.title = '添加角色'
    },
    resetForm () {
      this.$refs.form.resetFields()
    },
    async sureAddRole () {
      try {
        await this.$refs.form.validate()
        const res = await this.$axios.post('roles', this.form)
        const { meta } = res
        if (meta.status === 201) {
          this.getRolesList()
          this.showAddRole = false
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 编辑角色
    editRole (row) {
      this.showEditRole = true
      this.title = '编辑角色'
      this.id = row.id
      this.$nextTick(() => {
        this.form.roleName = row.roleName
        this.form.roleDesc = row.roleDesc
      })
    },
    cancelAddRole () {
      this.showAddRole = false
      this.showEditRole = false
    },
    async sureEditRole () {
      try {
        await this.$refs.form.validate()
        const res = await this.$axios.put(`roles/${this.id}`, this.form)
        const { meta } = res
        if (meta.status === 200) {
          this.showEditRole = false
          this.getRolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 树的节点
    // getCheckedKeys () {
    //   console.log(this.$refs.tree.getCheckedKeys())
    // },
    resetChecked () {
      this.$refs.tree.setCheckedKeys([])
    },
    // 分配角色
    async assignRole (row) {
      // console.log(row)
      this.showAssignRole = true
      this.roleId = row.id
      const res = await this.$axios.get('rights/tree')
      // console.log(res)
      const { data, meta } = res
      if (meta.status === 200) {
        this.data = data
        const ids = []
        row.children.forEach(ele => {
          ele.children.forEach(ele => {
            ele.children.forEach(ele => {
              ids.push(ele.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    cancelAssignRole () {
      this.showAssignRole = false
    },
    async sureAssignRole () {
      const id1 = this.$refs.tree.getCheckedKeys()
      const id2 = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...id1, ...id2].join(',')
      // get和delete添加数据需要params      post put patch不需要
      const res = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      // console.log(res)
      const { meta } = res
      if (meta.status === 200) {
        this.getRolesList()
        this.showAssignRole = false
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
 .addBtn {
   margin: 15px 10px;
 }
 .el-tag {
   margin: 5px;
 }
 .item1 {
   padding: 10px 0;
   border-bottom: 1px dotted #e92322;
 }
 .assignBtn {
   margin-top: 15px;
   margin-left: 30px;
 }
</style>
