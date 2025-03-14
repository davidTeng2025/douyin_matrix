import request from '@/config/axiosABP'

// 查询ABP成品视频列表
export const SubmissionApiABP = {
  // 查询媒体投稿分页
  getCompositeSameVideo: async (data: any) => {
    return await request.post({ url: `/abp/api/abpscript/getCompositeSameVideo`, data })
  },
}
