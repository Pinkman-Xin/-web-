import Network from './network';
export const registerUser = (data:{})=>Network.post('/register', data);
export const githubUser = ()=>Network.get('/github');
export const sendCode2Email = (data:{})=>Network.get('/emailcode', data);
export const loginUser = (data:{})=>Network.post('/login', data);
export const getUsers = (data:{})=>Network.get('/api/v1/users',data);
export const createUsers = (data:{})=>Network.post('/api/v1/users',data);
export const destroyUsers = (id:string)=>Network.delete(`/api/v1/users/${id}`);
export const updateUsers = (id:string,data:{})=>Network.put(`/api/v1/users/${id}`,data);

export const getRoles = (data:{})=>Network.get('/api/v1/roles', data);
export const createRoles = (data:{})=>Network.post('/api/v1/roles', data);
export const destroyRoles = (id:string)=>Network.delete(`/api/v1/roles/${id}`);
export const updateRoles = (id:string, data:{})=>Network.put(`/api/v1/roles/${id}`, data);

export const createUserRole = (data:{})=>Network.post('/api/v1/userrole',data);
export const destroyUserRoles = (userId:string,data:{})=>Network.delete(`/api/v1/userrole/${userId}`,data);

export const getRights = (data:{})=>Network.get('/api/v1/rights', data);
// export const getRightsCategory = (type:string,data:{})=>Network.get(`/api/v1/rights/${type}`, data);
export const createRights = (data:{})=>Network.post('/api/v1/rights', data);
export const destroyRights = (id:string)=>Network.delete(`/api/v1/rights/${id}`);
export const updateRights = (id:string, data:{})=>Network.put(`/api/v1/rights/${id}`, data);

export const createRoleRights = (data:{})=>Network.post('/api/v1/roleRights', data);
export const destroyRoleRights = (roleId:string, data:{})=>Network.delete(`/api/v1/roleRights/${roleId}`, data);
