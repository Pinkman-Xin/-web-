<template>
    <el-container>
        <el-header>
            <div class="header-left" @click="toggleCollapse"></div>
            <div class="header-right">
                <img :src="userInfo.baseURL + userInfo.avatarURL" alt="">
                <p>{{userInfo.username || userInfo.email || userInfo.phone}}</p>
                <el-button @click="logout">退出</el-button>
            </div>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? '65px' : '200px'">
                <!--垂直侧边栏-->
                <el-menu
                        default-active="2"
                        class="el-menu-vertical-demo"
                        background-color="#fff"
                        text-color="#666"
                        active-text-color="deepskyblue"
                        :collapse="isCollapse"
                        :collapse-transition="false"
                        :router="true"
                        >
                    <!--一级菜单-->
                    <el-submenu :index="item.rightsPath"
                                v-for="item in currentMenus"
                                :key="item.id">
                        <template slot="title">
                            <i class="el-icon-setting"></i>
                            <span>{{item.rightsName}}</span>
                        </template>
                        <!--二级菜单-->
                        <el-menu-item-group>
                            <el-menu-item :index="subItem.rightsPath"
                                          v-for="subItem in item.children"
                                          :key="subItem.id"
                                          @click="changeDefaultActivePath(subItem.rightsPath)">
                                <template slot="title">
                                    <i class="el-icon-setting"></i>
                                    <span>{{subItem.rightsName}}</span>
                                </template>
                            </el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Cookies from 'js-cookie'

    @Component({
        name: "Admin",
        components:{},
    })
    export default class Admin extends Vue{
        private defaultActivePath = '';
      $router: any;
        private get currentMenus(){
            for(let i = 0; i < this.userInfo.rightsTree.length; i++){
                const rights = this.userInfo.rightsTree[i];
                if(rights.rightsType === 'menu'){
                    return rights.children;
                }
            }
        }
        private isCollapse = false;
        private toggleCollapse(){
            this.isCollapse = !this.isCollapse;
        }
        private logout(){
            Cookies.remove('token');
            sessionStorage.removeItem('acitvePath');
            sessionStorage.removeItem('userInfo');
            this.$router.push('/login');
        }
        private changeDefaultActivePath(path:string){
            this.defaultActivePath = path;
            sessionStorage.setItem('acitvePath', path);
        }
        private userInfo:any = {};
        created(): void {
            console.log(12);
            
            const path = sessionStorage.getItem('acitvePath');
            this.defaultActivePath = path ? path : '';
            const userInfo = sessionStorage.getItem('userInfo');
            if(userInfo){
            this.userInfo = JSON.parse(userInfo);
            }
        }
    }
</script>

<style lang="scss" scoped>
.el-container{
    background: #ccc;
    width: 100%;
    height: 100%;
    .el-header{
        background: deepskyblue;
        display: flex;
        justify-content: space-between;
        .header-left{
            width: 200px;
            height: 60px;
            background: url("../assets/logo.png") center center no-repeat;
            background-size: 80% auto;
        }
        .header-right{
            display: flex;
            justify-content: space-between;
            align-items: center;
            img{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                overflow: hidden;
            }
            p{
                padding-left: 10px;
                padding-right: 20px;
            }
        }
    }
    .el-aside{
        background: #fff;
    }
}
</style>
