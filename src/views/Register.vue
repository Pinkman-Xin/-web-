<template>
  <div class="register_container">
    <div class="register_box">
      <h1>欢迎注册</h1>
        <el-tabs @tab-click="handleClick" tab-position="left" style="height:350px;">
          <el-tab-pane label="普通注册">
            <NormalForm ref="normalForm"></NormalForm>
          </el-tab-pane>
          <el-tab-pane label="邮箱注册">
            <EmailForm ref="emailForm"></EmailForm>
          </el-tab-pane>
        </el-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import {Component, Vue,Ref} from 'vue-property-decorator';
    import NormalForm from '../components/NormalForm.vue'
    import EmailForm from '../components/EmailForm.vue'
    @Component({
        name: "Register",
        components:{
            NormalForm,
            EmailForm},
    })
  export default class Register extends Vue {
    @Ref() readonly normalForm!: NormalForm  
    @Ref() readonly emailForm!: EmailForm
    private handleClick(){
      this.normalForm.resetForm()
      this.emailForm.resetForm()
    }
  }
</script>

<style lang="scss" scoped>
.register_container {
  width: 100%;
  height: 100%;  
  background: url("../assets/yamei.jpg") no-repeat;
  background-size: cover;
  .register_box{
    width: 600px;
    height: 420px;
    background: #fff;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    h1{
      text-align: center;
    }
    a{
      text-decoration: none;
    }
    .el-form{
      padding-right: 20px;
      box-sizing: border-box;
    }
  }
}
</style>