<template>
    <el-form ref="form" :model="registerData" :rules="registerRules" label-width="0px">
        <el-form-item label="" prop="username">
            <el-input v-model="registerData.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
            <el-input type="password" v-model="registerData.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item label="" prop="captcha">
            <el-row>
                <el-col :span="18">
                    <el-input v-model="registerData.captcha" prefix-icon="el-icon-lock"></el-input>
                </el-col>
                <el-col :span="6">
                    <img src="http://127.0.0.1:7001/imagecode" ref="captchaImage" @click="updateCaptcha">
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit" style="width: 100%">注册</el-button>
        </el-form-item>
        <el-form-item prop="checked">
            <el-checkbox v-model="registerData.checked">
                <p>
                    阅读并接受
                    <a href="javascript:;">《知播渔用户协议》</a>
                    及
                    <a href="javascript:;">《知播渔隐私权保护声明》</a>
                </p>
            </el-checkbox>
        </el-form-item>
    </el-form>
</template>

<script lang="ts">
    import {Component, Vue, Ref} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import {registerUser} from '../api/index';

    @Component({
        name: "NormalForm",
        components:{},
    })
    export default class NormalForm extends Vue{
        private registerData = {
            username: '',
            password: '',
            captcha: '',
            type: 'normal',
            checked: true
        };
        private validateName = (rule: any, value:string, callback:any) => {
            const reg = /^[A-Za-z0-9]{6,}$/;
            if(!value){
                callback(new Error('请填写用户名'));
            }else if(value.length < 6){
                callback(new Error('用户名至少是6位'));
            }else if(!reg.test(value)){
                callback(new Error('用户名只能是字母和数字'));
            }else{
                callback();
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
        private validateChecked = (rule: any, value:string, callback:any) => {
            if(!value){
                callback(new Error('请阅读并同意用户协议'));
            }else{
                callback();
            }
        };
        private registerRules = {
            username: [
                { validator: this.validateName, trigger: 'blur' }
            ],
            password: [
                { validator: this.validatePass, trigger: 'blur' }
            ],
            captcha: [
                { validator: this.validateCaptcha, trigger: 'blur' }
            ],
            checked: [
                { validator: this.validateChecked, trigger: 'change' }
            ],
        }
        @Ref() readonly  captchaImage!: HTMLImageElement;
      $router: any;
        private updateCaptcha(){
            this.captchaImage.src = `http://127.0.0.1:7001/imagecode?r=${Math.random()}`;
        };
        @Ref() readonly form!: ElForm;
        private onSubmit(){
            this.form.validate((flag)=>{
                if(flag){
                    registerUser(this.registerData)
                        .then((response:any)=>{
                            if(response.status === 200){
                                this.$router.push('/login');
                            }else{
                                this.updateCaptcha();
                                (this as any).$message.error(response.data.msg);
                            }
                        })
                        .catch((error)=>{
                            this.updateCaptcha();
                            (this as any).$message.error(error.response.data.msg);
                        });
                }else{
                    (this as any).$message.error('数据格式不对');
                }
            });
        };

        public resetForm(){
            this.form.resetFields();
        }
    }
</script>

<style lang="scss" scoped>

</style>
