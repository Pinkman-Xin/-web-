<template>
    <div class="login_container">
        <div class="login_box">
            <h1>欢迎登陆</h1>
            <el-form ref="form" :model="loginData" :rules="loginRules" label-width="0px">
                <el-form-item label="" prop="username">
                    <el-input v-model="loginData.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input type="password" v-model="loginData.password" prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <el-form-item label="" prop="captcha">
                    <el-row>
                        <el-col :span="18">
                            <el-input v-model="loginData.captcha" prefix-icon="el-icon-lock"></el-input>
                        </el-col>
                        <el-col :span="6">
                            <img src="http://127.0.0.1:7001/imagecode" ref="captchaImage" @click="updateCaptcha">
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" style="width: 100%">登录</el-button>
                </el-form-item>
            </el-form>
            <ul class="auth_box">
              <li class="iconfont icon-qq" style="color:deepskyblue"></li>
              <li class="iconfont icon-weixin" style="color:green"></li>
              <li class="iconfont icon-weibo"  style="color:red"></li>
              <li class="iconfont icon-github" style="color:black" @click="github">
                <a href="http://127.0.0.1:8080/"></a>
              </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Ref} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import {loginUser,githubUser} from '../api/index';

    @Component({
        name: "Login",
        components:{},
    })
    export default class Login extends Vue{
        private loginData = {
            username: '',
            email: '',
            phone: '',
            password: '',
            captcha: '',
            type: 'normal',
            checked: true
        };
        private validateName = (rule: any, value:string, callback:any) => {
            const normalReg = /^[A-Za-z0-9]{6,}$/;
            const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(!value){
                callback(new Error('请填写用户名'));
            }else if(emailReg.test(value)){
                this.loginData.email = this.loginData.username;
                // this.loginData.username = '';
                this.loginData.type = 'email';
                callback();
            }
             else if(normalReg.test(value)){
                this.loginData.type = 'normal';
                callback();
            }else{
                callback(new Error('用户名格式不正确'));
            }
        };
        private validatePass = (rule: any, value:string, callback:any) => {
            const reg = /^(?:(?=.*[0-9].*)(?=.*[A-Za-z].*)(?=.*[,\.#%'\+\*\-:;^_`].*))[,\.#%'\+\*\-:;^_`0-9A-Za-z]{8,}$/;
            if(!value){
                callback(new Error('请填写密码'));
            }else if(value.length < 6){
                callback(new Error('密码至少是8位'));
            }else if(!reg.test(value)){
                callback(new Error('密码必须包含字母数字和特殊符号'));
            }else{
                callback();
            }
        };
        private validateCaptcha = (rule: any, value:string, callback:any) => {
            const reg = /^[A-Za-z0-9]{4}$/;
            if(!value){
                callback(new Error('请填写验证码'));
            }else if(value.length < 4){
                callback(new Error('验证码至少是4位'));
            }else if(!reg.test(value)){
                callback(new Error('验证码只能是字母和数字'));
            }else{
                callback();
            }
        };
        private loginRules = {
            username: [
                { validator: this.validateName, trigger: 'blur' }
            ],
            password: [
                { validator: this.validatePass, trigger: 'blur' }
            ],
            captcha: [
                { validator: this.validateCaptcha, trigger: 'blur' }
            ]
        }
        @Ref() readonly  captchaImage!: HTMLImageElement;
         $router: any;
        private updateCaptcha(){
            this.captchaImage.src = `http://127.0.0.1:7001/imagecode?r=${Math.random()}`;
        };
        private github(){
          githubUser()
          loginUser(this.loginData)
                        .then((response:any)=>{
                            if(response.status === 200){
                                console.log(response.data.data);
                                // 保存登录状态
                                sessionStorage.setItem('userInfo', JSON.stringify(response.data.data));
                                // 跳转到管理界面
                                this.$router.push('/admin');
                            }else{
                                (this as any).$message.error(response.data.msg);
                                this.updateCaptcha();
                            }
                        })
                        .catch((error)=>{
                            (this as any).$message.error(error.response.data.msg);
                        });
        }
        @Ref() readonly form!: ElForm;
        private onSubmit(){
            this.form.validate((flag)=>{
                if(flag){
                    loginUser(this.loginData)
                        .then((response:any)=>{
                            if(response.status === 200){
                              console.log(response.data.data);
                                // 保存登录状态
                                sessionStorage.setItem('userInfo', JSON.stringify(response.data.data));
                                // 跳转到管理界面
                                this.$router.push('/admin');
                            }else{
                                (this as any).$message.error(response.data.msg);
                                this.updateCaptcha();
                            }
                        })
                        .catch((error)=>{
                            (this as any).$message.error(error.response.data.msg);
                            this.updateCaptcha();
                        });
                }else{
                    (this as any).$message.error('数据格式不对');
                    this.updateCaptcha();
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
    .login_container {
        width: 100%;
        height: 100%;
        background: url("../assets/yamei.jpg") no-repeat;
        background-size: cover;
        .login_box{
            width: 600px;
            height: 420px;
            background: #fff;
            border-radius: 10px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            h1{
                text-align: center;
            }
            a{
                text-decoration: none;
            }
            .el-form{
                padding: 0 20px;
                box-sizing: border-box;
            }
            .auth_box{
              list-style: none;
              padding: 0;
              display: flex;
              justify-content: space-around;
              li{
                position: relative;
                font-size: 30px;
                a{
                  position: absolute;
                  display: block;
                  height: 100%;
                  width: 100%;
                  left: 0;
                  top: 0;
                }
              }
            }
        }
    }
</style>
