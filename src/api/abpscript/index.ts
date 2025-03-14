import abpInstance from '@/utils/requestAbp'

// 定义接口类型
export interface VideoItem {
  uuid: string
  cover_url: string
  generate_ready: string
  timestamp: string
  video_cos_key: string
  line_video_url: string
}

export interface DownloadParams {
  key: string
  disposition_mode: string
}

// 工具函数：暂停执行
export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// API方法
export const AbpScriptApi = {
  // 获取拍同款合成视频
  getCompositeSameVideo: (data: { empId: string }) => {
    console.log('请求参数:', data)
    return abpInstance.post('/api/abpscript/getCompositeSameVideo', {
      data: {
        emp_id: data.empId,
      }
    }).then(response => {
      if (response.data && response.data.code === 0) {
        console.log('响应结果:', response)
        return response.data
      } else {
        throw new Error(response.data.msg || '接口返回错误')
      }
    }).catch(error => {
      console.error('请求错误:', error)
      throw error
    })
  },
  
  // 删除拍同款视频
  deleteCompositeSameVideo: (data: { data: { uuid: string } }) => {
    console.log('请求参数:', data)
    return abpInstance.post('/api/abpscript/deleteCompositeSameVideo', data)
      .then(response => {
        console.log('响应结果:', response)
        return response.data
      })
      .catch(error => {
        console.log('请求错误:', error)
        throw error
      })
  },
  
  // 下载合成的视频
  getDownloadCosFileUrl: (data: { data: DownloadParams }) => {
    console.log('请求参数:', data)
    return abpInstance.post('/api/abpscript/getDownloadCosFileUrl', data)
      .then(response => {
        console.log('响应结果:', response)
        return response.data
      })
      .catch(error => {
        console.log('请求错误:', error)
        throw error
      })
  },

  // 获取员工头像
  getEmployeeAvatar: (data: { empId: string }) => {
    console.log('请求参数:', data)
    return abpInstance.post('/api/abpscript/avator', {
      data: {
        emp_id: data.empId
      }
    }).then(response => {
      console.log('响应结果:', response)
      return response.data
    }).catch(error => {
      console.log('请求错误:', error)
      throw error
    })
  },

  // 获取 SBU 列表
  getSbuList: () => {
    return abpInstance.get('/api/abpscript/getSbuList')
      .then(response => {
        if (response.data && response.data.code === 0) {
          return response.data
        } else {
          throw new Error(response.data.msg || '接口返回错误')
        }
      })
      .catch(error => {
        console.error('请求错误:', error)
        throw error
      })
  },

  // 根据 SBU 获取视频模板
  getVideoTemplateBySbu: (sbu: string) => {
    console.log('请求参数:', sbu)
    return abpInstance.post('/api/abpscript/getVideoTemplateBySbu', {
      data: {
        sbu: sbu,
      },
    })
      .then(response => {
        if (response.data && response.data.code === 0) {
          return response.data
        } else {
          throw new Error(response.data.msg || '接口返回错误')
        }
      })
      .catch(error => {
        console.error('请求错误:', error)
        throw error
      })
  },

  // 获取员工的可以用的数字人视频
  getAbpTemplateVideo: (data: { empId: string }) => {
    console.log('请求参数:', data)
    return abpInstance.post('/api/abpscript/getAbpTemplateVideo', {
      data: {
        emp_id: data.empId,
      },
    }).then(response => {
      if (response.data && response.data.code === 0) {
        return response.data
      } else {
        throw new Error(response.data.msg || '接口返回错误')
      }
    }).catch(error => {
      console.error('请求错误:', error)
      throw error
    })
  },

  // 获取员工已经合成的视频
  getAbpCompositeVideo: (data: { empId: string }) => {
    console.log('请求参数:', data)
    return abpInstance.post('/api/abpscript/getAbpCompositeVideo', {
      data: {
        emp_id: data.empId,
      },
    }).then(response => {
      if (response.data && response.data.code === 0) {
        console.log('响应结果:', response)
        return response.data
      } else {
        throw new Error(response.data.msg || '接口返回错误')
      }
    }).catch(error => {
      console.error('请求错误:', error)
      throw error
    })
  },

  // 根据模型获取素材ID
  fetchMaterialIdByModel: (data: { data: { model: string } }) => {
    console.log('请求参数:', data)
    return abpInstance.post('/api/abpscript/fetchMaterialIdByModel', data)
      .then(response => {
        console.log('响应结果:', response)
        return response.data
      })
      .catch(error => {
        console.log('请求错误:', error)
        throw error
      })
  },

  // 获取产品3D图像
  fetchProduct3DImage: (data: { data: { model: string } }) => {
    console.log('请求参数:', data)
    return abpInstance.post('/api/abpscript/fetchProduct3DImage', data)
      .then(response => {
        console.log('响应结果:', response)
        return response.data
      })
      .catch(error => {
        console.log('请求错误:', error)
        throw error
      })
  },

  // 获取口播脚本
  getOralScript: (data: { data: { emp_id: string, model: string, digital_human_id: string, video_template_id: string } }) => {
    console.log('请求参数:', data)
    return abpInstance.post('/api/abpscript/getOralScript', data)
      .then(response => {
        if (response.data && response.data.code === 0) {
          return response.data
        } else {
          throw new Error(response.data.msg || '接口返回错误')
        }
      })
      .catch(error => {
        console.error('请求错误:', error)
        throw error
      })
  },

  // 生成口播视频
  getOralVideo: (data: { data: any }) => {
    console.log('请求参数:', data)
    return abpInstance.post('/api/abpscript/getOralVideo', data)
      .then(response => {
        if (response.data && response.data.code === 0) {
          return response.data
        } else {
          throw new Error(response.data.msg || '接口返回错误')
        }
      })
      .catch(error => {
        console.error('请求错误:', error)
        throw error
      })
  }
} 