import axios from 'axios'
const source = axios.CancelToken.source();

// 进行一些全局配置
axios.defaults.baseURL = 'http://127.0.0.1:7001';
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true; // 让axios发送请求的时候带上cookie

const isRequest = (actionRights:any, path:string, method:string)=>{
    const reg = new RegExp(`^${actionRights.rightsPath}(/[0-9]*)?$`, 'i');
    if(reg.test(path) && actionRights.rightsMethod === method) return true;
    if(actionRights.children){
        for(let i = 0; i < actionRights.children.length; i++){
            const item = actionRights.children[i];
            if(isRequest(item, path, method)) return true;
        }
    }
    return false;
}
const getActionRights = ()=>{
    const data = sessionStorage.getItem('userInfo');
    if(!data) return null;
    const userInfo = JSON.parse(data);
    const actionRights = userInfo.rightsTree.filter((rights:any)=>{
        if(rights.rightsType === 'action') return rights;
    });
    return actionRights[0];
};
let actionRights: any;

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    if (!actionRights) {
      actionRights = getActionRights()
    }
    const curPath = config.url || '';
    const curMethod = config.method || '';
    if(curPath.startsWith('/api/v1')){
        const flag = isRequest(actionRights, curPath, curMethod);
        if(!flag){
            config.cancelToken = source.token;
            source.cancel('没有对应的请求权限');
        }
    }
    // 在发送请求之前做些什么
    return config
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
});

// 封装自己的get/post方法
export default {
    get: function (path = '', data = {}) {
        return new Promise(function (resolve, reject) {
            axios.get(path, {
                params: data
            })
                .then(function (response) {
                    resolve(response)
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    },
    post: function (path = '', data = {}) {
        return new Promise(function (resolve, reject) {
            axios.post(path, data)
                .then(function (response) {
                    resolve(response)
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    },
    delete:function (path = '',data={}){
      return new Promise(function (resolve, reject) {
        axios.delete(path,{data:data})
            .then(function (response) {
                resolve(response)
            })
            .catch(function (error) {
                reject(error)
            })
    })
    },
    put:function (path = '', data = {}) {
      return new Promise(function (resolve, reject) {
          axios.put(path, data)
              .then(function (response) {
                  resolve(response)
              })
              .catch(function (error) {
                  reject(error)
              })
      })
  },
    all: function (list:any[]) {
        return new Promise(function (resolve, reject) {
            axios.all(list)
                .then(axios.spread(function (...result) {
                    // 两个请求现在都执行完成
                    resolve(result)
                }))
                .catch(function (err) {
                    reject(err)
                })
        })
    }
}
