import abpInstance from '@/utils/requestAbp' // 引入 abp 的 Axios 实例

// 获取员工头像
export function getEmployeeAvatar(data) {
  console.log('请求参数:', data); // 打印请求参数

  return abpInstance.post('/api/abpscript/avator', { // 使用相对路径
    data: {
      emp_id: data.empId
    }
  }).then(response => {
    console.log('响应结果:', response); // 打印响应结果
    return response.data;
  }).catch(error => {
    console.log('请求错误:', error); // 打印错误信息
    throw error; // 抛出错误，以便调用者可以进一步处理
  });
}

// 获取 SBU 列表
export function getSbuList() {
  return abpInstance.get('/api/abpscript/getSbuList')
    .then(response => {
      if (response.data && response.data.code === 0) {
        return response.data;
      } else {
        throw new Error(response.data.msg || '接口返回错误');
      }
    })
    .catch(error => {
      console.error('请求错误:', error);
      throw error;
    });
}

// 根据 SBU 获取视频模板
export function getVideoTemplateBySbu(sbu) {
  console.log('请求参数:', sbu); // 打印请求参数
  return abpInstance.post('/api/abpscript/getVideoTemplateBySbu', {
    data: {
      sbu: sbu, // 传递的参数
    },
  })
    .then(response => {
      if (response.data && response.data.code === 0) {
        return response.data; // 返回成功的数据
      } else {
        throw new Error(response.data.msg || '接口返回错误'); // 抛出错误信息
      }
    })
    .catch(error => {
      console.error('请求错误:', error); // 打印错误信息
      throw error; // 抛出错误
    });
}

// 获取员工的可以用的数字人视频
export function getAbpTemplateVideo(data) {
  console.log('请求参数:', data); // 打印请求参数
  return abpInstance.post('/api/abpscript/getAbpTemplateVideo', {
    data: {
      emp_id: data.empId,
    },
  }).then(response => {
    if (response.data && response.data.code === 0) {
      return response.data;
    } else {
      throw new Error(response.data.msg || '接口返回错误');
    }
  }).catch(error => {
    console.error('请求错误:', error);
    throw error;
  });
}

// 获取员工已经合成的视频
export function getAbpCompositeVideo(data) {
  console.log('请求参数:', data); // 打印请求参数
  return abpInstance.post('/api/abpscript/getAbpCompositeVideo', {
    data: {
      emp_id: data.empId,
    },
  }).then(response => {
    if (response.data && response.data.code === 0) {
      console.log('响应结果:', response); // 打印响应结果
      return response.data;
    } else {
      throw new Error(response.data.msg || '接口返回错误');
    }
  }).catch(error => {
    console.error('请求错误:', error);
    throw error;
  });
}

// 获取员工拍同款视频
export function getCompositeSameVideo(data) {
  console.log('请求参数1:', data); // 打印请求参数
  return abpInstance.post('/api/abpscript/getCompositeSameVideo', {
    data: {
      emp_id: data.empId,
    },
  }).then(response => {
    if (response.data && response.data.code === 0) {
      console.log('响应结果:', response); // 打印响应结果
      return response.data;
    } else {
      throw new Error(response.data.msg || '接口返回错误');
    }
  }).catch(error => {
    console.error('请求错误:', error);
    throw error;
  });
}

// 获取员工可以使用的音色
export function getAbpUserTone(data) {
  console.log('请求参数:', data); // 打印请求参数
  return abpInstance.post('/api/abpscript/getAbpUserTone', {
    data: {
      emp_id: data.empId,
    },
  }).then(response => {
    if (response.data && response.data.code === 0) {
      return response.data;
    } else {
      throw new Error(response.data.msg || '接口返回错误');
    }
  }).catch(error => {
    console.error('请求错误:', error);
    throw error;
  });
}

// xmc sbutree + 合成接口 2025年2月26日08:41:42
// 等一会吧，back soon，以毫秒为单位的
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 拍同款-合成视频
export const getOralVideo = (data) => {
  console.log('请求参数:', data); // 打印请求参数

  return abpInstance.post('/api/abpscript/getOralVideo', data)
    .then(response => {
      console.log('响应结果:', response); // 打印响应结果
      return response.data;
    })
    .catch(error => {
      console.log('请求错误:', error); // 打印错误信息
      throw error; // 抛出错误，以便调用者可以进一步处理
    });
};

// 获取产品信息
export const fetchMaterialIdByModel = (data = {}) => {
  console.log('请求参数:', data); // 打印请求参数

  return abpInstance.post('/api/abpscript/ProductMaterial', data)
    .then(response => {
      console.log('响应结果:', response); // 打印响应结果
      return response.data;
    })
    .catch(error => {
      console.log('请求错误:', error); // 打印错误信息
      throw error; // 抛出错误，以便调用者可以进一步处理
    });
};

// 获取产品 3D 图
export const fetchProduct3DImage = (data = {}) => {
  console.log('请求参数:', data); // 打印请求参数

  return abpInstance.post('/api/abpscript/Product3D', data)
    .then(response => {
      console.log('响应结果:', response); // 打印响应结果
      return response.data;
    })
    .catch(error => {
      console.log('请求错误:', error); // 打印错误信息
      throw error; // 抛出错误，以便调用者可以进一步处理
    });
};

// 拍同款-获得口播脚本
export const getOralScript = (data) => {
  console.log('请求参数:', data); // 打印请求参数

  return abpInstance.post('/api/abpscript/getOralScript', data)
    .then(response => {
      console.log('响应结果:', response); // 打印响应结果
      return response.data;
    })
    .catch(error => {
      console.log('请求错误:', error); // 打印错误信息
      throw error; // 抛出错误，以便调用者可以进一步处理
    });
};

// 获得 SBU 品类列表
export const fetchSBUTreeSort = () => {
  console.log('请求: 获取 SBU 品类列表'); // 打印请求信息

  return abpInstance.get('/api/abpscript/SBUTree')
    .then(response => {
      console.log('响应结果:', response); // 打印响应结果
      return response.data;
    })
    .catch(error => {
      console.log('请求错误:', error); // 打印错误信息
      throw error; // 抛出错误，以便调用者可以进一步处理
    });
};

// 找相似，获取品类在所属城市/所属渠道下型号相关信息
export const fetchSimilarModelBySBU = (data) => {
  console.log('请求参数:', data); // 打印请求参数

  return abpInstance.post('/api/abpscript/SimilarModel', data)
    .then(response => {
      console.log('响应结果:', response); // 打印响应结果
      return response.data;
    })
    .catch(error => {
      console.log('请求错误:', error); // 打印错误信息
      throw error; // 抛出错误，以便调用者可以进一步处理
    });
};

//拍同款-根据uuid删除视频
export const deleteCompositeSameVideo = (data) => {
  console.log('请求参数:', data); // 打印请求参数

  return abpInstance.post('/api/abpscript/deleteCompositeSameVideo', data)
    .then(response => {
      console.log('响应结果:', response); // 打印响应结果
      return response.data;
    })
    .catch(error => {
      console.log('请求错误:', error); // 打印错误信息
      throw error; // 抛出错误，以便调用者可以进一步处理
    });
};

//下载合成的视频
export const getDownloadCosFileUrl = (data) => {
  console.log('请求参数:', data); // 打印请求参数

  return abpInstance.post('/api/abpscript/getDownloadCosFileUrl', data)
    .then(response => {
      console.log('响应结果:', response); // 打印响应结果
      return response.data;
    })
    .catch(error => {
      console.log('请求错误:', error); // 打印错误信息
      throw error; // 抛出错误，以便调用者可以进一步处理
    });
}; 