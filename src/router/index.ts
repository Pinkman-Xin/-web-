import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Admin from '../views/Admin.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users.vue'
import Roles from '../components/Roles.vue'
import Rights from '../components/Rights.vue'
import Cookies from 'js-cookie'
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    redirect:'/welcome',
    children:[
        {path:'/welcome', component:Welcome},
        {path:'/users', component:Users},
        {path:'/roles', component:Roles},
        {path:'/rights', component:Rights}
    ]
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// router.beforeEach((to, from, next) => {
//   // 1.如果访问的是注册或者登录, 那么就放行
//   if(to.path === '/login' || to.path === '/register'){
//       return next();
//   }
//   // 2.获取当前的登录状态
//   // const token = sessionStorage.getItem('token');
//   const token = Cookies.get('token');
//   // 3.如果访问的是其它路由地址, 那么就需要判断是否已经登录
//   //   如果已经登录, 那么就放行, 如果没有登录, 那么就强制跳转到登录界面
//   if(!token){
//       return next('/login');
//   }
//   next();
// });
router.beforeEach((to, from, next) => {
  // 1.如果访问的是注册或者登录, 那么就放行
  if(to.path === '/login' || to.path === '/register'){
      return next();
  }
  // 2.获取当前的登录状态
  const token = Cookies.get('token');
  // 3.如果访问的是其它路由地址, 那么就需要判断是否已经登录
  //   如果已经登录, 那么就放行, 如果没有登录, 那么就强制跳转到登录界面
  if(!token){
      return next('/login');
  }
  const routerRights = getRouterRights();
  const flag =  isNext(routerRights, to.path);
  if(flag){
      next();
  }else{
      next(false);
  }
});
const isNext = (routerRights:any, path:string)=>{
  if(routerRights.rightsPath === path) return true;
  if(routerRights.children){
      for(let i = 0; i < routerRights.children.length; i++){
          const item = routerRights.children[i];
          if(isNext(item, path)) return true;
      }
  }
  return false;
}
const getRouterRights = ()=>{
  const data = sessionStorage.getItem('userInfo');
  if(!data) return null;
  const userInfo = JSON.parse(data);
  const routerRights = userInfo.rightsTree.filter((rights: { rightsType: string })=>{
      if(rights.rightsType === 'router') return rights;
  });
  return routerRights[0];
}
export default router
