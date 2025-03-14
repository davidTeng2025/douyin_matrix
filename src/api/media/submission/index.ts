import request from '@/config/axios'

// 媒体投稿 VO
export interface SubmissionVO {
  accountId: string // 账号ID
  title: string // 标题
  videoPath: string // 视频路径
  imagePath: string // 封面路径
  status: string // 状态
  publishBy: string // 发布者
  publishTime: Date // 发布时间
}

// 媒体投稿 API
export const SubmissionApi = {
  // 查询媒体投稿分页
  getSubmissionPage: async (params: any) => {
    return await request.get({ url: `/media/submission/page`, params })
  },

  // 查询媒体投稿详情
  getSubmission: async (id: number) => {
    return await request.get({ url: `/media/submission/get?id=` + id })
  },

  // 新增媒体投稿
  createSubmission: async (data: SubmissionVO) => {
    return await request.post({ url: `/media/submission/create`, data })
  },

  // 修改媒体投稿
  updateSubmission: async (data: SubmissionVO) => {
    return await request.put({ url: `/media/submission/update`, data })
  },

  // 删除媒体投稿
  deleteSubmission: async (id: number) => {
    return await request.delete({ url: `/media/submission/delete?id=` + id })
  },

  // 导出媒体投稿 Excel
  exportSubmission: async (params) => {
    return await request.download({ url: `/media/submission/export-excel`, params })
  },

  // 获取当前账户的企微微信EmpID
  getWeComAccount: async () => {
    return await request.get({ url: `/media/submission/wecomaccount` })
  },

  // 获取当前账户的企微微信EmpID
  postSubmission: async (accountID: string) => {
    return await request.get({ url: `/media/simulate/account?accountId=` + accountID })
  }
}
