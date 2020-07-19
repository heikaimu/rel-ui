<template>
  <div class="login-box">
    <h1>Jarvis</h1>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginValidata"
      labelWidth="80px"
      size="medium"
      labelPosition="top"
      class="login-form"
    >
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="username"
          size="large"
          @keyup.enter.native="handleLogin"
        >
          <el-button
            slot="prepend"
            icon="el-icon-user"
          />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          ref="file"
          v-model="loginForm.password"
          type="password"
          size="large"
          @keyup.enter.native="handleLogin"
        >
          <el-button
            slot="prepend"
            icon="el-icon-key"
          />
        </el-input>
      </el-form-item>
      <!-- <el-form-item>
        <el-button @click="getCode">获取code</el-button>
      </el-form-item> -->
      <el-form-item>
        <el-button
          class="full-width"
          type="primary"
          :disabled="!isAcrossReCAPTCHA"
          :loading="isFetching"
          @click="handleLogin()"
        >{{ isFetching?'正在登陆...':'登录' }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { login } from '../api/user';
import LocalService from '../common/service/localService';
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginValidata: {
        usernmae: [
          {
            required: true,
            message: '请输入你的WiteMedia企业邮箱',
            trigger: 'blur'
          },
          {
            type: 'username',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      },
      isFetching: false,
      isAcrossReCAPTCHA: true
    };
  },
  methods: {
    /**
     * 登陆点击
     */
    /*global */
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 本地开发环境不需要验证码
          const params = {
            ...this.loginForm
          };
          this._login(params);
        } else {
          return false;
        }
      });
    },
    async _login(params, code) {
      try {
        this.isFetching = true;
        const { status = '', data = {}, message } = await login(params, code);
        if (status === '0') {
          LocalService.set('token', data.token);
          this.$router.push('/');
        } else {
          this.$message.error(message);
        }
      } finally {
        this.isFetching = false;
      }
    }
  }
};
</script>

<style lang="scss">

</style>
