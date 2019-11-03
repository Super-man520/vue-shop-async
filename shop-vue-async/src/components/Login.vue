<template>
  <div class="login">
    <a href="javascript:void(0);" class="logo"><img src="../assets/0010.png" alt=""></a>
    <el-form :model="form" :rules="rules" ref="form" label-width="80px" status-icon
    @keydown.native.enter="login">
      <el-form-item label="username" prop="username">
        <el-input v-model="form.username" placeholder="please enter username"></el-input>
      </el-form-item>
      <el-form-item label="password" prop="password">
        <el-input v-model="form.password" type="password" placeholder="please enter password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login" class="loginBtn">登录</el-button>
        <el-button type="danger" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 15, message: '字符3 ~ 15之间', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 6, max: 15, message: '字符6 ~ 15之间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    async login () {
      try {
        await this.$refs.form.validate()
        const { data, meta } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          // 存储token到本地
          localStorage.setItem('token', data.token)
          this.$message.success(meta.msg)
          this.$router.push({ name: 'index' })
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    resetForm () {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
  .login {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .logo {
      display: block;
      position: absolute;
      // width: 120px;
      // height: 120px;
      // background-color: #fff;
      left: 50%;
      transform: translateX(-50%);
      top: 100px;
      img {
        width: 120px;
      }
    }
    .el-form {
      width: 35%;
      margin: 200px auto 0;
      background-color: #fff;
      padding: 90px 30px 20px;
      border-radius: 15px;
      .loginBtn {
        margin-right: 30px;
      }
    }
  }
</style>
<style lang="less">
  // .el-form-item[data-v-ef68022e] {
  //   .el-form-item__content {
  //     margin-left: 0px !important;
  //   }
  // }
</style>
