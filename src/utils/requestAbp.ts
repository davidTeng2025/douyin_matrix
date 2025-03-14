// src/utils/requestAbp.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

// 创建 axios 实例
const abpInstance: AxiosInstance = axios.create({
  baseURL: '/abp', // 代理前缀
  withCredentials: true,
  timeout: 3000000,
  headers: {
    'Content-Type': 'application/json'
  }
  // 根据需要添加更多配置
})

// 请求拦截器
abpInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么，例如添加 token
    // const token = getToken()
    // if (token) {
    //   config.headers = {
    //     ...config.headers,
    //     'Authorization': `Bearer ${token}`
    //   }
    // }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
abpInstance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default abpInstance 