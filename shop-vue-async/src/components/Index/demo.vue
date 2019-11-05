<template>
  <div class="index">
    <el-container>
      <el-header>
        <div class="logo">
          <img src="../assets/timg.jpg" alt="">
        </div>
        <div class="title">
          <h1>电商后台管理系统</h1>
        </div>
        <div class="info">
          <div class="person">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
           <transtion name="fade">
              <ul class="moreinfo">
                <li><a href="javascript:;void(0)">个人中心</a></li>
                <li><a href="javascript:;void(0)" @click="showEdit">修改密码</a></li>
                <li><a href="javascript:;void(0)" @click="showFeed">意见反馈</a></li>
                <li><a href="javascript:;void(0)">更多信息</a></li>
                <li><a href="javascript:;void(0)"  @click="logout">退出登录</a></li>
            </ul>
           </transtion>
          </div>
           <i class="el-icon-arrow-up show-up common-arrow"></i>
           <i class="el-icon-arrow-down show-down common-arrow"></i>
          <span class="welcome">欢迎光临 ~ </span>
          <!-- <a href="javascript:void(0);" @click="logout">退出</a> -->
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" ref="myAside">
          <el-row class="tac">
            <el-menu
              router
              unique-opened
              :default-active="defaultActive"
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b">
              <el-submenu :index="menu.path" v-for="menu in menuList" :key="menu.id">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{menu.authName}}</span>
                </template>
                  <el-menu-item :index="item.path" v-for="item in menu.children" :key="item.id">
                    <i class="el-icon-menu"></i>
                    <span slot="title">{{item.authName}}</span>
                  </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-row>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <i class="el-icon-arrow-right el-icon-arrow" v-if="flag" @click="showAside"></i>
    <i class="el-icon-arrow-left el-icon-arrow" v-if="!flag" @click="hideAside"></i>
    <!-- 修改密码的模态框 -->
    <el-dialog title="修改密码" :visible.sync="showEditPassword" @close="resetForm" width="30%">
      <el-form ref="form" :model="form" :rules="rules" status-icon>
        <el-form-item label="旧密码" label-width="120px" prop="oldPassword">
          <el-input v-model="form.oldPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" label-width="120px" prop="newPassword1">
          <el-input v-model="form.newPassword1" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="再次输入" label-width="120px" prop="newPassword2">
          <el-input v-model="form.newPassword2" autocomplete="off" show-password></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button type="primary" plain @click="showEditPassword = false">取 消</el-button>
          <el-button type="success" plain @click="sureEditPassword">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 意见反馈 -->
    <el-dialog title="意见反馈" :visible.sync="showFeedback" width="30%">
      <el-rate  show-text allow-half
        v-model="value"  @change="changeScore"
        :colors="['#F56C6C', '#E6A23C', '#67C23A']">
      </el-rate>
      <el-input type="textarea" :autosize="autosize" placeholder="please enter feedback"
      v-model="textarea"></el-input>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      RegExp: /^(\w){6,20}$/,
      RegExp2: /^[0-9]{1,}$/,
      menuList: [],
      flag: false,
      showEditPassword: false,
      showFeedback: false,
      form: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: 'please enter oldPassword', trigger: ['blur', 'change'] },
          { min: 6, max: 15, message: '字符在6 ~ 15之间', trigger: ['blur', 'change'] }
        ],
        newPassword1: [
          { required: true, message: 'please enter newPassword', trigger: ['blur', 'change'] },
          { min: 6, max: 15, message: '字符在6 ~ 15之间', trigger: ['blur', 'change'] },
          { pattern: /^(\w){6,20}$/, message: '只能输入6-20个字母、数字、下划线', trigger: ['blur', 'change'] }
        ],
        newPassword2: [
          { required: true, message: 'please enter newPassword', trigger: ['blur', 'change'] },
          { min: 6, max: 15, message: '字符在6 ~ 15之间', trigger: ['blur', 'change'] },
          { pattern: /^(\w){6,20}$/, message: '只能输入6-20个字母、数字、下划线', trigger: ['blur', 'change'] }
        ]
      },
      value: null,
      // iconClasses: ['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-3']
      textarea: '',
      autosize: {
        minRows: 2,
        maxRows: 6
      }
    }
  },
  computed: {
    defaultActive () {
      return this.$route.path.slice(1).split('-')[0]
    }
  },
  async created () {
    const res = await this.$axios.get('menus')
    // console.log(res)
    const { data, meta } = res
    if (meta.status === 200) {
      this.$message.success(meta.msg)
      this.menuList = data
      // console.log(this.$route)
      // console.log(this.$route.path.slice(1).split('-')[0])
    } else {
      this.$message.error(meta.msg)
    }
  },
  methods: {
    logout () {
      // console.log(this.$refs.myAside)
      this.$confirm('你确定要推出么?', '友情提示', {
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(e => {
        console.log(e)
      })
    },
    hideAside () {
      this.flag = !this.flag
      this.$refs.myAside.$el.style.marginLeft = '-200px'
    },
    showAside () {
      this.flag = !this.flag
      this.$refs.myAside.$el.style.marginLeft = '0px'
    },
    // 修改密码
    showEdit () {
      this.showEditPassword = true
    },
    resetForm () {
      this.$refs.form.resetFields()
    },
    async sureEditPassword () {
      try {
        await this.$refs.form.validate()
        // let info1 = this.rules.newPassword1[2].message
        // let info2 = this.rules.newPassword2[2].message
        if (this.form.oldPassword === this.form.newPassword1 || this.form.oldPassword === this.form.newPassword2) {
          this.$message.error('新旧密码请保持不一致')
        } else if (this.form.newPassword1 !== this.form.newPassword2) {
          // console.log(this.rules.newPassword2[2].message)
          // info1 = '两次输入密码不一致'
          this.$message.warning('两次输入密码不一致')
        } else if (this.RegExp2.test(this.form.newPassword1) || this.RegExp2.test(this.form.newPassword2)) {
          this.$message.error('请勿输入纯数字')
        } else {
          this.$message.success('修改密码成功')
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 意见反馈
    showFeed () {
      this.showFeedback = true
    },
    changeScore (value) {
      // console.log(value)
      if (value < 3) {
        this.$message.warning(`你的评分是${value}`)
      } else {
        this.$message.success(`你的评分是${value}`)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .index {
    width: 100%;
    height: 100%;
    .el-container {
      width: 100%;
      height: 100%;
    }
    .el-header {
       background-color: #B3C0D1;
       height: 80px !important;
       display: flex;
       line-height: 80px;
       .logo {
         width: 200px;
         img {
           height: 40px;
           display: block;
           margin: 20px auto 0;
         }
       }
       .title {
         flex: 1;
         h1 {
           text-align: center;
         }
       }
       .info {
         width: 200px;
         transition: all 1s;
         position: relative;
         .welcome {
           position: relative;
           left: 26px;
           font-weight: 700;
           color: #666;
         }
         .person {
           float: right;
         }
         i {
           color: #e92322;
         }
         a {
           color: #daa520;
         }
         .moreinfo {
           position: absolute;
           right: 10px;
           background-color: #fff;
           box-shadow: 0 0 20px #ddd;
          //  display: none;
          opacity: 0;
          & li:last-child a {
            border: none;
          }
           li {
             padding: 5px 10px;
             line-height: 1.5 !important;
             a {
               display: block;
               border-bottom: 1px solid #ccc;
               color: #666;
               text-decoration: none;
               font-size: 12px;
             }
           }
         }
         .show-up {
           opacity: 0;
          // display: none;
         }
         .common-arrow {
          position: absolute;
          top: 32px;
          right: 6px;
         }
       }
    }
    .el-aside {
      background-color: #D3DCE6;
      transition: all 1s;
      .el-menu {
        border-right: none;
        // .el-menu-item {
        //   padding-left: 70px !important;
        // }
      }
    }
    .el-main {
      background-color: #E9EEF3;
    }
    .el-icon-arrow {
      position: fixed;
      left: 10%;
      bottom: 3%;
      font-size: 30px;
      color: #e92322;
      z-index: 999;
    }
    .el-avatar {
      // margin-top: 20px;
      vertical-align: middle;
      position: relative;
      top: -3px;
      margin-right: 26px;
    }
  }
  .person:hover .moreinfo {
    animation: bounce 1s forwards;
  }
  .person:hover~.show-up {
    // display: block !important;
    animation: bounce 1s forwards;
  }
  .person:hover~.show-down {
    // display: none !important;
    opacity: 0;
    // animation: bounce 1s reverse forwards;
  }
  li a:hover{
    color: #e92322 !important;
  }
  // .fade-enter-active {
  //   animation: bounce 1s;
  // }
  // .fade-leave-active {
  //   animation: bounce 1s reverse;
  // }
  @keyframes bounce {
    0% {
      opacity: 0;
    }
    30% {
      opacity: .4;
    }
    70% {
      opacity: .8;
    }
    100% {
      opacity: 1;
    }
  }
  .el-rate {
    margin-bottom: 15px;
  }
</style>
<style lang="less">
  .el-menu-item-group__title {
    padding: 0;
  }
  // .el-submenu__title,
  // .el-menu-item {
  //   background-color: #D3DCE6 !important;
  //   color: #888 !important;
  // }
</style>
