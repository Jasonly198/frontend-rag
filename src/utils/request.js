import axios from 'axios';

// 创建 Axios 实例
const service = axios.create({
  baseURL: 'http://localhost:8080', // 基础 URL
  timeout: 5000, // 请求超时时间
});

// // 请求拦截器
// service.interceptors.request.use(
//   (config) => {
//     // 可以在此处添加通用请求头或认证 token
//     // config.headers['Authorization'] = 'Bearer ' + token;
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
//
// // 响应拦截器
// service.interceptors.response.use(
//   (response) => {
//     // 在此处理响应数据，通常直接返回 response.data
//     return response.data;
//   },
//   (error) => {
//     // 在此处理响应错误
//     console.error('Request Error:', error);
//     return Promise.reject(error);
//   }
// );

export default service;
