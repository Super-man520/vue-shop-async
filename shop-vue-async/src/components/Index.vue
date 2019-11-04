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
          <i class="el-icon-user-solid"></i>
          <span>欢迎光临 ~ </span>
          <a href="javascript:void(0);" @click="logout">退出</a>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      flag: false
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
         i {
           color: #e92322;
         }
         a {
           color: #daa520;
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
    }
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
