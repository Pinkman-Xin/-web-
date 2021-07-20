<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><a href="/admin" @click="resetDefaultActivePath">首页</a></el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--内容卡片区域-->
        <el-card class="box-card">
            <!--头部搜索区域-->
            <el-form :model="searchData" class="demo-form-inline">
                <el-form-item style="padding-right: 20px">
                    <el-select v-model="searchData.type" placeholder="-权限类型-">
                        <el-option label="所有权限" value=""></el-option>
                        <el-option label="菜单权限" value="menu"></el-option>
                        <el-option label="路由权限" value="router"></el-option>
                        <el-option label="请求权限" value="action"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  style="width: 100%">
                    <el-input v-model="searchData.key" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item class="query_rights">
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="showAddRightsDialog">添加</el-button>
                </el-form-item>
            </el-form>
            <!--中间表格区域-->
            <el-table
                    :data="tableData"
                    style="width: 100%"
                    :border="true"
                    :stripe="true">
                <el-table-column type="index">
                </el-table-column>
                <el-table-column
                        prop="rightsName"
                        label="权限名称">
                </el-table-column>
                <el-table-column
                        prop="rightsDesc"
                        label="权限描述">
                </el-table-column>
                <el-table-column
                        label="权限等级">
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.level === 0">一级</el-tag>
                        <el-tag type="warning" v-if="scope.row.level === 1">二级</el-tag>
                        <el-tag type="success" v-if="scope.row.level === 2">三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.rightsState"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="changeRightsState(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="showEditRightsDialog(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="destroyRights(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!--添加编辑权限对话框-->
        <el-dialog
                :title="isEditRights? '编辑权限':'添加权限'"
                :visible.sync="rightsDialogVisible"
                width="30%">
            <el-form ref="form" :model="rightsData"  :rules="rightsRules" label-width="80px">
                <el-form-item label="权限名称" prop="rightsName">
                    <el-input v-model="rightsData.rightsName"
                              prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <el-form-item label="权限描述" prop="rightsDesc">
                    <el-input v-model="rightsData.rightsDesc"
                              prefix-icon="el-icon-info"></el-input>
                </el-form-item>
                <el-form-item label="权限类型" prop="rightsType">
                    <el-select v-model="rightsData.rightsType">
                        <el-option label="菜单权限" value="menu"></el-option>
                        <el-option label="路由权限" value="router"></el-option>
                        <el-option label="请求权限" value="action"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="请求方式" prop="rightsMethod">
                    <el-select v-model="rightsData.rightsMethod"
                               :disabled="rightsData.rightsType !== 'action'">
                        <el-option label="GET请求" value="get"></el-option>
                        <el-option label="POST请求" value="post"></el-option>
                        <el-option label="PUT请求" value="put"></el-option>
                        <el-option label="DELETE请求" value="delete"></el-option>
                        <el-option label="所有请求" value="all"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限等级" prop="level">
                    <el-select v-model="rightsData.level">
                        <el-option label="一级权限" :value="0"></el-option>
                        <el-option label="二级权限" :value="1"></el-option>
                        <el-option label="三级权限" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="上级权限" prop="pid">
                    <el-select v-model="rightsData.pid"
                               :disabled="rightsData.level === 0">
                            <el-option
                                     v-for="item in parentRights"
                                    :key="item.id"
                                    :label="item.rightsName"
                                    :value="item.id">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限地址" prop="rightsPath">
                    <el-input v-model="rightsData.rightsPath"
                              prefix-icon="el-icon-info"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rightsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handlerRights">确 定</el-button>
            </span>
        </el-dialog>

        <!--底部分页区域-->
        <el-pagination
                :current-page="searchData.currentPage"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="searchData.pageSize"
                :total="totalCount"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Ref, Watch} from 'vue-property-decorator';
    import {ElForm} from 'element-ui/types/form';
    import {getRights, destroyRights, createRights, updateRights} from '../api/index';

    @Component({
        name: "Rights",
        components:{},
    })
    export default class Rights extends Vue{
        private resetDefaultActivePath(){
            sessionStorage.removeItem('acitvePath');
        };

        // 搜索相关代码
        private tableData:any[] = [];
        private searchData = {
            type:'',
            key:'',
            currentPage: 1,
            pageSize: 5
        };
        private onSubmit(){
            this.getRightsList();
        };
        private getRightsList(){
            // 获取分页权限列表
            getRights(this.searchData)
                .then((response:any)=>{
                    if(response.status === 200){
                        this.tableData = response.data.data.rights;
                        this.totalCount = response.data.data.totalCount;
                    }else{
                        (this as any).$message.error(response.data.msg);
                    }
                })
                .catch((error)=>{
                      console.log(error);
                  (this as any).$message.error(error.response.data.msg);
                });
        }
        created(): void {
            this.getRightsList();
        }

        // 分页相关代码
        private totalCount = 0;
        private handleSizeChange(currentSize:any){
            this.searchData.pageSize = currentSize;
            this.getRightsList();
        }
        private handleCurrentChange(currentPage:any){
            this.searchData.currentPage = currentPage;
            this.getRightsList();
        }

        // 添加权限相关代码
        private validatePid = (rule: any, value:number, callback:any) => {
            if(this.rightsData.level !== 0 && value === 0){
                callback('非一级权限必须选择上级权限');
            }else{
                callback();
            }
        };
        private validateMethod = (rule: any, value:string, callback:any) => {
            if(this.rightsData.rightsType === 'action' && !value){
                callback('请求权限必须选择请求方式');
            }else{
                callback();
            }
        };
        private rightsRules = {
            rightsName: [
                { required: true, message: '请输入权限名称', trigger: 'blur' },
                { min: 1,  message: '长度至少1个字符', trigger: 'blur' }
            ],
            rightsDesc: [
                { required: true, message: '请输入权限描述', trigger: 'blur' },
                { min: 1,  message: '长度至少1个字符', trigger: 'blur' }
            ],
            rightsType: [
                { required: true, message: '请选择权限类型', trigger: 'change' },
            ],
            rightsMethod: [
                { validator: this.validateMethod, trigger: 'change' }
            ],
            rightsPath:[
                { required: false, message: '请输入权限地址', trigger: 'blur' }
                ],
            pid: [
                { validator: this.validatePid, trigger: 'change' }
            ],
            level:[
                { required: false, message: '请选择权限等级', trigger: 'change' },
            ]
        };
        private parentRights:any[] = []; // 当前等级所有权限
        private rightsDialogVisible = false;
        private rightsData = {
            id:'',
            rightsName: '',
            rightsDesc: '',
            rightsState: true,
            rightsType: '',
            rightsMethod:'',
            rightsPath: '',
            pid: 0,
            level: 0
        };
        @Ref() readonly form?: ElForm;
        private showAddRightsDialog(){
            this.rightsData.id = ''; // 请求编辑时记录的id
            this.rightsDialogVisible = true;
            this.form ? this.form.resetFields() : '';
            this.isEditRights = false;
        }
        private createRights(){
            this.form!.validate((flag)=>{
                if(flag){
                    this.rightsDialogVisible = false;
                    createRights(this.rightsData)
                        .then((response:any)=>{
                            if(response.status === 200){
                                this.getRightsList();
                                console.log(response);
                                
                                (this as any).$message.success('添加权限成功');
                            }else{
                                (this as any).$message.error(response.data.msg);
                            }
                        })
                        .catch((error)=>{
                            (this as any).$message.error(error.response.data.msg);
                        })
                }else{
                    (this as any).$message.error('数据格式不对');
                }
            });
        };
        private handlerRights(){
            if(this.isEditRights){
                this.editRights();
            }else{
                this.createRights();
            }
        }
        @Watch('rightsData.rightsType', {deep: true})
        typeChange(newValue:any, oldValue:any){
            const obj = {rightsType:this.rightsData.rightsType, level:this.rightsData.level - 1};
            getRights(obj)
                .then((response:any)=>{
                    if(response.status === 200){
                        this.parentRights = response.data.data;
                    }else{
                        (this as any).$message.error(response.data.msg);
                    }
                })
                .catch((error)=>{
                    (this as any).$message.error(error.response.data.msg);
                });
        }
        @Watch('rightsData.level', {deep: true})
        levelChange(newValue:any, oldValue:any){
            if(newValue === 0)return this.rightsData.pid = 0;
            const obj = {rightsType: this.rightsData.rightsType, level:this.rightsData.level - 1};
            getRights(obj)
                .then((response:any)=>{
                    if(response.status === 200){
                       this.parentRights = response.data.data;
                    }else{
                        (this as any).$message.error(response.data.msg);
                    }
                })
                .catch((error)=>{
                    (this as any).$message.error(error.response.data.msg);
                });
        }

        // 编辑权限相关代码
        private isEditRights = false;
        private showEditRightsDialog(rights:any){
            this.rightsDialogVisible = true;
            this.form ? this.form.resetFields() : '';
            this.rightsData = Object.assign(this.rightsData, rights);
            this.isEditRights = true;
        }
        private editRights(){
            this.form!.validate((flag)=>{
                if(flag){
                    this.rightsDialogVisible = false;
                    updateRights(this.rightsData.id, this.rightsData)
                        .then((response:any)=>{
                            if(response.status === 200){
                                this.getRightsList();
                                (this as any).$message.success('更新权限成功');
                            }else{
                                (this as any).$message.error(response.data.msg);
                            }
                        })
                        .catch((error)=>{
                            (this as any).$message.error(error.response.data.msg);
                        })
                }else{
                    (this as any).$message.error('数据格式不对');
                }
            });
        }

        // 修改权限状态相关代码
        private changeRightsState(rights:any){
            updateRights(rights.id, rights)
                .then((response:any)=>{
                    if(response.status === 200){
                        const idx = this.tableData.findIndex((obj)=>{
                            return obj.id === this.rightsData.id;
                        });
                        this.$set(this.tableData, idx, this.rightsData);
                        (this as any).$message.success('更新权限成功');
                    }else{
                        (this as any).$message.error(response.data.msg);
                    }
                })
                .catch((error)=>{
                    (this as any).$message.error(error.response.data.msg);
                })
        }

        // 删除权限相关代码
        private destroyRights(id:string){
            destroyRights(id)
                .then((response:any)=>{
                    if(response.status === 200){
                        const idx = this.tableData.findIndex((obj)=>{
                            return obj.id === id;
                        });
                        this.tableData.splice(idx, 1);
                        this.getRightsList();
                        (this as any).$message.success('删除角色成功');
                    }else{
                        (this as any).$message.error(response.data.msg);
                    }
                })
                .catch((error)=>{
                    (this as any).$message.error(error.response.data.msg);
                })
        }
    }
</script>

<style lang="scss" scoped>
    .el-breadcrumb{
        padding-bottom: 20px;
    }
    .demo-form-inline{
        display: flex;
        justify-content: center;
    }
    .query_rights{
        padding: 0 20px;
    }
    .el-pagination{
        padding-top: 20px;
    }
</style>
